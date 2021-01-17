import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpaceXService {

  constructor(private httpClient: HttpClient) { }

  getSpaceXData(url) {
    return this.httpClient.get(url);
  }
}
