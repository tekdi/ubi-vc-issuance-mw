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

  async uploadResult(authToken, result, documentType) {
    const credConfig = CredsConfig[documentType];

    // Get the correct transformer and credConfig based on document type
    const transformedData = transformer[credConfig.transformer](result);

    const promises = transformedData.map((item) =>
      this.registryService.inviteResultsData(authToken, item, credConfig),
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
