import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../service/employee.service';
import { Employee } from '../model/employee';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent {

  employee: Employee;

  constructor(
    private route: ActivatedRoute,
      private router: Router,
        private employeeService: EmployeeService) {
    this.employee = employeeService.employee;
  }

  onSubmit() {
    if(this.employee.id != "") {
      this.employeeService.update(this.employee).subscribe(result => this.gotoEmployeeList());
    } else {
      this.employeeService.save(this.employee).subscribe(result => this.gotoEmployeeList());
    }
  }

  gotoEmployeeList() {
    this.router.navigate(['/employees']);
  }
}
