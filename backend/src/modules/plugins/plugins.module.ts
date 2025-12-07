import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plugin, PluginConfig } from '../../database/entities';
import { PluginsController } from './plugins.controller';
import { PluginsService } from './plugins.service';

@Module({
  imports: [TypeOrmModule.forFeature([Plugin, PluginConfig])],
  controllers: [PluginsController],
  providers: [PluginsService],
  exports: [PluginsService],
})
export class PluginsModule {}
