import { Injectable } from '@nestjs/common';
import { CredentialsService } from 'src/services/credentials/credentials.service';
import { RegistryService } from 'src/services/registry/registry.service';
const crypto = require('crypto');
import * as transformer from '../Helper/transformers';
import { CredsConfig } from '../Helper/CredsConfig';
@Injectable()
export class ExaminerService {
  constructor(
    private readonly credentialsService: CredentialsService,
    private readonly registryService: RegistryService,
  ) {}

  async uploadResult1(academicYear, result, examinerId, examinerName) {
    const expectedHeaders = [
      'Student Id',
      'School Type',
      'Student FirstName',
      'Student MiddleName',
      'Student LastName',
      'School Id',
      'School Name',
      'Grade',
      'Term',
      'Exam Date',
      'Subject and Grade',
      'Academic Year',
      'Duration',
      'Degree',
    ];
    const csvheader = Object.keys(result[0]);
    const areHeadersValid = this.arraysHaveSameElements(
      expectedHeaders.map((key) => {
        return key.toLowerCase().replace(/_/g, '').replace(/ /g, '');
      }),
      csvheader.map((key) => {
        return key.toLowerCase().replace(/_/g, '').replace(/ /g, '');
      }),
    );
    const updates = [];
    if (areHeadersValid) {
      for (const log of result) {
        if (Object.keys(log).length) {
          const getValue = (key: string) => {
            const orignalKey = csvheader.filter((header) => {
              const iKey = key
                .toLowerCase()
                .replace(/_/g, '')
                .replace(/ /g, '');
              const mKey = header
                .toLowerCase()
                .replace(/_/g, '')
                .replace(/ /g, '');
              return iKey === mKey;
            });
            return orignalKey.length ? log[orignalKey[0]] : null;
          };

          updates.push({
            uniqueId: this.generateFixedId(
              getValue('Student Id'),
              getValue('Grade'),
              getValue('Term'),
              academicYear,
            ),
            studentId: getValue('Student Id'),
            schoolType: getValue('School Type'),
            firstName: getValue('Student FirstName'),
            middleName: getValue('Student MiddleName'),
            lastName: getValue('Student LastName'),
            schoolId: getValue('School Id'),
            schoolName: getValue('School Name'),
            examDate: getValue('Exam Date'),
            subjectAndGrade: getValue('Subject and Grade'),
            academicYear: academicYear ?? getValue('Academic Year'),
            duration: getValue('Duration'),
            degree: getValue('Degree'),
            examinerId: examinerId,
            examinerName: examinerName,
            grade: getValue('Grade'),
            term: getValue('Term'),
            certificateNo:
              academicYear.split('-')[1] +
              '/' +
              getValue('Grade') +
              '/' +
              getValue('Term') +
              '/' +
              getValue('Student Id'),
            candidateNo:
              getValue('Grade') +
              '/' +
              getValue('Term') +
              '/' +
              getValue('Student Id'),
          });
        }
      }
      //return updates
      const promises = [];
      updates.forEach((item) => {
        //promises.push(this.credentialsService.issueCredential(item))
        promises.push(this.registryService.inviteResultsData(item, ''));
      });
      return await Promise.allSettled(promises);
    } else {
      return {
        error: 'Invalid CSV headers',
      };
    }
  }

  async bulkDelete(data, authToken) {
    try {
      const promises = [];
      data.forEach((item) => {
        //promises.push(this.credentialsService.issueCredential(item))
        console.log('item.osid', item.osid);
        promises.push(this.registryService.deleteResults(item.osid, authToken));
      });
      return await Promise.allSettled(promises);
    } catch (error) {}
  }

  arraysHaveSameElements(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    const result1 = arr1.every((element) => arr2.includes(element));
    const result2 = arr2.every((element) => arr1.includes(element));
    return result1 && result2;
  }

  generateFixedId(...strings) {
    const combinedString = strings.join('-'); // Combine strings using a separator
    const hash = crypto
      .createHash('sha256')
      .update(combinedString)
      .digest('hex');
    return hash;
  }

  async uploadResult(result, documentType) {
    const credConfig = CredsConfig[documentType];

    // Get the correct transformer and credConfig based on document type
    const transformedData = transformer[credConfig.transformer](result);

    const promises = transformedData.map((item) =>
      this.registryService.inviteResultsData(item, credConfig),
    );
    const results = await Promise.allSettled(promises);

    // Count fulfilled and rejected responses
    const fulfilledCount = results.filter(
      (result) => result.status === 'fulfilled',
    ).length;
    const rejectedCount = results.filter(
      (result) => result.status === 'rejected',
    ).length;

    // Return the response with the count of fulfilled and rejected promises, and each result with its associated studentId
    return {
      fulfilledCount,
      rejectedCount,
      results: results.map((result) => {
        if (result.status === 'fulfilled') {
          return {
            status: 'fulfilled',
            result: result.value.result,
          };
        } else {
          return {
            status: 'rejected',
            reason: result.reason,
          };
        }
      }),
    };
  }
}
