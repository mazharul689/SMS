import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailComponent } from './email/email.component'
import { AllCommunicationComponent } from './all-communication/all-communication.component'
import { MailBoxComponent } from './mail-box/mail-box.component'
import { SentEmailComponent } from './sent-email/sent-email.component'
import { AllEmailTemplateComponent } from './all-email-template/all-email-template.component';
import { NewEmailTemplateComponent } from './new-email-template/new-email-template.component';
import { EditEmailTemplateComponent } from './edit-email-template/edit-email-template.component';

const routes: Routes = [
  {
    path: 'email',
    component: EmailComponent
  },
  {
    path: 'new-email-template',
    component: NewEmailTemplateComponent
  },
  {
    path: 'edit-email-template/:id',
    component: EditEmailTemplateComponent
  },
  {
    path: 'all-communication',
    component: AllCommunicationComponent
  },
  {
    path: 'all-email-template',
    component: AllEmailTemplateComponent
  },
  {
    path: 'mail-box/:firstName/:hexEmail/:id',
    component: MailBoxComponent
  },
  {
    path: 'sent-email/:firstName/:id',
    component: SentEmailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicationRoutingModule { }
