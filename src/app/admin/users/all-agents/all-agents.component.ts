import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService } from 'src/app/api/api.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { fromEvent } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'

export interface users {
  agencyname
  contactperson
  isactive
  telephone
  actions
}

@Component({
  selector: 'app-all-agents',
  templateUrl: './all-agents.component.html',
  styleUrls: ['./all-agents.component.sass']
})
export class AllAgentsComponent implements OnInit {
  displayedColumns: string[] = ['agencyname', 'contactperson', 'isactive', 'telephone', 'actions']
  dataSource: MatTableDataSource<users>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  agencyNameFilter = new FormControl('')
  contactPersonFilter = new FormControl('')
  isActiveFilter = new FormControl('')
  telephoneFilter = new FormControl('')
  filteredValues = {
    agencyname: '',
    contactperson: '',
    isactive: '',
    telephone: ''
  }
  allAgents: any
  constructor(
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.getAgents()
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.dataSource.filterPredicate = this.createFilter();

    this.agencyNameFilter.valueChanges.subscribe(agencyname => {
      this.filteredValues.agencyname = agencyname
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.contactPersonFilter.valueChanges.subscribe(contactperson => {
      this.filteredValues.contactperson = contactperson
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.isActiveFilter.valueChanges.subscribe(isactive => {
      this.filteredValues.isactive = isactive
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.telephoneFilter.valueChanges.subscribe(telephone => {
      this.filteredValues.telephone = telephone
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter)
      return data.agencyname.toLowerCase().toString().indexOf(searchTerms.agencyname.toLowerCase()) !== -1
        && data.contactperson.toLowerCase().indexOf(searchTerms.contactperson.toLowerCase()) !== -1
        && data.isactive.toLowerCase().indexOf(searchTerms.isactive.toLowerCase()) !== -1
        && data.telephone.toLowerCase().indexOf(searchTerms.telephone.toLowerCase()) !== -1
    }
    return filterFunction
  }

  getAgents(){
    this.apiService.getAPI('getagent').subscribe((data) => {
      this.allAgents = data['data']
      this.dataSource.data = this.allAgents
      return data
    })
  }
  addNew(){
    this.router.navigate(['/admin/users/new-agent']);
  }
  refresh(){
    this.loadData()
  }
  public loadData() {
    this.dataSource = new MatTableDataSource() // create new object
    this.getAgents()
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
  editAgent(id){
    this.router.navigate([`/admin/users/edit-agent/${id}`]);
  }

}
