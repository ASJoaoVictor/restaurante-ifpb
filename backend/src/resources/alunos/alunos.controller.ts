import {
  BadRequestException,
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
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { uploadImportAlunosConfig } from '../../config/upload.config'
import { getPaginationAPISchema, Paginated } from '../../utils/pagination'
import { AuthUser, Campus } from '../auth/auth-user.decorator'
import { AuthRoles } from '../auth/auth.decorator'
import { UUIDParamDto } from '../base/dto/params.dto'
import { MyCampus } from '../campi/entities/campus.entity'
import { MyUser } from '../users/entities/user.entity'
import { AlunosImportService } from './alunos-import.service'
import { AlunosService } from './alunos.service'
import {
  AlunoQRCodeDto,
  AlunoQueryOptionsDto,
  ControleDeFaltasAlunoDto,
  CreateAlunoDto,
  ImportarAlunosDto,
  ImportarAlunosResponseDto,
  UpdateAlunoDto
} from './dto/aluno.dto'
import { CreatePreferenciaNotificacaoDto, PreferenciasNotificacoesRefeicao } from './dto/preferencia-notificacao.dto'
import { Aluno, AlunoDetalhes } from './entities/aluno.entity'

@ApiTags('alunos')
@Controller('alunos')
export class AlunosController {
  constructor(
    private readonly alunosService: AlunosService,
    private readonly alunosImportService: AlunosImportService
  ) {}

  @Get('/')
  @AuthRoles('admin', 'gestor', 'colaborador')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ schema: getPaginationAPISchema(Aluno) })
  async getAll(@Campus() campus: MyCampus, @Query() query: AlunoQueryOptionsDto): Promise<Paginated<Aluno>> {
    return this.alunosService.getAllWithPagination(campus.id, query)
  }

  @Get('/count')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Number })
  async count(@Campus() campus: MyCampus): Promise<number> {
    return this.alunosService.count(campus.id)
  }

  @Get('/qrcode')
  @AuthRoles('aluno')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AlunoQRCodeDto })
  async getQRCode(@Campus() campus: MyCampus, @AuthUser() user: MyUser): Promise<AlunoQRCodeDto> {
    return this.alunosService.getQRCode(user.id, campus.id)
  }

  @Get('/preferencias-notificacoes')
  @AuthRoles('aluno')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PreferenciasNotificacoesRefeicao })
  async getPreferenciasNotificacoes(
    @AuthUser() user: MyUser,
    @Campus() campus: MyCampus
  ): Promise<PreferenciasNotificacoesRefeicao> {
    return this.alunosService.getPreferenciasNotificacoes(user.id, campus.id)
  }

  @Get(':id/detalhes')
  @AuthRoles('admin', 'gestor', 'colaborador')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AlunoDetalhes })
  async getDetalhes(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<AlunoDetalhes> {
    const result = await this.alunosService.getDetalhes(id, campus.id)
    if (!result) throw new NotFoundException(`Aluno with id '${id}' not found`)
    return result
  }

  @Post(':id/faltas')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Aluno })
  async definirFaltas(
    @Campus() campus: MyCampus,
    @Param() { id }: UUIDParamDto,
    @Body() data: ControleDeFaltasAlunoDto
  ): Promise<Aluno> {
    const result = await this.alunosService.definirFaltas(campus.id, id, data)
    if (!result) throw new NotFoundException(`Aluno with id '${id}' not found`)
    return result
  }

  @Post(':id/remover-suspensao')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Aluno })
  async removerSuspensao(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<Aluno> {
    const result = await this.alunosService.removerSuspensao(campus.id, id)
    if (!result) throw new NotFoundException(`Aluno with id '${id}' not found`)
    return result
  }

  @Get('/:id')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Aluno })
  async getOne(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<Aluno | null> {
    const result = await this.alunosService.getOne(id, campus.id)
    if (!result) throw new NotFoundException(`Aluno with id '${id}' not found`)
    return result
  }

  @Post('/')
  @AuthRoles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: Aluno })
  async create(@Campus() campus: MyCampus, @Body() data: CreateAlunoDto): Promise<Aluno | null> {
    return this.alunosService.create(campus.id, data)
  }

  @Patch('/:id')
  @AuthRoles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Aluno })
  async update(
    @Campus() campus: MyCampus,
    @Param() { id }: UUIDParamDto,
    @Body() data: UpdateAlunoDto
  ): Promise<Aluno | null> {
    const result = await this.alunosService.update(id, campus.id, data)
    if (!result) throw new NotFoundException(`Aluno with id '${id}' not found`)
    return result
  }

  @Delete('/:id')
  @AuthRoles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Aluno })
  async remove(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<Aluno | null> {
    const result = await this.alunosService.remove(id, campus.id)
    if (!result) throw new NotFoundException(`Aluno with id '${id}' not found`)
    return result
  }

  @Post('/upload')
  @AuthRoles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: ImportarAlunosResponseDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ImportarAlunosDto })
  @UseInterceptors(FileInterceptor('file', uploadImportAlunosConfig))
  async importar(
    @Campus() campus: MyCampus,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ImportarAlunosDto
  ): Promise<ImportarAlunosResponseDto> {
    if (!file) {
      throw new BadRequestException('Arquivo é obrigatório')
    }

    return this.alunosImportService.importarAlunos(campus.id, file, body.excluirAlunosNaoListados)
  }

  @Post('/welcome-seen')
  @AuthRoles('aluno')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async markWelcomeSeen(@AuthUser() user: MyUser, @Campus() campus: MyCampus): Promise<void> {
    await this.alunosService.markWelcomeSeen(user.id, campus.id)
  }

  @Post('/configurar-notificacoes')
  @AuthRoles('aluno')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async configurarNotificacoes(
    @Campus() campus: MyCampus,
    @AuthUser() user: MyUser,
    @Body() data: CreatePreferenciaNotificacaoDto
  ): Promise<void> {
    return this.alunosService.configurarNotificacoes(user.id, campus.id, data)
  }
}
