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
  api_url = 'https://api.wonderit.com.au:5038';
  api_url1 = 'https://api.wonderit.com.au:8050/api';
  api_url2 = 'https://api.wonderit.com.au:8050/Certificate'

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
}
