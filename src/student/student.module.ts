import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { HttpModule } from '@nestjs/axios';
import { RegistryService } from 'src/services/registry/registry.service';

@Module({
  imports: [HttpModule],
  controllers: [StudentController],
  providers: [StudentService, RegistryService]
})
export class StudentModule {}
