import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class ShareService {
  // cliLogo = 'assets/images/banner/HMILogo.png'
  // cliLogo = 'assets/images/banner/wonsmsLogo6.png'
  // cliLogo = 'assets/images/banner/pacificBigLogo.png'
  cliLogo = 'assets/images/banner/ALITBigLogo.png'
  // cliLogo = 'assets/images/banner/PICBigLogo.png'
  // cliLogo = 'assets/images/banner/ETCBigLogo.png'

  // cliLogo = 'assets/images/banner/aits.png'
  logoSrc = 'assets/images/banner/wonsmsLogo.png'
  // logoSrc1 = 'assets/images/banner/pacificLogo.png'
  // logoSrc1 = 'assets/images/banner/PICSmallLogo.png'
  // logoSrc1 = 'assets/images/banner/ETCSmallLogo.png'
  logoSrc1 = 'assets/images/banner/ALITSmallLogo.png'


  // logoSrc1 = 'assets/images/banner/HMISmallLogo.png'
  // logoSrc1 = 'assets/images/banner/aitslogo.png'
  // logoSrc1 = 'assets/images/banner/mainLand.png'
  public messageSource = new BehaviorSubject<string>('Student Management System')
  public clientLogo = new BehaviorSubject<any>(this.cliLogo)
  public logoSouce = new BehaviorSubject<any>(this.logoSrc)
  public logoSouce1 = new BehaviorSubject<any>(this.logoSrc1)
  constructor() { }
}
