import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as transformer from '../../Helper/transformers';
import { CredsConfig } from '../../Helper/CredsConfig';

@Injectable()
export class CredentialsService {
  private baseUrl = process.env.URL;
  private credentialSchemaId = process.env.CREDSCHEMAID;
  private issuerId = process.env.ISSUERID;

  constructor(private readonly httpService: HttpService) {}

  async issueCredential(studentDetails): Promise<any> {
    console.log(studentDetails);
    const data = {
      credential: {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://suraj-tekdi.github.io/dsn-dpi-backend-service/schemas/certificate.json',
        ],
        type: ['VerifiableCredential', 'DsnCertificateCredential'],
        issuer: 'did:rcw:78821260-e7c7-491f-bde6-32fe5d804857',
        issuanceDate: '2023-02-06T11:56:27.259Z',
        expirationDate: '2025-02-08T11:56:27.259Z',
        credentialSubject: {
          id: 'did:rcw:6b9d7b31-bc7f-454a-be30-b6c7447b1cff',
          type: 'DsnCertificateCredential',
          studentId: studentDetails.studentId,
          firstName: studentDetails.firstName,
          middleName: studentDetails.middleName,
          lastName: studentDetails.lastName,
          school: studentDetails.school,
          date: studentDetails.date,
          subject: studentDetails.subject,
          grade: studentDetails.grade,
          candidateNo: studentDetails.candidateNo,
          certificateNo: studentDetails.certificateNo,
          academicYear: studentDetails.academicYear,
          duration: studentDetails.duration,
          degree: studentDetails.degree,
        },
      },
      credentialSchemaId: this.credentialSchemaId,
      credentialSchemaVersion: '1.0.0',
      tags: ['tag1', 'tag2', 'tag3'],
      method: 'cbse',
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      maxBodyLength: Infinity,
    };

    try {
      console.log('issue credential api');
      const response = await lastValueFrom(
        this.httpService.post(
          this.baseUrl + '/credentials/credentials/issue',
          JSON.stringify(data),
          config,
        ),
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to issue credential',
        error.response?.status || 500,
      );
    }
  }

  async issueCredential1(studentDetails): Promise<any> {
    console.log(studentDetails);
    const data = {
      credential: {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://suraj-tekdi.github.io/dsn-dpi-backend-service/schemas/result.json',
        ],
        type: ['VerifiableCredential', 'DsnResultCredential'],
        issuer: 'did:rcw:78821260-e7c7-491f-bde6-32fe5d804857',
        issuanceDate: '2023-02-06T11:56:27.259Z',
        expirationDate: '2025-02-08T11:56:27.259Z',
        credentialSubject: {
          id: 'did:rcw:6b9d7b31-bc7f-454a-be30-b6c7447b1cff',
          type: 'DsnResultCredential',
          studentId: studentDetails.studentId,
          firstName: studentDetails.firstName,
          middleName: studentDetails.middleName,
          lastName: studentDetails.lastName,
          school: studentDetails.school,
          date: studentDetails.date,
          subject1: studentDetails.subject1,
          subject2: studentDetails.subject2,
          subject3: studentDetails.subject3,
          subject4: studentDetails.subject4,
          subject5: studentDetails.subject5,
          subject6: studentDetails.subject6,
          subject7: studentDetails.subject7,
          subject8: studentDetails.subject8,
          subject9: studentDetails.subject9,
          subject10: studentDetails.subject10,
          grade1: studentDetails.grade1,
          grade2: studentDetails.grade2,
          grade3: studentDetails.grade3,
          grade4: studentDetails.grade4,
          grade5: studentDetails.grade5,
          grade6: studentDetails.grade6,
          grade7: studentDetails.grade7,
          grade8: studentDetails.grade8,
          grade9: studentDetails.grade9,
          grade10: studentDetails.grade10,
          candidateNo: studentDetails.candidateNo,
          certificateNo: studentDetails.certificateNo,
          academicYear: studentDetails.academicYear,
          duration: studentDetails.duration,
          degree: studentDetails.degree,
        },
      },
      credentialSchemaId: this.credentialSchemaId,
      credentialSchemaVersion: '1.0.0',
      tags: ['tag1', 'tag2', 'tag3'],
      method: 'cbse',
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      maxBodyLength: Infinity,
    };

    try {
      console.log('issue credential api');
      const response = await lastValueFrom(
        this.httpService.post(
          this.baseUrl + '/credentials/credentials/issue',
          JSON.stringify(data),
          config,
        ),
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to issue credential',
        error.response?.status || 500,
      );
    }
  }

  async issueCredential2(studentDetails): Promise<any> {
    console.log('studentDetails', studentDetails.DocumentType);
    console.log('issuerId', this.issuerId);
    console.log('credentialSchemaId', this.credentialSchemaId);
    const credConfig =
      CredsConfig[
        studentDetails.DocumentType || studentDetails.vctype.split('/')[1]
      ];

    const data = {
      credential: {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          credConfig.context,
        ],
        type: credConfig.type,
        issuer: credConfig.credIssuerId,
        issuanceDate: new Date().toISOString(),
        expirationDate: credConfig.expirationDate,
        credentialSubject: {
          id: `did:rcw:issuance-bbb1-4e5e-b6cc-8671c2b3df1e`,
          type: credConfig.credentialSubjectType,
          ...studentDetails,
        },
      },
      credentialSchemaId: credConfig.credsSchemaId,
      credentialSchemaVersion: '1.0.0',
      tags: credConfig.tags,
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      maxBodyLength: Infinity,
    };

    try {
      // console.log('issue credential payload', data);
      const response = await lastValueFrom(
        this.httpService.post(
          this.baseUrl + '/credcredentials/issue',
          JSON.stringify(data),
          config,
        ),
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to issue credential',
        error.response?.status || 500,
      );
    }
  }

  async getCredentials(id, templateId): Promise<any> {
    const url = this.baseUrl + '/credcredentials/' + id;

    console.log('url', url);

    const headers = {
      Accept: 'text/html',
      templateId: templateId,
      Cookie: 'JSESSIONID=DD3A1308B7B64B9C47B7CEEEECAD4A58',
    };

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, { headers }),
      );
      return response.data;
    } catch (error) {
      console.log('333333333333333333333333333', error);

      throw new HttpException('Credential not Found!', HttpStatus.NOT_FOUND);
    }
  }
}
