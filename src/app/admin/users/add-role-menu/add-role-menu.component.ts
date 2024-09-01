import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validator } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { SelectionModel } from '@angular/cdk/collections'
import { ReplaySubject, Subscription } from 'rxjs'
import { MatStepper } from '@angular/material/stepper';

export interface AllRoles {
  roleId,
  roleName,
  actions
}

export interface AllMenu {
  rowID,
  menuId,
  menuName,
  isDisplay
}

@Component({
  selector: 'app-add-role-menu',
  templateUrl: './add-role-menu.component.html',
  styleUrls: ['./add-role-menu.component.sass'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-gb' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    DatePipe
  ]
})
export class AddRoleMenuComponent implements OnInit {
  displayColumns: string[] = ['roleId', 'roleName', 'actions']
  displayColumns1: string[] = ['rowID', 'menuId', 'menuName', 'isDisplay']
  dataSource: MatTableDataSource<AllRoles>
  dataSource1: MatTableDataSource<AllMenu>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('tableTwoPaginator', { static: true }) tableTwoPaginator: MatPaginator
  @ViewChild('tableTwoSort', { static: true }) tableTwoSort: MatSort
  @ViewChild('stepper', { static: true }) stepper: MatStepper
  @ViewChild('filter', { static: true }) filter: ElementRef
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  userInfo: any;
  stepLabel: number;
  menuItem: any;
  selection = new SelectionModel<AllMenu>(true, []);

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private route: Router
  ) { this.getRoles() }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))
    this.stepLabel = 1
    this.dataSource = new MatTableDataSource()
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.HFormGroup1 = this.fb.group({
      PreRows: this.fb.array([this.preMenuArray()]),
      roleId: ''
    })
    this.HFormGroup2 = this.fb.group({
      Rows: this.fb.array([this.menuArray()]),
      roleId: ''
    })
  }

  getRoles() {
    this.apiService.getAPI('getroles').subscribe((data) => {
      this.dataSource.data = data['data']
    })
  }

  get PreRows(): FormArray {
    return this.HFormGroup1.get('PreRows') as FormArray
  }
  get Rows(): FormArray {
    return this.HFormGroup1.get('Rows') as FormArray
  }

  preMenuArray() {
    return this.fb.group({
      menuId: '',
      statsCheck: '',
      menuName: '',
      isDisplay: ''
    })
  }
  menuArray() {
    return this.fb.group({
      menuId: ''
    })
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource1.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource1.data.forEach(row => this.selection.select(row));
    // console.log('form3value', this.HFormGroup3.value.unitArray)
  }
  sendSelectedNumbers() {
    let selectedNumbers: number[] = [];
    for (let item of this.selection.selected) {
      selectedNumbers.push(item.rowID)
    }
    return selectedNumbers;
  }

  selectedRoles(id, stepper) {
    console.log(id)
    this.apiService.getAPI('getmenu').subscribe((data) => {
      this.menuItem = Object.values(data['data']);
      console.log(this.menuItem);
      (this.HFormGroup1.get('PreRows') as FormArray).removeAt(0);
      for (let i = 0; i < this.menuItem.length; i++) {
        let rowData = this.fb.group({
          rowID: i,
          statusCheck: false,
          menuId: this.menuItem[i].menuid,
          menuName: this.menuItem[i].menuname,
          isDisplay: this.menuItem[i].isDisplay
        });
        (this.HFormGroup1.get('PreRows') as FormArray).push(rowData)
      }
      console.log('formvalue', this.HFormGroup1.value)
      this.dataSource1 = new MatTableDataSource()
      this.dataSource1.data = this.PreRows.value
      this.dataSource1.paginator = this.tableTwoPaginator
      this.dataSource1.sort = this.tableTwoSort
      this.masterToggle()
      this.HFormGroup1.get('roleId').setValue(id)

    })
    this.stepLabel++
    stepper.next()
  }

  onAddRoleMenuSubmit() {
    let rows = this.sendSelectedNumbers();
    const roleMenuBody = this.HFormGroup1.value.PreRows;
    for (let i = 0; i < rows.length; i++) {
      roleMenuBody[rows[i]].statusCheck = true
    }
    // this.Rows.clear();
    (this.HFormGroup2.get('Rows') as FormArray).removeAt(0);
    for (let i = 0; i < roleMenuBody.length; i++) {
      if (roleMenuBody[i].statusCheck == true) {
        let rowData = this.fb.group({
          menuId: roleMenuBody[i].menuId,
        });
        (this.HFormGroup2.get('Rows') as FormArray).push(rowData)
      }
    }
    this.HFormGroup2.get('roleId').setValue(this.HFormGroup1.value.roleId)
    // console.log('formvalue',this.HFormGroup2.value)
    this.apiService.postAPI('addrolemenu', this.HFormGroup2.value).subscribe((data) =>{
      console.log('data',data)
      this.route.navigate(['admin/users-menu/all-role-menu'])
    })
  }

}
