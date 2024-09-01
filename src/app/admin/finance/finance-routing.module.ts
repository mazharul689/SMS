import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsListComponent } from './items-list/items-list.component'
import { NewItemComponent } from './new-item/new-item.component'
import { EditItemComponent } from './edit-item/edit-item.component';
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
import { AddInstallmentComponent } from './add-installment/add-installment.component';
import { PaymentPlanInstalmentsComponent } from './payment-plan-instalments/payment-plan-instalments.component';
import { AddPaymentPlanInstalmentRuleComponent } from './add-payment-plan-instalment-rule/add-payment-plan-instalment-rule.component';
const routes: Routes = [
  {
    path: 'invoice',
    component: InvoiceComponent
  },
  {
    path: 'invoice/:id',
    component: InvoiceComponent
  },
  {
    path: 'items-list',
    component: ItemsListComponent
  },
  {
    path: 'new-item',
    component: NewItemComponent
  },
  {
    path: 'edit-item/:id',
    component: EditItemComponent
  },
  {
    path: 'all-finance-model',
    component: AllFinanceModelComponent
  },
  {
    path: 'new-finance-model',
    component: NewFinanceModelComponent
  },
  {
    path: 'edit-finance-model/:id',
    component: EditFinanceModelComponent
  },
  {
    path: 'all-payment-plan',
    component: AllPaymentPlanComponent
  },
  {
    path: 'new-payment-plan',
    component: NewPaymentPlanComponent
  },
  {
    path: 'edit-payment-plan/:id',
    component: EditPaymentPlanComponent
  },
  {
    path: 'all-amount-type',
    component: AllAmountTypeComponent
  },
  {
    path: 'new-amount-type',
    component: NewAmountTypeComponent
  },
  {
    path: 'edit-amount-type/:id',
    component: EditAmountTypeComponent
  },
  {
    path: 'all-rule-type',
    component: AllRuleTypeComponent
  },
  {
    path: 'new-rule-type',
    component: NewRuleTypeComponent
  },
  {
    path: 'edit-rule-type/:id',
    component: EditRuleTypeComponent
  },
  {
    path: 'new-payment-plan-rule/:id',
    component: NewPaymentPlanRuleComponent
  },
  {
    path: 'edit-payment-plan-rule/:id',
    component: EditPaymentPlanRuleComponent
  },
  {
    path: 'add-installment/:id',
    component: AddInstallmentComponent
  },

  {
    path: 'payment-plan-instalments/:id',
    component: PaymentPlanInstalmentsComponent
  },
  {
    path: 'add-payment-plan-instalment-rule/:ppid/:id',
    component: AddPaymentPlanInstalmentRuleComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
