import {
  Injectable,
  HttpException,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { CredsConfig } from '../../Helper/CredsConfig';

@Injectable()
export class RegistryService {
  private baseUrl = process.env.URL;

  constructor(private readonly httpService: HttpService) {}

  async inviteResultsData(data, credConfig): Promise<any> {
    console.log('inviteData', data);

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      maxBodyLength: Infinity,
    };

    try {
      console.log('calling invite api');
      const response = await lastValueFrom(
        this.httpService.post(
          this.baseUrl + `/registry/api/v1/${credConfig.schemaName}/invite`,
          JSON.stringify(data),
          config,
        ),
      );
      console.log(JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error(error);
      throw new HttpException('Duplicate data', error.response?.status || 500);
    }
  }

  async updateResultsData(
    certificateId,
    resultDataId,
    authToken,
    studentDetail,
  ): Promise<any> {
    console.log('certificateId', certificateId);
    console.log('resultDataId', resultDataId);
    const credConfig =
      CredsConfig[
        studentDetail.DocumentType || studentDetail.vctype.split('/')[1]
      ];
    console.log(credConfig);

    const data = {
      certificateId: certificateId,
      status: 'issued',
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken,
        Cookie: 'JSESSIONID=8BF89D1A55B41729876DE84786897796',
      },
      maxBodyLength: Infinity,
    };

    try {
      const response = await lastValueFrom(
        this.httpService.put(
          this.baseUrl +
            `/registry/api/v1/${credConfig.schemaName}/${resultDataId}`,
          JSON.stringify(data),
          config,
        ),
      );
      console.log(JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to update results data',
        error.response?.status || 500,
      );
    }
  }

  async rejectResultsData(resultDataId, authToken): Promise<any> {
    console.log('resultDataId', resultDataId);

    const data = {
      status: 'rejected',
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken,
        Cookie: 'JSESSIONID=8BF89D1A55B41729876DE84786897796',
      },
      maxBodyLength: Infinity,
    };

    try {
      const response = await lastValueFrom(
        this.httpService.put(
          this.baseUrl + `/registry/api/v1/marksheet/${resultDataId}`,
          JSON.stringify(data),
          config,
        ),
      );
      console.log(JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to update results data',
        error.response?.status || 500,
      );
    }
  }

  async deleteResults(resultDataId, authToken): Promise<any> {
    console.log('resultDataId', resultDataId);

    const config = {
      headers: {
        Authorization: authToken,
        Cookie: 'JSESSIONID=8BF89D1A55B41729876DE84786897796',
      },
    };

    try {
      const response = await lastValueFrom(
        this.httpService.delete(
          this.baseUrl + `/registry/api/v1/Results/${resultDataId}`,
          config,
        ),
      );
      console.log(JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to update results data',
        error.response?.status || 500,
      );
    }
  }

  async searchResult(certificateNo: string, doctype: string): Promise<any> {
    const url = this.baseUrl + `/registry/api/v1/${doctype}/search`;
    const headers = {
      'Content-Type': 'application/json',
      Cookie: 'JSESSIONID=DD3A1308B7B64B9C47B7CEEEECAD4A58',
    };

    const payload = {
      filters: {
        certificateNo: {
          eq: certificateNo,
        },
      },
    };

    try {
      const response$ = this.httpService.post(url, payload, { headers });
      const response = await lastValueFrom(response$);
      return response.data;
    } catch (error) {
      console.error('Error making request:', error);
      throw new HttpException('Certificate not found', HttpStatus.NOT_FOUND);
    }
  }

  async getExaminerDetails(token: string): Promise<any> {
    const url = this.baseUrl + '/registry/api/v1/Examiner';

    // Define the headers
    const headers = {
      Authorization: `${token}`,
      //   Cookie: 'JSESSIONID=014FD9F3CAF01C51813F46792A22023C', // If needed
    };

    try {
      const response$ = this.httpService.get(url, { headers });
      const response = await lastValueFrom(response$);

      return response.data;
    } catch (error) {
      console.error('Error making request:', error);
      //throw new Error('Failed to retrieve result data');
      throw new UnauthorizedException();
    }
  }

  async inviteStudent(studentDetails): Promise<any> {
    console.log('studentDetails', studentDetails);
    const data = {
      studentJssId: studentDetails.studentJssId,
      studentSssId: studentDetails.studentSssId,
      firstName: studentDetails.firstName,
      middleName: studentDetails.middleName,
      lastName: studentDetails.lastName,
      phoneNumber: studentDetails.phoneNumber,
      email: studentDetails.email,
      nin: studentDetails.nin,
      school: studentDetails.school,
      class: studentDetails.class,
      parentEmail: studentDetails.parentEmail,
      guardianEmail: studentDetails.guardianEmail,
      studentPrimaryId: studentDetails.studentPrimaryId,
      studentSecondaryId: studentDetails.studentSecondaryId,
      password: studentDetails.password,
    };

    // Filter out undefined or null values
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== null,
      ),
    );

    console.log(filteredData);

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      maxBodyLength: Infinity,
    };

    try {
      console.log('calling invite api');
      const response = await lastValueFrom(
        this.httpService.post(
          this.baseUrl + '/registry/api/v1/Student/invite',
          JSON.stringify(filteredData),
          config,
        ),
      );
      console.log(JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error(error);
      throw new HttpException('Duplicate data', error.response?.status || 500);
    }
  }

  async searchStudent(data): Promise<any> {
    const url = this.baseUrl + '/registry/api/v1/Student/search';
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const response$ = this.httpService.post(url, data, { headers });
      const response = await lastValueFrom(response$);
      return response.data;
    } catch (error) {
      console.error('Error making request:', error);
      throw new Error('Failed to retrieve student data');
    }
  }
}
