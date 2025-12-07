import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';
import { CurrentUser, CurrentUserData, RequirePermissions } from '../../common/decorators';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @RequirePermissions('core:users:create')
  async create(@CurrentUser() user: CurrentUserData, @Body() dto: CreateUserDto) {
    const newUser = await this.usersService.create(user.tenantId, dto);
    return {
      success: true,
      data: newUser,
      message: 'User created successfully',
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @RequirePermissions('core:users:read')
  async findAll(@CurrentUser() user: CurrentUserData) {
    const users = await this.usersService.findAll(user.tenantId);
    return {
      success: true,
      data: users,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @RequirePermissions('core:users:read')
  async findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserData) {
    const foundUser = await this.usersService.findOne(id, user.tenantId);
    return {
      success: true,
      data: foundUser,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @RequirePermissions('core:users:update')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() dto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.update(id, user.tenantId, dto);
    return {
      success: true,
      data: updatedUser,
      message: 'User updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @RequirePermissions('core:users:delete')
  async remove(@Param('id') id: string, @CurrentUser() user: CurrentUserData) {
    await this.usersService.remove(id, user.tenantId);
    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}
