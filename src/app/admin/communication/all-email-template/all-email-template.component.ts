import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService } from 'src/app/api/api.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { fromEvent } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'
export interface AllTemplates {
  emailTemplateid
  emailSubject
  emailTemplatename
  emailActions
}
@Component({
  selector: 'app-all-email-template',
  templateUrl: './all-email-template.component.html',
  styleUrls: ['./all-email-template.component.sass']
})
export class AllEmailTemplateComponent implements OnInit {
  displayedColumns: string[] = ['emailTemplateid', 'emailSubject', 'emailTemplatename', 'emailActions']
  dataSource: MatTableDataSource<AllTemplates>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  allEmailTemplates: any
  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
    this.getEmailTemplates()
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  getEmailTemplates(){
    this.apiService.getAPI('getemailtemplate').subscribe((data) => {
      this.allEmailTemplates = data['data']
      for(let i in this.allEmailTemplates) {
        this.allEmailTemplates[i].emailsubject = this.allEmailTemplates[i].emailsubject.replace(/<\/?(strong|p|b|i|h[1-6])>/g, ' ');
      }
      this.dataSource.data = this.allEmailTemplates // on data receive populate dataSource.data array
      return data
    })
  }
  refresh() {
    this.loadData()
  }
  addNew() {
    this.router.navigate(['/admin/communication/new-email-template']);
  }
  public loadData() {
    this.dataSource = new MatTableDataSource()
    this.getEmailTemplates()
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
  editEmailTemplate(id) {
    this.router.navigate([`/admin/communication/edit-email-template/${id}`]);
  }

}
