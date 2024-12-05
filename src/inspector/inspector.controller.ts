import {
  Body,
  Controller,
  Post,
  Request,
  Headers,
  Query,
  Res,
  HttpStatus,
  HttpException,
  Param,
  Get,
} from '@nestjs/common';
import { InspectorService } from './inspector.service';
import { brotliDecompressSync } from 'zlib';
import { Response } from 'express';
import { CredentialsService } from 'src/services/credentials/credentials.service';
import * as path from 'path';
import { createReadStream } from 'fs';
import { CredsConfig } from '../Helper/CredsConfig';
import axios from 'axios';
import { parse } from 'json2csv';

@Controller('inspector')
export class InspectorController {
  private certificateTemplateId = process.env.CERIFICATETEMPLATEID;
  private resultsTemplateId = process.env.RESULTSTEMPLATEID;
  private baseUrl = process.env.URL;

  constructor(
    private readonly inspectorService: InspectorService,
    private readonly credentialsService: CredentialsService,
  ) {}

  @Post('/bulkIssuance')
  //@UseGuards(AuthGuard("jwt"), new RoleGuard("Inspector"))
  async bulkIssuance(
    @Request() request,
    @Body() studentDetails,
    @Headers('authorization') authToken: string,
  ) {
    return this.inspectorService.bulkIssuance(studentDetails, authToken);
  }

  @Post('/issueCertificate')
  //@UseGuards(AuthGuard("jwt"), new RoleGuard("Inspector"))
  async issueCertificate(
    @Request() request,
    @Body() studentDetails,
    @Headers('authorization') authToken: string,
  ) {
    return this.inspectorService.issueCertificate2(studentDetails, authToken);
  }

  @Post('/bulkDelete')
  //@UseGuards(AuthGuard("jwt"), new RoleGuard("Examiner"))
  async bulkDelete(
    @Request() request,
    @Body() body,
    @Headers('authorization') authToken: string,
  ) {
    return this.inspectorService.bulkDelete(body, authToken);
  }

  @Post('/bulkDecline')
  //@UseGuards(AuthGuard("jwt"), new RoleGuard("Examiner"))
  async bulkDecline(
    @Request() request,
    @Body() body,
    @Headers('authorization') authToken: string,
  ) {
    return this.inspectorService.bulkDecline(body, authToken);
  }

  @Post('/decline')
  //@UseGuards(AuthGuard("jwt"), new RoleGuard("Examiner"))
  async decline(
    @Request() request,
    @Body() body,
    @Headers('authorization') authToken: string,
  ) {
    return this.inspectorService.decline(body, authToken);
  }

  @Post('preview')
  async preview(
    //@Param('id') id: string,
    @Request() request,
    @Res() res: Response,
    //@Headers('type') type: string,
    @Headers('Accept') format: string = 'image/png',
    @Headers('certificateNo') certificateNo: string,
  ) {
    console.log('0000000000000000000000', request);
    const doctype = request.headers['doctype'];

    const data = await this.inspectorService.searchResult(
      certificateNo,
      doctype,
    );
    // const type = data.schoolType;

    console.log('data', data);

    const htmlContent = await this.inspectorService.renderHtml(data, doctype);

    const fileType = format.split('/')[1] as 'png' | 'jpeg' | 'pdf' | 'html';

    //const options = this.createOptions(type.replace(/\s+/g, '').toLowerCase(), data.subjectCount)

    try {
      if (fileType === 'pdf') {
        const pdfBuffer = await this.inspectorService.generatePdf(htmlContent);
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=generated.pdf',
          'Content-Length': pdfBuffer.length,
        });
        res.status(HttpStatus.OK).send(pdfBuffer);
      } else if (fileType === 'html') {
        // Send the rendered HTML back as response
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);
      } else {
        console.log('fileType', fileType);
        const buffer = await this.inspectorService.convertHtmlToImage(
          htmlContent,
          fileType,
        );

        res.set({
          'Content-Type': format === 'image/png' ? 'image/png' : 'image/jpeg',
          'Content-Disposition': `attachment; filename=output.${format}`,
        });
        return res.send(buffer);
      }
    } catch (error) {
      console.log('error', error);
      throw new HttpException(
        'Failed to generate file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('credentials1')
  async credentials1(
    //@Param('id') id: string,
    @Request() request,
    @Headers('Accept') format: string = 'image/png',
    //@Headers('templateId') templateId: string,
    @Res() res: Response,
    @Headers('certificateNo') certificateNo: string,
  ) {
    const doctype = request.headers['doctype'];

    const data = await this.inspectorService.searchResult(
      certificateNo,
      doctype,
    );

    console.log('data', data);
    const id = data.certificateId;
    const classType = data.schoolType;

    console.log('id', id);
    console.log('classType', classType);

    const templateId =
      classType === 'bcece'
        ? this.resultsTemplateId
        : this.certificateTemplateId;

    console.log('templateId', templateId);

    const html = await this.credentialsService.getCredentials(id, templateId);

    //console.log("HTML", html)

    const qrCodeBase64 = await this.inspectorService.generateQrCode(id);

    //const updatedHtml = html.replace(`alt="QR Code"`, `src="${qrCodeBase64}" alt="QR Code"`);

    const updatedHtml1 = html.replace(
      /<img\s+[^>]*src=['"]data:image\/png;base64,[^'"]*['"][^>]*>/g,
      `<img src="${qrCodeBase64}" alt="Updated Image">`,
    );

    const updatedHtml = html.replace(
      /<img\s+[^>]*src=['"](https:\/\/suraj-tekdi\.github\.io\/dsn-dpi-backend-service\/template\/assests\/images\/qrcode\.png)['"][^>]*>/g,
      `<img src="${qrCodeBase64}" alt="Updated Image">`,
    );

    //console.log("updatedHtml", updatedHtml)

    const fileType = format.split('/')[1] as 'png' | 'jpeg' | 'pdf' | 'html';

    try {
      if (fileType === 'pdf') {
        const pdfBuffer = await this.inspectorService.generatePdf(updatedHtml);
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=generated.pdf',
          'Content-Length': pdfBuffer.length,
        });
        res.status(HttpStatus.OK).send(pdfBuffer);
      } else if (fileType === 'html') {
        res.setHeader('Content-Type', 'text/html');
        res.send(updatedHtml);
      } else {
        console.log('fileType', fileType);
        const buffer = await this.inspectorService.convertHtmlToImage(
          updatedHtml,
          fileType,
        );

        res.set({
          'Content-Type': format === 'image/png' ? 'image/png' : 'image/jpeg',
          'Content-Disposition': `attachment; filename=output.${format}`,
        });
        return res.send(buffer);
      }
    } catch (error) {
      console.log('error', error);
      throw new HttpException(
        'Failed to generate file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('credentials')
  async credentials(
    //@Param('id') id: string,
    @Request() request,

    @Headers('Accept') format: string = 'image/png',
    //@Headers('templateId') templateId: string,
    @Res() res: Response,
    @Headers('certificateNo') certificateNo: string,
  ) {
    const doctype = request.headers['doctype'];

    const data = await this.inspectorService.searchResult(
      certificateNo,
      doctype,
    );
    console.log('-------------------------------------------', data);

    const id = data?.certificateId ? data.certificateId : '';
    const type = data?.schoolType ? data.schoolType : '';
    //const type = 'bcece'

    const templateId =
      type === 'bcece' ? this.resultsTemplateId : this.certificateTemplateId;

    // let html = await this.credentialsService.getCredentials(id, templateId);

    let html = await this.inspectorService.renderHtml(data, type);

    //console.log("HTML", html)

    const qrCodeBase64 = await this.inspectorService.generateQrCode(id);

    //const updatedHtml = html.replace(`alt="QR Code"`, `src="${qrCodeBase64}" alt="QR Code"`);

    const updatedHtml = html.replace(
      /<img\s+[^>]*src=['"]data:image\/png;base64,[^'"]*['"][^>]*>/g,
      `<img width="100px" height="100px" src="${qrCodeBase64}" alt="Updated Image">`,
    );

    //const updatedHtml = html.replace(/<img\s+[^>]*src=['"](https:\/\/suraj-tekdi\.github\.io\/dsn-dpi-backend-service\/template\/assests\/images\/qrcode\.png)['"][^>]*>/g, `<img src="${qrCodeBase64}" alt="Updated Image">`);

    //console.log("updatedHtml", updatedHtml)

    const fileType = format.split('/')[1] as 'png' | 'jpeg' | 'pdf' | 'html';

    try {
      if (fileType === 'pdf') {
        const pdfBuffer = await this.inspectorService.generatePdf(updatedHtml);
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=generated.pdf',
          'Content-Length': pdfBuffer.length,
        });
        res.status(HttpStatus.OK).send(pdfBuffer);
      } else if (fileType === 'html') {
        res.setHeader('Content-Type', 'text/html');
        res.send(updatedHtml);
      } else {
        console.log('fileType', fileType);
        const buffer = await this.inspectorService.convertHtmlToImage(
          updatedHtml,
          fileType,
        );

        res.set({
          'Content-Type': format === 'image/png' ? 'image/png' : 'image/jpeg',
          'Content-Disposition': `attachment; filename=output.${format}`,
        });
        return res.send(buffer);
      }
    } catch (error) {
      console.log('error', error);
      throw new HttpException(
        'Failed to generate file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('downloadSampleCsv')
  downloadCsv(@Res() res: Response): void {
    const filePath: string = path.join(process.cwd(), 'DSN_Examiner.csv');
    //const filePath = join(__dirname, 'DSN_Examiner.csv');
    console.log('filePath', filePath);
    const fileStream = createReadStream(filePath);

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="sample.csv"',
    });

    fileStream.pipe(res);
  }

  createOptions(type, count) {
    console.log('type', type);
    console.log('count', count);

    switch (type) {
      case 'bcece':
        switch (count) {
          case 3:
          case 4:
          case 5:
            return {
              format: 'A3',
              orientation: 'portrait',
              border: '1cm',
              height: '17.50in',
              width: '11.69in',
              timeout: 60000,
            };
          case 6:
          case 7:
            return {
              format: 'A3',
              orientation: 'landscape',
              border: '0.5cm',
              height: '14in',
              width: '10in',
              timeout: 80000,
            };
          default:
            return {
              format: 'A3',
              orientation: 'portrait',
              border: '1cm',
              height: '17.50in',
              width: '11.69in',
              timeout: 60000,
            };
        }

      case 'middlebasic':
        switch (count) {
          case 3:
            return {
              format: 'A3',
              orientation: 'portrait',
              border: '0',
              height: '16.0in',
              width: '11.69in',
              timeout: 60000,
            };
          case 4:
            return {
              format: 'A4',
              orientation: 'portrait',
              border: '1cm',
              height: '16in',
              width: '12in',
              timeout: 70000,
            };
          case 5:
          case 6:
            return {
              format: 'A4',
              orientation: 'landscape',
              border: '0.5cm',
              height: '14in',
              width: '11in',
              timeout: 70000,
            };
          default:
            return {
              format: 'A4',
              orientation: 'portrait',
              border: '1cm',
              height: '17in',
              width: '12in',
              timeout: 60000,
            };
        }

      default:
        return {
          format: 'A3',
          orientation: 'portrait',
          border: '0',
          height: '17.50in',
          width: '11.69in',
          timeout: 60000,
        };
    }
  }

  @Get('downloadVC/:did')
  async downloadJson(@Param('did') did: string, @Res() res: Response) {
    const url = `${this.baseUrl}/credcredentials/${did}`;

    try {
      const apiResponse = await axios.get(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      // Setting headers for file download
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="response-${did}.json"`,
      );

      // Sending the file as response
      return res.send(apiResponse.data);
    } catch (error) {
      // Handling errors
      throw new HttpException(
        `Error fetching data: ${error.response?.statusText || error.message}`,
        error.response?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('downloadCSV/:documentType')
  async downloadCSV(
    @Param('documentType') documentType: string,
    @Res() res: Response,
  ) {
    const url = `${this.baseUrl}/registry/api/v1/${documentType}/search`;

    try {
      const payload = {
        offset: 0,
        limit: 10000,
        filters: {
          status: {
            eq: 'issued',
          },
        },
      };

      const apiResponse = await axios.post(url, payload, {
        headers: {
          Accept: 'application/json',
        },
      });

      const data = apiResponse.data;

      // Extract required fields
      const extractedData = data.map((item: any) => ({
        StudentUniqueId: item.studentId || '',
        schoolId: item.schoolId || '',
        schoolName: item.schoolName || '',
        name: `${item.firstName || ''} ${item.lastName || ''}`.trim(),
        certificateID: item.certificateId || '',
        class: item.class || '',
        documentType: documentType,
      }));

      // Convert JSON to CSV
      const csv = parse(extractedData);

      // Set headers for file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="response-${documentType}.csv"`,
      );

      // Send the CSV file as a response
      return res.send(csv);
    } catch (error) {
      throw new HttpException(
        `Error fetching data: ${error.response?.statusText || error.message}`,
        error.response?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
