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
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { unlink } from 'fs/promises'
import { uploadComprovanteConfig } from '../../config/upload.config'
import { AuthUser, Campus } from '../auth/auth-user.decorator'
import { AuthRoles } from '../auth/auth.decorator'
import { UUIDParamDto } from '../base/dto/params.dto'
import { MyCampus } from '../campi/entities/campus.entity'
import { MyUser } from '../users/entities/user.entity'
import {
  AvaliarDocumentoComprobatorioDto,
  CreateInscricaoDto,
  MarcarPresencaDto,
  MarcarPresencaForaDaListaDto,
  UpdateInscricaoDto,
  VerificarPresencaParamsDto,
  VerificarPresencaResponseDto
} from './dto/inscricao.dto'
import { Inscricao, InscricaoAluno } from './entities/inscricao.entity'
import { InscricoesService } from './inscricoes.service'

@ApiTags('inscricoes')
@Controller('inscricoes')
export class InscricoesController {
  constructor(private readonly inscricoesService: InscricoesService) {}

  @Post('inscrever/:id')
  @AuthRoles('aluno')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateInscricaoDto })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CreateInscricaoDto })
  @UseInterceptors(FileInterceptor('file', uploadComprovanteConfig))
  async createInscricao(
    @Campus() campus: MyCampus,
    @AuthUser() authUser: MyUser,
    @Param() { id }: UUIDParamDto,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateInscricaoDto
  ): Promise<InscricaoAluno | null> {
    try {
      return await this.inscricoesService.createInscricao(id, campus.id, authUser.id, { ...data, file })
    } finally {
      if (file?.path) void unlink(file.path) // Remove o arquivo temporário
    }
  }

  @Post('cancelar/:id')
  @AuthRoles('aluno')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async cancelar(
    @Campus() campus: MyCampus,
    @AuthUser() authUser: MyUser,
    @Param() { id }: UUIDParamDto
  ): Promise<InscricaoAluno | null> {
    return await this.inscricoesService.cancelarInscricao(id, campus.id, authUser.id)
  }

  @Get('/verificar-presenca/:chamadaId/:alunoId')
  @AuthRoles('admin', 'gestor', 'colaborador')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: VerificarPresencaResponseDto })
  async verificarPresenca(
    @Campus() campus: MyCampus,
    @Param() { chamadaId, alunoId }: VerificarPresencaParamsDto
  ): Promise<VerificarPresencaResponseDto> {
    return await this.inscricoesService.verificarPresenca(chamadaId, alunoId, campus.id)
  }

  @Post('/marcar-presenca/:id')
  @AuthRoles('admin', 'gestor', 'colaborador')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async marcarPresenca(
    @Campus() campus: MyCampus,
    @Param() { id }: UUIDParamDto,
    @Body() data: MarcarPresencaDto
  ): Promise<void> {
    await this.inscricoesService.marcarPresenca(id, campus.id, data)
  }

  @Post('/presenca-fora-da-lista/:id')
  @AuthRoles('admin', 'gestor', 'colaborador')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async presencaForaDaLista(
    @Campus() campus: MyCampus,
    @Param() { id }: UUIDParamDto,
    @Body() data: MarcarPresencaForaDaListaDto
  ): Promise<void> {
    await this.inscricoesService.presencaForaDaListaColaborador(id, campus.id, data.alunoId)
  }

  @Post('/avaliar-documento-comprobatorio/:id')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async avaliarDocumentoComprobatorio(
    @Campus() campus: MyCampus,
    @Param() { id }: UUIDParamDto,
    @Body() data: AvaliarDocumentoComprobatorioDto
  ): Promise<void> {
    await this.inscricoesService.avaliarDocumentoComprobatorio(id, campus.id, data)
  }

  @Patch('/:id')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Inscricao })
  async update(
    @Campus() campus: MyCampus,
    @Param() { id }: UUIDParamDto,
    @Body() data: UpdateInscricaoDto
  ): Promise<Inscricao | null> {
    const result = await this.inscricoesService.update(id, campus.id, data)
    if (!result) throw new NotFoundException(`Inscrição with id '${id}' not found`)
    return result
  }

  @Delete('/:id')
  @AuthRoles('admin', 'gestor')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Inscricao })
  async remove(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<Inscricao | null> {
    const result = await this.inscricoesService.remove(id, campus.id)
    if (!result) throw new NotFoundException(`Inscrição with id '${id}' not found`)
    return result
  }
}
