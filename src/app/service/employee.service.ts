import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Employee } from '../model/employee';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
@Injectable()
export class EmployeeService {

  private employeesUrl: string;
  private createEmployeeUrl: string;
  private deleteEmployeeUrl: string;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.employeesUrl = 'http://localhost:9090/api/employee';
  }

  public findAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeesUrl+"/all");
  }

  public save(employee: Employee) {
    return this.http.post<Employee>(this.employeesUrl, employee);
  }

  public delete(id) {
      console.log("delete: "+id);
      this.http.delete(this.employeesUrl + "/" + id).subscribe(data => {
          console.log(data);
          this.router.navigate(['/employees']);
        });
    }

}
