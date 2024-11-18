import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { error } from 'console';
import { RegistryService } from 'src/services/registry/registry.service';

@Injectable()
export class StudentService {

    constructor(private readonly registryService: RegistryService) { }

    async invite1(studentdetails) {
        const filter = {
            filters: {}
          };
          
          // Conditionally add `studentJssId` if it's not undefined
          if (studentdetails.studentJssId !== undefined) {
            filter.filters["studentJssId"] = { eq: studentdetails.studentJssId };
          }
          
          // Conditionally add `studentSssId` if it's not undefined
          if (studentdetails.studentSssId !== undefined) {
            filter.filters["studentSssId"] = { eq: studentdetails.studentSssId };
          }

          if (studentdetails.email !== undefined) {
            filter.filters["email"] = { eq: studentdetails.email };
          }

          if (studentdetails.phoneNumber !== undefined) {
            filter.filters["phoneNumber"] = { eq: studentdetails.phoneNumber };
          }
          
          console.log(filter);
        const studentData = await this.search(filter)
        
        console.log("studentData", studentData)

        if (studentData.data.length > 0) {
            throw new HttpException('Duplicate Data!', HttpStatus.BAD_REQUEST)
        } else {
            return this.registryService.inviteStudent(studentdetails)
        }
        
    }

    async invite(studentdetails) {
      const queries = [];
  
      if (studentdetails.studentJssId !== undefined) {
          queries.push(this.search({ filters: { studentJssId: { eq: studentdetails.studentJssId } } }));
      }
      if (studentdetails.studentSssId !== undefined) {
          queries.push(this.search({ filters: { studentSssId: { eq: studentdetails.studentSssId } } }));
      }
      if (studentdetails.email !== undefined) {
          queries.push(this.search({ filters: { email: { eq: studentdetails.email } } }));
      }
      if (studentdetails.phoneNumber !== undefined) {
          queries.push(this.search({ filters: { phoneNumber: { eq: studentdetails.phoneNumber } } }));
      }

      console.log("queries", queries)
  
      // Run all queries in parallel and wait for results
      const results = await Promise.all(queries);

      console.log("results", results)
  
      // Aggregate and check for duplicates
      const studentData = results.flatMap(result => result.data);
      const uniqueIdentifiers = new Set(studentData.map(student => student.identifier));
  
      if (uniqueIdentifiers.size > 0) {
          throw new HttpException('Duplicate Data!', HttpStatus.BAD_REQUEST);
      } else {
          return this.registryService.inviteStudent(studentdetails);
      }
  }

    async search(filter) {
        return this.registryService.searchStudent(filter)
    }
}
