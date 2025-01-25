import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
const httpOptions = {
  headers: new HttpHeaders({
    ScreetKey: 'hJK1oEqdEQa12kOF39hanKJD8ZSTwRMVkxXjZ0PR',
    AccessKey: 'AKIAZ4AE4SJSAH6M5B6B', 'Content-Type': 'text/plain',
    Host: 'w1uzabbs5b.execute-api.ap-southeast-2.amazonaws.com', 'X-Amz-Date': '20200920T094727Z',
    Authorization: 'AWS4-HMAC-SHA256 Credential=AKIAZ4AE4SJSAH6M5B6B/20200920/ap-southeast-2/execute-api/aws4_request, SignedHeaders=accesskey;content-type;host;screetkey;x-amz-date, Signature=f49a50aa6f92579b46547c5ae3e34c54b0d15df5c26c60fc95ceaca0399f3085', 'Cache-Control': 'no-cache',
  }),
};
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  api_url = 'https://api.wonderit.com.au:5013';
  api_url1 = 'https://api.wonderit.com.au:8050/api';
  api_url2 = 'https://api.wonderit.com.au:8050/Certificate'
  // api_url = 'http://api.wondersms.com.au:5001/';
  // api_url = 'https://81tpe8oq8f.execute-api.ap-southeast-2.amazonaws.com'
  // api_url2 = 'https://2olljr3w8i.execute-api.ap-southeast-2.amazonaws.com'
  // api_url3 = 'https://9ivnf9l6xc.execute-api.ap-southeast-2.amazonaws.com'
  // api_url4 = 'https://psdx30m0rf.execute-api.ap-southeast-2.amazonaws.com'
  // api_url5 = "https://3qt5nme067.execute-api.ap-southeast-2.amazonaws.com"
  // api_url6 = "https://mpet1aj6vf.execute-api.ap-southeast-2.amazonaws.com"
  // api_url7 = "https://rtomwonderit.s3-ap-southeast-2.amazonaws.com"
  // api_url8 = "http://v0.postcodeapi.com.au"
  // api_url22 = 'https://2olljr3w8i.execute-api.ap-southeast-2.amazonaws.com' //With param

  constructor(private httpClient: HttpClient) { }
  //API-1
  public getAPI1(url) {
    return this.httpClient.get(`${this.api_url1}/${url}`);
  }
  public getAPI(url) {
    return this.httpClient.get(`${this.api_url}/${url}`);
  }
  public postAPI(url, data) {
    return this.httpClient.post(`${this.api_url}/${url}`, data);
  }
  public postAPI1(url, data) {
    return this.httpClient.post(`${this.api_url1}/${url}`, data);
  }
  public postAPI2(url, data) {
    return this.httpClient.post(`${this.api_url2}/${url}`, data);
  }
  // public putAPI(url, data) {
  //   return this.httpClient.put(`${this.api_url}/${url}`, data);
  // }
  // public delAPI(url) {
  //   return this.httpClient.get(`${this.api_url}/${url}`);
  // }
  //API-2
  // public getAPI2(url2) {
  //   return this.httpClient.get(`${this.api_url2}/${url2}`);
  // }
  // public postAPI2(url2, data) {
  //   return this.httpClient.post(`${this.api_url2}/${url2}`, data);
  // }
  // public putAPI2(url2, data) {
  //   return this.httpClient.put(`${this.api_url2}/${url2}`, data);
  // }
  // public delAPI2(url2) {
  //   return this.httpClient.get(`${this.api_url2}/${url2}`);
  // }
  // //API-3
  // public getAPI3(url3) {
  //   return this.httpClient.get(`${this.api_url3}/${url3}`);
  // }
  // public postAPI3(url3, data) {
  //   return this.httpClient.post(`${this.api_url3}/${url3}`, data);
  // }
  // public putAPI3(url3, data) {
  //   return this.httpClient.put(`${this.api_url3}/${url3}`, data);
  // }
  // public delAPI3(url3) {
  //   return this.httpClient.get(`${this.api_url3}/${url3}`);
  // }
  // //API-4
  // public getAPI4(url4) {
  //   return this.httpClient.get(`${this.api_url4}/${url4}`);
  // }
  // public postAPI4(url4, data) {
  //   return this.httpClient.post(`${this.api_url4}/${url4}`, data);
  // }
  // //API-5
  // public getAPI5(url5) {
  //   return this.httpClient.get(`${this.api_url5}/${url5}`);
  // }
  // public postAPI5(url5, data) {
  //   return this.httpClient.post(`${this.api_url5}/${url5}`, data);
  // }
  // //API-6
  // public getAPI6(url6) {
  //   return this.httpClient.get(`${this.api_url6}/${url6}`);
  // }
  // //API-7
  // public getAPI7(url7) {
  //   return this.httpClient.get(`${this.api_url7}/${url7}`);
  // }
//   public getAPI8(url) {
//     return this.httpClient.get(`${this.api_url8}/${url}`);
//   }
}
