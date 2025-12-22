import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  magicNumber = environment.magicNumber;

  private logoMappings: { [key: string]: { cliLogo: string, logoSrc1: string } } = {
    '01': { cliLogo: 'assets/images/banner/wonsmsLogo6.png', logoSrc1: 'assets/images/banner/wonsmsLogo.png' },
    '11': { cliLogo: 'assets/images/banner/pacificBigLogo.png', logoSrc1: 'assets/images/banner/pacificLogo.png' },
    '13': { cliLogo: 'assets/images/banner/PICBigLogo.png', logoSrc1: 'assets/images/banner/PICSmallLogo.png' },
    '14': { cliLogo: 'assets/images/banner/ETCBigLogo.png', logoSrc1: 'assets/images/banner/ETCSmallLogo.png' },
    '23': { cliLogo: 'assets/images/banner/ALITBigLogo.png', logoSrc1: 'assets/images/banner/ALITSmallLogo.png' },
    '29': { cliLogo: 'assets/images/banner/bibeBigLogo.png', logoSrc1: 'assets/images/banner/bibeSmallLogo.png' },
    '33': { cliLogo: 'assets/images/banner/ftiBigLogo.png', logoSrc1: 'assets/images/banner/ftiSmallLogo.png' },
    '35': { cliLogo: 'assets/images/banner/gcmBigLogo.png', logoSrc1: 'assets/images/banner/gcmSmallLogo.png' },
    '38': { cliLogo: 'assets/images/banner/nisBigLogo.png', logoSrc1: 'assets/images/banner/nisSmallLogo.png' },
    '42': { cliLogo: 'assets/images/banner/ATTCBigLogo.png', logoSrc1: 'assets/images/banner/ATTCSmallLogo.png' },
    '46': { cliLogo: 'assets/images/banner/RCNBigLogo.png', logoSrc1: 'assets/images/banner/RCNSmallLogo.png' },
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
    // const port = this.getPortNumber(this.test);
    const logos = this.getLogos(this.magicNumber);
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
