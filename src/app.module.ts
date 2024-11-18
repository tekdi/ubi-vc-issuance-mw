import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExaminerModule } from './examiner/examiner.module';
import { InspectorModule } from './inspector/inspector.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [ExaminerModule, InspectorModule, StudentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
