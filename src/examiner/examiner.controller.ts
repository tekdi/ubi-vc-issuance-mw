import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Headers,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createReadStream } from 'fs';
import * as csvParser from 'csv-parser';
import { ExaminerService } from './examiner.service';
import { RegistryService } from 'src/services/registry/registry.service';
import * as path from 'path';
import { Response } from 'express';

@Controller('examiner')
export class ExaminerController {
  constructor(
    private readonly examinerService: ExaminerService,
    private registryService: RegistryService,
  ) {}

  @Post('/uploadResult')
  //@UseGuards(AuthGuard("jwt"), new RoleGuard("Examiner"))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
      }),
    }),
  )
  async uploadCSV(
    @UploadedFile() file: Express.Multer.File,
    @Request() request,
    @Headers('authorization') authToken: string,
  ) {
    console.log('authToken', authToken);
    const examiner = await this.registryService.getExaminerDetails(authToken);
    //return examiner
    const examinerId = examiner[0].osid;
    const examinerName = examiner[0].name;
    const results = [];
    // console.log('request', request.body.academicYear);
    // console.log('request', request.body.classType);
    //this.logger.log('uploadCsv /upload API')
    return new Promise((resolve, reject) => {
      createReadStream(file.path)
        .pipe(csvParser())
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', async () => {
          const data = await this.examinerService.uploadResult(
            // request.body.academicYear,
            // request.body.classType,
            results,
            // examinerId,
            // examinerName,
          );
          resolve(data);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  @Post('/bulkDelete')
  //@UseGuards(AuthGuard("jwt"), new RoleGuard("Examiner"))
  async bulkDelete(
    @Request() request,
    @Body() body,
    @Headers('authorization') authToken: string,
  ) {
    return this.examinerService.bulkDelete(body, authToken);
  }

  @Get('downloadSampleCsv')
  downloadCsv(
    @Res() res: Response,
    @Headers('ClassType') ClassType: string,
  ): void {
    const filePathMiddlebasic: string = path.join(
      process.cwd(),
      'DSN_Examiner_mb.csv',
    );
    const filePathBcece: string = path.join(
      process.cwd(),
      'DSN_Examiner_bcece.csv',
    );
    //const filePath = join(__dirname, 'DSN_Examiner.csv');

    console.log('filePathBcece', filePathBcece);
    console.log('filePathMiddlebasic', filePathMiddlebasic);
    // const fileStream = createReadStream(filePath);

    const fileStream =
      ClassType === 'bcece'
        ? createReadStream(filePathBcece)
        : createReadStream(filePathMiddlebasic);

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="sample.csv"',
    });

    fileStream.pipe(res);
  }
}
