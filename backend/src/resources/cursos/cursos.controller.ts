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
import { CursosService } from './cursos.service'
import { CreateCursoDto, CursoQueryOptionsDto, UpdateCursoDto } from './dto/curso.dto'
import { Curso } from './entities/curso.entity'

@AuthRoles('admin')
@ApiTags('cursos')
@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ schema: getPaginationAPISchema(Curso) })
  async getAll(@Campus() campus: MyCampus, @Query() query: CursoQueryOptionsDto): Promise<Paginated<Curso>> {
    return this.cursosService.getAllWithPagination(campus.id, query)
  }

  @Get('/count')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Number })
  async count(@Campus() campus: MyCampus): Promise<number> {
    return this.cursosService.count(campus.id)
  }

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Curso, isArray: true })
  async getAllWithoutPagination(@Campus() campus: MyCampus): Promise<Curso[]> {
    return this.cursosService.getAll(campus.id)
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Curso })
  async getOne(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<Curso | null> {
    const result = await this.cursosService.getOne(id, campus.id)
    if (!result) throw new NotFoundException(`Curso with id '${id}' not found`)
    return result
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: Curso })
  async create(@Campus() campus: MyCampus, @Body() data: CreateCursoDto): Promise<Curso | null> {
    return this.cursosService.create(campus.id, data)
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Curso })
  async update(
    @Campus() campus: MyCampus,
    @Param() { id }: UUIDParamDto,
    @Body() data: UpdateCursoDto
  ): Promise<Curso | null> {
    const result = await this.cursosService.update(id, campus.id, data)
    if (!result) throw new NotFoundException(`Curso with id '${id}' not found`)
    return result
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Curso })
  async remove(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<Curso | null> {
    const result = await this.cursosService.remove(id, campus.id)
    if (!result) throw new NotFoundException(`Curso with id '${id}' not found`)
    return result
  }
}
