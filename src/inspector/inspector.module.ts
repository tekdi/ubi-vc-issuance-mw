import { Module } from '@nestjs/common';
import { InspectorService } from './inspector.service';
import { InspectorController } from './inspector.controller';
import { RegistryService } from 'src/services/registry/registry.service';
import { CredentialsService } from 'src/services/credentials/credentials.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [InspectorService, CredentialsService, RegistryService],
  controllers: [InspectorController]
})
export class InspectorModule {}
