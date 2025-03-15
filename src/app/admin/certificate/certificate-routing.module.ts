import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllStudentComponent } from './all-student/all-student.component'
import { CertificateComponent } from './certificate/certificate.component';
import { DeleteCertificateComponent } from './delete-certificate/delete-certificate.component';
import { GenerateCertificateComponent } from './generate-certificate/generate-certificate.component';
import { EditorViewComponent } from './editor-view/editor-view.component';

const routes: Routes = [
  {
    path: 'all-student',
    component: AllStudentComponent
  },
  {
    path: 'certificate/:step/:id',
    component: CertificateComponent
  },
  {
    path: 'certificate/:step/:id/:eid',
    component: CertificateComponent
  },
  {
    path: 'delete-certificate/:step/:id',
    component: DeleteCertificateComponent
  },
  {
    path: 'generate-certificate',
    component: GenerateCertificateComponent
  },
  {
    path: 'editor-view',
    component: EditorViewComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificateRoutingModule { }
