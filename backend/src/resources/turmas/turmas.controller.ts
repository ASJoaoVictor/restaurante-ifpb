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
import { CreateTurmaDto, TurmaQueryOptionsDto, UpdateTurmaDto } from './dto/turma.dto'
import { FullTurma, Turma } from './entities/turma.entity'
import { TurmasService } from './turmas.service'

@AuthRoles('admin')
@ApiTags('turmas')
@Controller('turmas')
export class TurmasController {
  constructor(private readonly turmasService: TurmasService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ schema: getPaginationAPISchema(Turma) })
  async getAll(@Campus() campus: MyCampus, @Query() query: TurmaQueryOptionsDto): Promise<Paginated<Turma>> {
    return this.turmasService.getAllWithPagination(campus.id, query)
  }

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Turma, isArray: true })
  async getAllWithoutPagination(@Campus() campus: MyCampus): Promise<Turma[]> {
    return this.turmasService.getAll(campus.id)
  }

  @Get('/count')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Number })
  async count(@Campus() campus: MyCampus): Promise<number> {
    return this.turmasService.count(campus.id)
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Turma })
  async getOne(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<Turma | null> {
    const result = await this.turmasService.getOne(id, campus.id)
    if (!result) throw new NotFoundException(`Turma with id '${id}' not found`)
    return result
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: Turma })
  async create(@Campus() campus: MyCampus, @Body() data: CreateTurmaDto): Promise<Turma | null> {
    return this.turmasService.create(campus.id, data)
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Turma })
  async update(
    @Campus() campus: MyCampus,
    @Param() { id }: UUIDParamDto,
    @Body() data: UpdateTurmaDto
  ): Promise<Turma | null> {
    const result = await this.turmasService.update(id, campus.id, data)
    if (!result) throw new NotFoundException(`Turma with id '${id}' not found`)
    return result
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Turma })
  async remove(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<FullTurma | null> {
    const result = await this.turmasService.remove(id, campus.id)
    if (!result) throw new NotFoundException(`Turma with id '${id}' not found`)
    return result
  }
}
