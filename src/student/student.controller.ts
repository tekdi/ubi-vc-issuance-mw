import { Body, Controller, Post, Request, Headers } from '@nestjs/common';
import { RegistryService } from 'src/services/registry/registry.service';
import { StudentService } from './student.service';
import { filter } from 'rxjs';

@Controller('student')
export class StudentController {

    constructor(private readonly studentService: StudentService, private readonly registryService: RegistryService) { }

    @Post('invite')
    async inviteStudent(
        @Request() request, @Body() studentDetails, 
        //@Headers('authorization') authToken: string
        ) {
        return this.studentService.invite(studentDetails)
    }

    @Post('search')
    async searchStident(
        @Request() request, @Body() filter, 
        //@Headers('authorization') authToken: string
        ) {
        return this.studentService.search(filter)
    }

}
