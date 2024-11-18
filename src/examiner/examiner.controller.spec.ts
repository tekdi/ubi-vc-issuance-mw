import { Test, TestingModule } from '@nestjs/testing';
import { ExaminerController } from './examiner.controller';

describe('ExaminerController', () => {
  let controller: ExaminerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExaminerController],
    }).compile();

    controller = module.get<ExaminerController>(ExaminerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
