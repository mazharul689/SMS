import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { ItemsListComponent } from './items-list/items-list.component';
import { NewItemComponent } from './new-item/new-item.component';
import { FinanceRoutingModule } from './finance-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTimepickerModule } from 'mat-timepicker';
import { EditItemComponent } from './edit-item/edit-item.component';
import { DeleteComponent } from './dialog/delete/delete.component';
import { AllFinanceModelComponent } from './all-finance-model/all-finance-model.component';
import { NewFinanceModelComponent } from './new-finance-model/new-finance-model.component';
import { EditFinanceModelComponent } from './edit-finance-model/edit-finance-model.component';
import { AllPaymentPlanComponent } from './all-payment-plan/all-payment-plan.component';
import { NewPaymentPlanComponent } from './new-payment-plan/new-payment-plan.component';
import { EditPaymentPlanComponent } from './edit-payment-plan/edit-payment-plan.component';
import { AllAmountTypeComponent } from './all-amount-type/all-amount-type.component';
import { NewAmountTypeComponent } from './new-amount-type/new-amount-type.component';
import { EditAmountTypeComponent } from './edit-amount-type/edit-amount-type.component';
import { AllRuleTypeComponent } from './all-rule-type/all-rule-type.component';
import { NewRuleTypeComponent } from './new-rule-type/new-rule-type.component';
import { EditRuleTypeComponent } from './edit-rule-type/edit-rule-type.component';
import { NewPaymentPlanRuleComponent } from './new-payment-plan-rule/new-payment-plan-rule.component';
import { EditPaymentPlanRuleComponent } from './edit-payment-plan-rule/edit-payment-plan-rule.component';
import { InvoiceComponent } from './invoice/invoice.component';
// import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AddInstallmentComponent } from './add-installment/add-installment.component';
import { PaymentPlanInstalmentsComponent } from './payment-plan-instalments/payment-plan-instalments.component';
import { AddPaymentPlanInstalmentRuleComponent } from './add-payment-plan-instalment-rule/add-payment-plan-instalment-rule.component';
import { DeletePaymentPlanComponent } from './dialog/delete-payment-plan/delete-payment-plan.component';
import { InvoiceDialogComponent } from './invoice/dialog/invoice-dialog/invoice-dialog.component';


@NgModule({
  declarations: [
    ItemsListComponent,
    NewItemComponent,
    EditItemComponent,
    DeleteComponent,
    AllFinanceModelComponent,
    NewFinanceModelComponent,
    EditFinanceModelComponent,
    AllPaymentPlanComponent,
    NewPaymentPlanComponent,
    EditPaymentPlanComponent,
    AllAmountTypeComponent,
    NewAmountTypeComponent,
    EditAmountTypeComponent,
    AllRuleTypeComponent,
    NewRuleTypeComponent,
    EditRuleTypeComponent,
    NewPaymentPlanRuleComponent,
    EditPaymentPlanRuleComponent,
    InvoiceComponent,
    AddInstallmentComponent,
    PaymentPlanInstalmentsComponent,
    AddPaymentPlanInstalmentRuleComponent,
    DeletePaymentPlanComponent,
    InvoiceDialogComponent,

  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    FinanceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CKEditorModule,
    // AsyncPipe,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MaterialFileInputModule,
    MatStepperModule,
    MatRadioModule,
    MatTimepickerModule,
    MatSortModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTableModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTabsModule,
    MatMenuModule,
    NgxMaskModule,
    MatProgressSpinnerModule
  ]
})
export class FinanceModule { }
