import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PosSessionsService } from './pos-sessions.service';
import { PosTransactionsService } from './pos-transactions.service';
import {
  CreatePosSessionDto,
  ClosePosSessionDto,
  PosSessionFilterDto,
} from './dto/pos-session.dto';
import {
  CreatePosTransactionDto,
  SyncPosTransactionsDto,
} from './dto/pos-transaction.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('POS')
@Controller('pos')
@ApiBearerAuth()
export class PosController {
  constructor(
    private readonly posSessionsService: PosSessionsService,
    private readonly posTransactionsService: PosTransactionsService,
  ) {}

  // POS Sessions
  @Post('sessions')
  @RequirePermissions('pos:create')
  @ApiOperation({ summary: 'Open a new POS session' })
  @ApiResponse({ status: 201, description: 'Session opened successfully' })
  async createSession(@Body() createDto: CreatePosSessionDto, @Request() req) {
    return this.posSessionsService.create(createDto, req.user.id);
  }

  @Get('sessions')
  @RequirePermissions('pos:read')
  @ApiOperation({ summary: 'Get all POS sessions' })
  @ApiResponse({ status: 200, description: 'List of POS sessions' })
  async findAllSessions(@Query() filters: PosSessionFilterDto) {
    return this.posSessionsService.findAll(filters);
  }

  @Get('sessions/current')
  @RequirePermissions('pos:read')
  @ApiOperation({ summary: 'Get current open session for the user' })
  @ApiResponse({ status: 200, description: 'Current open session' })
  async getCurrentSession(@Request() req) {
    return this.posSessionsService.getCurrentSession(req.user.id);
  }

  @Get('sessions/:id')
  @RequirePermissions('pos:read')
  @ApiOperation({ summary: 'Get a POS session by ID' })
  @ApiResponse({ status: 200, description: 'POS session details' })
  async findOneSession(@Param('id') id: string) {
    return this.posSessionsService.findOne(id);
  }

  @Post('sessions/:id/close')
  @RequirePermissions('pos:update')
  @ApiOperation({ summary: 'Close a POS session' })
  @ApiResponse({ status: 200, description: 'Session closed successfully' })
  async closeSession(
    @Param('id') id: string,
    @Body() closeDto: ClosePosSessionDto,
    @Request() req,
  ) {
    return this.posSessionsService.closeSession(id, closeDto, req.user.id);
  }

  // POS Transactions
  @Post('transactions')
  @RequirePermissions('pos:create')
  @ApiOperation({ summary: 'Create a POS transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  async createTransaction(@Body() createDto: CreatePosTransactionDto) {
    return this.posTransactionsService.create(createDto);
  }

  @Get('transactions')
  @RequirePermissions('pos:read')
  @ApiOperation({ summary: 'Get all POS transactions' })
  @ApiResponse({ status: 200, description: 'List of POS transactions' })
  async findAllTransactions(@Query('sessionId') sessionId?: string) {
    return this.posTransactionsService.findAll(sessionId);
  }

  @Get('transactions/:id')
  @RequirePermissions('pos:read')
  @ApiOperation({ summary: 'Get a POS transaction by ID' })
  @ApiResponse({ status: 200, description: 'POS transaction details' })
  async findOneTransaction(@Param('id') id: string) {
    return this.posTransactionsService.findOne(id);
  }

  @Post('sync')
  @RequirePermissions('pos:create')
  @ApiOperation({ summary: 'Sync offline POS transactions' })
  @ApiResponse({ status: 200, description: 'Transactions synced successfully' })
  async syncTransactions(@Body() syncDto: SyncPosTransactionsDto) {
    return this.posTransactionsService.syncTransactions(syncDto);
  }
}
