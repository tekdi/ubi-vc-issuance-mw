import { Module } from '@nestjs/common';
import { ExaminerService } from './examiner.service';
import { ExaminerController } from './examiner.controller';
import { CredentialsService } from 'src/services/credentials/credentials.service';
import { HttpModule } from '@nestjs/axios';
import { RegistryService } from 'src/services/registry/registry.service';

@Module({
  imports: [HttpModule],
  providers: [ExaminerService, CredentialsService, RegistryService],
  controllers: [ExaminerController]
})
export class ExaminerModule {}
