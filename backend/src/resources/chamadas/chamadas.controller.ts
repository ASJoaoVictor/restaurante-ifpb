import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  PreconditionFailedException,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiProduces,
  ApiTags
} from '@nestjs/swagger'
import { create } from 'content-disposition'
import { Response } from 'express'
import { env } from '../../config/env.config'
import { uploadImportAlunosConfig } from '../../config/upload.config'
import { getPaginationAPISchema, Paginated } from '../../utils/pagination'
import { AuthUser, Campus } from '../auth/auth-user.decorator'
import { AuthRoles } from '../auth/auth.decorator'
import { UUIDParamDto } from '../base/dto/params.dto'
import { MyCampus } from '../campi/entities/campus.entity'
import { MyUser } from '../users/entities/user.entity'
import { ChamadasAcoesService } from './chamadas-acoes.service'
import { ChamadasCsvService } from './chamadas-csv.service'
import { ChamadasImportarAlunosService } from './chamadas-importar-alunos.service'
import { ChamadasService } from './chamadas.service'
import {
  AprovarPendentesResponseDto,
  ChamadaComTotalInscritosDto,
  ChamadaPresencaDto,
  ChamadaQueryOptionsDto,
  ChamadaResultadoAlunosDto,
  ChamadasDashboardDto,
  CreateChamadaDto,
  ImportarInscricoesDto,
  ImportarInscricoesResponseDto,
  InscricoesPdfQueryDto,
  InserirInscricoesManuaisDto,
  MarcarAusenciasResponseDto,
  UpdateChamadaDto
} from './dto/chamada.dto'
import { Chamada, ChamadaComInscricoes } from './entities/chamada.entity'
import { ChamadasReactPdfService } from './pdf-react/chamadas-react-pdf.service'

@ApiTags('chamadas')
@Controller('chamadas')
export class ChamadasController {
  constructor(
    private readonly chamadasService: ChamadasService,
    private readonly chamadasAcoesService: ChamadasAcoesService,
    private readonly chamadasImportSUAPService: ChamadasImportarAlunosService,
    private readonly chamadasCsvService: ChamadasCsvService,
    private readonly chamadasPdfService: ChamadasReactPdfService
  ) {}

  @Get('/')
  @AuthRoles('admin', 'gestor', 'colaborador')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ schema: getPaginationAPISchema(ChamadaComTotalInscritosDto) })
  async getAll(
    @Campus() campus: MyCampus,
    @Query() query: ChamadaQueryOptionsDto
  ): Promise<Paginated<ChamadaComTotalInscritosDto>> {
    return this.chamadasService.getAllWithPagination(campus.id, query)
  }

  @Get('/recentes')
  @AuthRoles('admin', 'gestor', 'colaborador')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChamadaComTotalInscritosDto, isArray: true })
  async getRecent(@Campus() campus: MyCampus): Promise<ChamadaComTotalInscritosDto[]> {
    return this.chamadasService.getRecent(campus.id)
  }

  @Get('/count')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Number })
  async count(@Campus() campus: MyCampus): Promise<number> {
    return this.chamadasService.count(campus.id)
  }

  @Get('/dashboard')
  @AuthRoles('aluno')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChamadasDashboardDto })
  async dashboard(@AuthUser() authUser: MyUser, @Campus() campus: MyCampus): Promise<ChamadasDashboardDto> {
    return this.chamadasService.dashboard(authUser.id, campus.id)
  }

  @Get('/:id')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Chamada })
  async getOne(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<Chamada> {
    const result = await this.chamadasService.getOne(id, campus.id)
    if (!result) throw new NotFoundException(`Chamada with id '${id}' not found`)
    return result
  }

  @Get('/:id/inscricoes')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChamadaComInscricoes })
  async getOneWithInscricoes(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<ChamadaComInscricoes> {
    const result = await this.chamadasService.getOneWithInscricoes(id, campus.id)
    if (!result) throw new NotFoundException(`Chamada with id '${id}' not found`)
    return result
  }

  @Get('/:id/inscricoes/pdf')
  @AuthRoles('admin', 'gestor', 'colaborador')
  @HttpCode(HttpStatus.OK)
  @ApiProduces('application/pdf')
  @ApiOkResponse({ type: String })
  async gerarPdfInscricoes(
    @Campus() campus: MyCampus,
    @Param() { id }: UUIDParamDto,
    @Query() query: InscricoesPdfQueryDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<StreamableFile> {
    const pdf = await this.chamadasPdfService.gerarListaInscricoes(id, campus.id, query)
    if (!pdf) throw new NotFoundException(`Chamada with id '${id}' not found`)

    res.set({
      'Content-Disposition': create(pdf.filename, { type: 'inline' }),
      'Content-Type': 'application/pdf'
    })

    return new StreamableFile(pdf.data)
  }

  @Get('/:id/inscricoes/csv')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.OK)
  @ApiProduces('text/csv')
  @ApiOkResponse({ type: String })
  async gerarCsvInscricoes(
    @Campus() campus: MyCampus,
    @Param() { id }: UUIDParamDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<StreamableFile> {
    const csv = await this.chamadasCsvService.gerarListaInscricoes(id, campus.id)
    if (!csv) throw new NotFoundException(`Chamada with id '${id}' not found`)

    res.set({
      'Content-Disposition': create(csv.filename, { type: 'attachment' }),
      'Content-Length': csv.data.length,
      'Content-Type': 'text/csv; charset=utf-8'
    })

    return new StreamableFile(csv.data)
  }

  @Get('/:id/presenca')
  @AuthRoles('admin', 'gestor', 'colaborador')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChamadaPresencaDto })
  async getPresenca(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<ChamadaPresencaDto> {
    const result = await this.chamadasService.getPresenca(id, campus.id)
    if (!result) throw new NotFoundException(`Chamada with id '${id}' not found`)
    return { ...result, qrCodeSignaturePublicKey: env.QR_CODE_PUBLIC_KEY }
  }

  @Get('/:id/aprovados')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChamadaResultadoAlunosDto })
  async listaAprovados(
    @Campus() campus: MyCampus,
    @AuthUser() authUser: MyUser,
    @Param() { id }: UUIDParamDto
  ): Promise<ChamadaResultadoAlunosDto> {
    const result = await this.chamadasService.listaAprovados(id, campus.id, authUser.id)
    if (!result) throw new NotFoundException(`Chamada with id '${id}' not found`)
    return result
  }

  @Post('/')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: Chamada })
  async create(@Campus() campus: MyCampus, @Body() data: CreateChamadaDto): Promise<Chamada | null> {
    return this.chamadasService.create(campus.id, data)
  }

  @Patch('/:id')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Chamada })
  async update(
    @Campus() campus: MyCampus,
    @Param() { id }: UUIDParamDto,
    @Body() data: UpdateChamadaDto
  ): Promise<Chamada | null> {
    const result = await this.chamadasService.update(id, campus.id, data)
    if (!result) throw new NotFoundException(`Chamada with id '${id}' not found`)
    return result
  }

  @Delete('/:id')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Chamada })
  async remove(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<Chamada | null> {
    const result = await this.chamadasService.remove(id, campus.id)
    if (!result) throw new NotFoundException(`Chamada with id '${id}' not found`)
    return result
  }

  @Post('/abrir/:id')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiException(() => PreconditionFailedException)
  async abrirChamada(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<void> {
    await this.chamadasAcoesService.abrirChamada(id, campus.id)
  }

  @Post('/fechar/:id')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiException(() => PreconditionFailedException)
  async fecharChamada(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<void> {
    await this.chamadasAcoesService.fecharChamada(id, campus.id)
  }

  @Post('/divulgar-resultado/:id')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiException(() => PreconditionFailedException)
  async divulgarResultadoChamada(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<void> {
    await this.chamadasAcoesService.divulgarResultadoChamada(id, campus.id)
  }

  @Post('/finalizar/:id')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiException(() => PreconditionFailedException)
  async finalizarChamada(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<void> {
    await this.chamadasAcoesService.finalizarChamada(id, campus.id)
  }

  @Post('/encerrar/:id')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiException(() => PreconditionFailedException)
  async encerrarChamada(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<void> {
    await this.chamadasAcoesService.encerrarChamada(id, campus.id)
  }

  @Post('/reabrir/:id')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiException(() => PreconditionFailedException)
  async reabrirChamada(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<void> {
    await this.chamadasAcoesService.reabrirChamada(id, campus.id)
  }

  @Post('/desfazer-finalizar/:id')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiException(() => PreconditionFailedException)
  async desfazerFinalizacaoChamada(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<void> {
    await this.chamadasAcoesService.desfazerFinalizacaoChamada(id, campus.id)
  }

  @Post('/desfazer-abertura/:id')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiException(() => PreconditionFailedException)
  async desfazerAberturaChamada(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<void> {
    await this.chamadasAcoesService.desfazerAberturaChamada(id, campus.id)
  }

  @Post('/importar-suap/:id')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: ImportarInscricoesResponseDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ImportarInscricoesDto })
  @ApiException(() => PreconditionFailedException)
  @UseInterceptors(FileInterceptor('file', uploadImportAlunosConfig))
  async importarInscricoesSuap(
    @Campus() campus: MyCampus,
    @Param() { id }: UUIDParamDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<ImportarInscricoesResponseDto> {
    const result = await this.chamadasImportSUAPService.importarInscricoesSUAP(id, campus.id, file)
    return result
  }

  @Post('/importar/:id')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: ImportarInscricoesResponseDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ImportarInscricoesDto })
  @ApiException(() => PreconditionFailedException)
  @UseInterceptors(FileInterceptor('file', uploadImportAlunosConfig))
  async importarInscricoes(
    @Campus() campus: MyCampus,
    @Param() { id }: UUIDParamDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<ImportarInscricoesResponseDto> {
    const result = await this.chamadasImportSUAPService.importarInscricoes(id, campus.id, file)
    return result
  }

  @Post('/aprovar-pendentes/:id')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AprovarPendentesResponseDto })
  async aprovarPendentes(
    @Campus() campus: MyCampus,
    @Param() { id }: UUIDParamDto
  ): Promise<AprovarPendentesResponseDto> {
    return await this.chamadasAcoesService.aprovarPendentes(id, campus.id)
  }

  @Post('/marcar-ausencias/:id')
  @AuthRoles('admin', 'gestor', 'colaborador')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: MarcarAusenciasResponseDto })
  async marcarAusencias(
    @Campus() campus: MyCampus,
    @Param() { id }: UUIDParamDto
  ): Promise<MarcarAusenciasResponseDto> {
    return await this.chamadasAcoesService.marcarAusencias(id, campus.id)
  }

  @Post('/inserir-inscricoes/:id')
  @AuthRoles('admin', 'gestor', 'colaborador')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async inserirInscricoesManuais(
    @Campus() campus: MyCampus,
    @AuthUser() authUser: MyUser,
    @Param() { id }: UUIDParamDto,
    @Body() body: InserirInscricoesManuaisDto
  ): Promise<void> {
    await this.chamadasAcoesService.inserirInscricoesManuais(id, campus.id, authUser, body.alunoIds)
  }
}
