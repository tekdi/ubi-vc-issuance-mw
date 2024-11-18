import { Test, TestingModule } from '@nestjs/testing';
import { ExaminerService } from './examiner.service';

describe('ExaminerService', () => {
  let service: ExaminerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExaminerService],
    }).compile();

    service = module.get<ExaminerService>(ExaminerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
