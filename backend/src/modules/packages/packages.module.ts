import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import {
  ModulesCatalog,
  SubModulesCatalog,
  LimitTypesCatalog,
  CustomPackage,
  CustomPackageModule,
  CustomPackageSubModule,
  CustomPackageLimit,
} from '../../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModulesCatalog,
      SubModulesCatalog,
      LimitTypesCatalog,
      CustomPackage,
      CustomPackageModule,
      CustomPackageSubModule,
      CustomPackageLimit,
    ]),
  ],
  controllers: [PackagesController],
  providers: [PackagesService],
  exports: [PackagesService],
})
export class PackagesModule {}
