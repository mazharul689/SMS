// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs'
// @Injectable({
//   providedIn: 'root'
// })
// export class ShareService {
//   // cliLogo = 'assets/images/banner/HMILogo.png'
//   cliLogo = 'assets/images/banner/wonsmsLogo6.png'
//   // cliLogo = 'assets/images/banner/pacificBigLogo.png'
//   // cliLogo = 'assets/images/banner/ALITBigLogo.png'
//   // cliLogo = 'assets/images/banner/PICBigLogo.png'
//   // cliLogo = 'assets/images/banner/ETCBigLogo.png'
//   // cliLogo = 'assets/images/banner/bibeBigLogo.png'
//   // cliLogo = 'assets/images/banner/ftiBigLogo.png'

//   // cliLogo = 'assets/images/banner/aits.png'
//   logoSrc = 'assets/images/banner/wonsmsLogo.png'
//   // logoSrc1 = 'assets/images/banner/pacificLogo.png'
//   // logoSrc1 = 'assets/images/banner/PICSmallLogo.png'
//   // logoSrc1 = 'assets/images/banner/ETCSmallLogo.png'
//   logoSrc1 = 'assets/images/banner/ALITSmallLogo.png'
//   // logoSrc1 = 'assets/images/banner/bibeSmallLogo.png'
//   // logoSrc1 = 'assets/images/banner/ftiSmallLogo.png'


//   // logoSrc1 = 'assets/images/banner/HMISmallLogo.png'
//   // logoSrc1 = 'assets/images/banner/aitslogo.png'
//   // logoSrc1 = 'assets/images/banner/mainLand.png'
//   public messageSource = new BehaviorSubject<string>('Student Management System')
//   public clientLogo = new BehaviorSubject<any>(this.cliLogo)
//   public logoSouce = new BehaviorSubject<any>(this.logoSrc)
//   public logoSouce1 = new BehaviorSubject<any>(this.logoSrc1)
//   constructor() { }
// }


import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  test = environment.testURL;

  private logoMappings: { [key: string]: { cliLogo: string, logoSrc1: string } } = {
    '5000': { cliLogo: 'assets/images/banner/wonsmsLogo6.png', logoSrc1: 'assets/images/banner/wonsmsLogo.png' },
    '5011': { cliLogo: 'assets/images/banner/pacificBigLogo.png', logoSrc1: 'assets/images/banner/pacificLogo.png' },
    '5013': { cliLogo: 'assets/images/banner/PICBigLogo.png', logoSrc1: 'assets/images/banner/PICSmallLogo.png' },
    '5014': { cliLogo: 'assets/images/banner/ETCBigLogo.png', logoSrc1: 'assets/images/banner/ETCSmallLogo.png' },
    '5023': { cliLogo: 'assets/images/banner/ALITBigLogo.png', logoSrc1: 'assets/images/banner/ALITSmallLogo.png' },
    '5029': { cliLogo: 'assets/images/banner/bibeBigLogo.png', logoSrc1: 'assets/images/banner/bibeSmallLogo.png' },
    '5033': { cliLogo: 'assets/images/banner/ftiBigLogo.png', logoSrc1: 'assets/images/banner/ftiSmallLogo.png' },
    '5035': { cliLogo: 'assets/images/banner/gcmBigLogo.png', logoSrc1: 'assets/images/banner/gcmSmallLogo.png' },
    '5038': { cliLogo: 'assets/images/banner/nisBigLogo.png', logoSrc1: 'assets/images/banner/nisSmallLogo.png' },
  };

  private defaultLogos = {
    cliLogo: 'assets/images/banner/wonsmsLogo6.png',
    logoSrc1: 'assets/images/banner/wonsmsLogo.png'
  };

  private getPortNumber(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.port;
    } catch (e) {
      console.error('Invalid URL', e);
      return '';
    }
  }

  private getLogos(port: string): { cliLogo: string, logoSrc1: string } {
    return this.logoMappings[port] || this.defaultLogos;
  }

  private initializeLogos() {
    const port = this.getPortNumber(this.test);
    const logos = this.getLogos(port);
    this.cliLogo = logos.cliLogo;
    this.logoSrc1 = logos.logoSrc1;
  }

  cliLogo: string;
  logoSrc1: string;

  logoSrc = 'assets/images/banner/wonsmsLogo.png';

  public messageSource = new BehaviorSubject<string>('Student Management System');
  public clientLogo: BehaviorSubject<any>;
  public logoSouce: BehaviorSubject<any>;
  public logoSouce1: BehaviorSubject<any>;

  constructor() {
    this.initializeLogos();
    this.clientLogo = new BehaviorSubject<any>(this.cliLogo);
    this.logoSouce = new BehaviorSubject<any>(this.logoSrc);
    this.logoSouce1 = new BehaviorSubject<any>(this.logoSrc1);
  }
}
