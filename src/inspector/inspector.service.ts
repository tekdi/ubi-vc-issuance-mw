import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CredentialsService } from 'src/services/credentials/credentials.service';
import { RegistryService } from 'src/services/registry/registry.service';
import * as puppeteer from 'puppeteer';
import * as pdf from 'html-pdf';
import * as path from 'path';
import * as fs from 'fs';
import * as Handlebars from 'hbs';
import * as QRCode from 'qrcode';
import * as wkhtmltopdf from 'wkhtmltopdf';
import { join } from 'path';

@Injectable()
export class InspectorService {
  private cerTemplatePath: string = path.join(
    process.cwd(),
    'template',
    'marksheet.html',
  );
  private resTemplatePath: string = path.join(
    process.cwd(),
    'template',
    'result.html',
  );
  private baseUrl = process.env.URL;

  constructor(
    private readonly credentialsService: CredentialsService,
    private readonly registryService: RegistryService,
  ) {}

  async loadTemplate(type) {
    try {
      // Read HTML file content
      // if (type == 'bcece') {
      //   console.log('resTemplatePath 25', this.resTemplatePath);
      //   return fs.readFileSync(this.resTemplatePath, 'utf-8');
      // } else if (type == 'middle basic') {
      //   console.log('cerTemplatePath 21', this.cerTemplatePath);
      //   return fs.readFileSync(this.cerTemplatePath, 'utf-8');
      // } else {
      //   console.log('cerTemplatePath 28', this.cerTemplatePath);
      //   return fs.readFileSync(this.cerTemplatePath, 'utf-8');
      //   //return fs.readFileSync(this.resTemplatePath, 'utf-8');
      // }
      const cerTemplatePath: string = path.join(
        process.cwd(),
        'template',
        `${type}.html`,
      );
      return fs.readFileSync(cerTemplatePath, 'utf-8');
    } catch (error) {
      throw new Error('Unable to load HTML template file.');
    }
  }

  async bulkIssuance(studentDetails, authToken) {
    const updates = [];
    if (studentDetails) {
      const promises = [];
      studentDetails.forEach((studentDetail) => {
        promises.push(this.issueCertificate2(studentDetail, authToken));
        //promises.push(this.registryService.inviteResultsData(item))
      });
      return await Promise.allSettled(promises);
    } else {
      return {
        error: 'Unable to issue credentials',
      };
    }
  }

  async issueCertificate(studentDetail, authToken) {
    console.log('authToken', authToken);

    const { subjects, grades } = this.generateSubjectAndGrade(
      studentDetail.subjectAndGrade,
    );

    const updates = [];
    if (studentDetail) {
      updates.push({
        studentId: studentDetail.studentId,
        firstName: studentDetail.firstName,
        middleName: studentDetail.middleName,
        lastName: studentDetail.lastName,
        school: studentDetail.schoolId,
        date: studentDetail.examDate,
        subject: subjects[0],
        grade: grades[0],
        candidateNo: studentDetail.studentId,
        certificateNo: studentDetail.certificateNo,
        academicYear: studentDetail.academicYear,
        duration: studentDetail.duration,
        degree: studentDetail.degree,
      });
      //return updates
      const credData = await this.credentialsService.issueCredential(
        updates[0],
      );

      console.log('credData', credData);

      if (credData) {
        // update credentialId
        const resultData = await this.registryService.updateResultsData(
          credData.credential.id,
          studentDetail.osid,
          authToken,
          studentDetail,
        );
        console.log('resultData', resultData);

        return resultData;
      }
    } else {
      return {
        error: 'Unable to issue credentials',
      };
    }
  }

  async issueCertificate1(studentDetail, authToken) {
    console.log('authToken', authToken);

    const { subjects, grades } = this.generateSubjectAndGrade(
      studentDetail.subjectAndGrade,
    );

    const updates = [];
    if (studentDetail) {
      updates.push({
        studentId: studentDetail.studentId,
        firstName: studentDetail.firstName,
        middleName: studentDetail.middleName,
        lastName: studentDetail.lastName,
        school: studentDetail.schoolId,
        date: studentDetail.examDate,
        subject1: subjects[0],
        subject2: subjects[1],
        subject3: subjects[2],
        subject4: subjects[3],
        subject5: subjects[4],
        subject6: subjects[5],
        subject7: subjects[6],
        subject8: subjects[7],
        subject9: subjects[8],
        subject10: subjects[9],
        grade1: grades[0],
        grade2: grades[1],
        grade3: grades[2],
        grade4: grades[3],
        grade5: grades[4],
        grade6: grades[5],
        grade7: grades[6],
        grade8: grades[7],
        grade9: grades[8],
        grade10: grades[9],
        candidateNo: studentDetail.candidateNo,
        certificateNo: studentDetail.certificateNo,
        academicYear: studentDetail.academicYear,
        duration: studentDetail.duration,
        degree: studentDetail.degree,
      });
      //return updates
      const credData = await this.credentialsService.issueCredential1(
        updates[0],
      );

      console.log('credData', credData);

      if (credData) {
        // update credentialId
        const resultData = await this.registryService.updateResultsData(
          credData.credential.id,
          studentDetail.osid,
          authToken,
          studentDetail,
        );
        console.log('resultData', resultData);

        return resultData;
      }
    } else {
      return {
        error: 'Unable to issue credentials',
      };
    }
  }

  async issueCertificate2(studentDetail, authToken) {
    console.log('authToken', authToken);

    if (studentDetail) {
      const credData = await this.credentialsService.issueCredential2(
        studentDetail,
      );

      console.log('credData', credData);

      if (credData) {
        // update credentialId
        const resultData = await this.registryService.updateResultsData(
          credData.credential.id,
          studentDetail.osid,
          authToken,
          studentDetail,
        );
        console.log('resultData', resultData);

        return resultData;
      }
    } else {
      return {
        error: 'Unable to issue credentials',
      };
    }
  }

  generateSubjectAndGrade(subjectAndGradeData) {
    const subjectAndGrade = subjectAndGradeData;

    // Split the string by comma to get individual subjects with their grades
    const subjectGradePairs = subjectAndGrade.split(',');

    let subjects: string[] = [];
    let grades: string[] = [];

    // Loop through each subject and grade pair
    subjectGradePairs.forEach((pair) => {
      const [subject, grade] = pair.split(' | ');
      subjects.push(subject); // Add the subject to subjects array
      grades.push(grade); // Add the grade to grades array
    });

    // Output the results
    console.log('Subjects:', subjects); // ["ENGLISH", "HINDI", "MATHEMATICS"]
    console.log('Grades:', grades); // ["A", "B", "A"]

    return { subjects, grades };
  }

  async bulkDelete(data, authToken) {
    try {
      const promises = [];
      data.forEach((item) => {
        //promises.push(this.credentialsService.issueCredential(item))
        promises.push(this.registryService.deleteResults(item.osid, authToken));
      });
      return await Promise.allSettled(promises);
    } catch (error) {}
  }

  async bulkDecline(data, authToken) {
    try {
      const promises = [];
      data.forEach((item) => {
        //promises.push(this.credentialsService.issueCredential(item))
        promises.push(
          this.registryService.rejectResultsData(item.osid, authToken),
        );
      });
      return await Promise.allSettled(promises);
    } catch (error) {}
  }

  async decline(data, authToken) {
    try {
      return this.registryService.rejectResultsData(data.osid, authToken);
    } catch (error) {}
  }

  async convertHtmlToImage(
    htmlContent: string,
    format: 'png' | 'jpeg',
  ): Promise<Buffer> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.setViewport({ width: 900, height: 1200 });

    // Set the HTML content
    await page.setContent(htmlContent);

    // Puppeteer typically returns a Buffer, but in case of ambiguity, ensure it's a Buffer
    const screenshot: Buffer | Uint8Array = await page.screenshot({
      type: format,
    });

    // Force conversion to Buffer if it's not already
    const result: Buffer = Buffer.isBuffer(screenshot)
      ? screenshot
      : Buffer.from(screenshot);

    await browser.close();
    return result;
  }

  async convertHtmlToImage1(
    htmlContent: string,
    format: 'png' | 'jpeg' | 'pdf',
  ): Promise<Buffer> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Set the viewport size
    await page.setViewport({ width: 1920, height: 1440 });

    // Set the HTML content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    let result: Buffer;

    if (format === 'pdf') {
      // Generate PDF as a buffer (not a stream)
      const pdfBuffer = await page.pdf({ format: 'A4' });
      console.log('pdfBuffer', pdfBuffer);
      result = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
    } else {
      // Generate image (PNG or JPEG)
      const screenshot = await page.screenshot({
        type: format,
        fullPage: true,
      });
      result = Buffer.isBuffer(screenshot)
        ? screenshot
        : Buffer.from(screenshot);
    }

    // Close the browser
    await browser.close();

    return result;
  }

  generatePdf(htmlContent: string): Promise<Buffer> {
    //console.log("options", options)
    const options = {
      format: 'A3', // A4 size
      orientation: 'portrait', // or 'landscape' if your content is wide
      border: '0', // No margin to fit content
      height: '17.50in', // Adjust height for A4
      width: '11.69in', // Adjust width for A4
      timeout: 60000, // In case you have large content, to prevent timeout
    };

    return new Promise((resolve, reject) => {
      pdf.create(htmlContent, options).toBuffer((err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });
  }

  async searchResult(certificateNo: any, doctype: any) {
    const resultsData = await this.registryService.searchResult(
      certificateNo,
      doctype,
    );

    console.log('resultsData', resultsData);

    if (resultsData.length > 0) {
      const studentDetail = resultsData[0];

      if (studentDetail) {
        return studentDetail;
      }
    } else {
      throw new HttpException(
        'Certificate no. not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async renderHtml(data: any, type: any): Promise<string> {
    const htmlTemplate = await this.loadTemplate(type); // Load the HTML template from file
    const template = Handlebars.compile(htmlTemplate); // Compile the template using Handlebars
    console.log('-----------------------', htmlTemplate, data);

    return template(data); // Inject the dynamic data
  }

  async generateQrCode(id: string): Promise<string> {
    const text = `${this.baseUrl}/credentials/credentials/${id}/verify`;
    try {
      // Generate QR Code as a data URL (base64 PNG image)
      const qrCodeDataUrl = await QRCode.toDataURL(text);
      return qrCodeDataUrl; // This can be sent directly to the frontend
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }

  async generateQrCodeBuffer(text: string): Promise<Buffer> {
    try {
      // Generate QR Code as a Buffer (PNG format)
      const qrCodeBuffer = await QRCode.toBuffer(text);
      return qrCodeBuffer; // This can be used to serve an image directly
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }

  // async generateHtmlPdf(htmlContent: string): Promise<Buffer> {
  //     // Launch puppeteer
  //     const browser = await puppeteer.launch({
  //         headless: true,
  //         args: ['--no-sandbox', '--disable-setuid-sandbox'],
  //     });
  //     const page = await browser.newPage();

  //     // Set content of the page
  //     await page.setContent(htmlContent, {
  //         waitUntil: 'networkidle0', // wait until no more network requests are made
  //     });

  //     // Generate PDF as a Buffer (not stream)
  //     const pdfBuffer = await page.pdf({
  //         format: 'A4',
  //         printBackground: true,
  //     });

  //     await browser.close();

  //     // Return the generated PDF as a Buffer
  //     return pdfBuffer;

  // }

  async generatePdfFromHtml(htmlContent: string): Promise<string> {
    // Path where the generated PDF will be saved
    const pdfPath = join(process.cwd(), 'output.pdf');

    return new Promise((resolve, reject) => {
      wkhtmltopdf(htmlContent, { output: pdfPath }, (err) => {
        if (err) {
          reject(`Error generating PDF: ${err.message}`);
        } else {
          resolve(pdfPath); // Return the path of the generated PDF
        }
      });
    });
  }

  async generatePdfToStream(htmlContent: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const buffers: Buffer[] = [];
      const stream = wkhtmltopdf(htmlContent);

      stream.on('data', (chunk) => buffers.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(buffers)));
      stream.on('error', (err) => reject(err));
    });
  }
}
