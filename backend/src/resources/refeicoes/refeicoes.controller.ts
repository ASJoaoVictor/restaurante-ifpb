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
  Query
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { getPaginationAPISchema, Paginated } from '../../utils/pagination'
import { Campus } from '../auth/auth-user.decorator'
import { AuthRoles } from '../auth/auth.decorator'
import { UUIDParamDto } from '../base/dto/params.dto'
import { MyCampus } from '../campi/entities/campus.entity'
import { CreateRefeicaoDto, RefeicaoQueryOptionsDto, UpdateRefeicaoDto } from './dto/refeicao.dto'
import { Refeicao } from './entities/refeicao.entity'
import { RefeicoesService } from './refeicoes.service'

@AuthRoles('admin', 'gestor')
@ApiTags('refeicoes')
@Controller('refeicoes')
export class RefeicoesController {
  constructor(private readonly refeicoesService: RefeicoesService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ schema: getPaginationAPISchema(Refeicao) })
  async getAll(@Campus() campus: MyCampus, @Query() query: RefeicaoQueryOptionsDto): Promise<Paginated<Refeicao>> {
    return this.refeicoesService.getAllWithPagination(campus.id, query)
  }

  @Get('/count')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Number })
  async count(@Campus() campus: MyCampus): Promise<number> {
    return this.refeicoesService.count(campus.id)
  }

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Refeicao, isArray: true })
  async getAllWithoutPagination(@Campus() campus: MyCampus): Promise<Refeicao[]> {
    return this.refeicoesService.getAll(campus.id)
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Refeicao })
  async getOne(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<Refeicao | null> {
    const result = await this.refeicoesService.getOne(id, campus.id)
    if (!result) throw new NotFoundException(`Refeição with id '${id}' not found`)
    return result
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: Refeicao })
  async create(@Campus() campus: MyCampus, @Body() data: CreateRefeicaoDto): Promise<Refeicao | null> {
    return this.refeicoesService.create(campus.id, data)
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Refeicao })
  async update(
    @Campus() campus: MyCampus,
    @Param() { id }: UUIDParamDto,
    @Body() data: UpdateRefeicaoDto
  ): Promise<Refeicao | null> {
    const result = await this.refeicoesService.update(id, campus.id, data)
    if (!result) throw new NotFoundException(`Refeição with id '${id}' not found`)
    return result
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Refeicao })
  async remove(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<Refeicao | null> {
    const result = await this.refeicoesService.remove(id, campus.id)
    if (!result) throw new NotFoundException(`Refeição with id '${id}' not found`)
    return result
  }
}
