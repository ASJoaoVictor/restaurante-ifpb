import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { AuthUser, Campus } from '../auth/auth-user.decorator'
import { AuthRoles } from '../auth/auth.decorator'
import { UUIDParamDto } from '../base/dto/params.dto'
import { MyCampus } from '../campi/entities/campus.entity'
import { CreateUserDto, UpdateUserDto, UserQueryOptionsDto } from './dto/user.dto'
import { MyUser, User } from './entities/user.entity'
import { UsersService } from './users.service'

@AuthRoles('admin')
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ schema: getPaginationAPISchema(User) })
  async getAll(@Campus() campus: MyCampus, @Query() query: UserQueryOptionsDto): Promise<Paginated<User>> {
    return this.usersService.getAllWithPagination(campus.id, query)
  }

  @Get('/count')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Number })
  async count(@Campus() campus: MyCampus): Promise<number> {
    return this.usersService.count(campus.id)
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: User })
  async getOne(@Campus() campus: MyCampus, @Param() { id }: UUIDParamDto): Promise<User | null> {
    const result = await this.usersService.getOne(id, campus.id)
    if (!result) throw new NotFoundException(`User with id '${id}' not found`)
    return result
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: User })
  async create(@Campus() campus: MyCampus, @Body() data: CreateUserDto): Promise<User | null> {
    return this.usersService.create(campus.id, data)
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: User })
  async update(
    @Campus() campus: MyCampus,
    @Param() { id }: UUIDParamDto,
    @Body() data: UpdateUserDto
  ): Promise<User | null> {
    const result = await this.usersService.update(id, campus.id, data)
    if (!result) throw new NotFoundException(`User with id '${id}' not found`)
    return result
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: User })
  async remove(
    @Campus() campus: MyCampus,
    @AuthUser() user: MyUser,
    @Param() { id }: UUIDParamDto
  ): Promise<User | null> {
    if (id === user.id) throw new ForbiddenException('Você não pode excluir seu próprio usuário')
    const result = await this.usersService.remove(id, campus.id)
    if (!result) throw new NotFoundException(`User with id '${id}' not found`)
    return result
  }
}
