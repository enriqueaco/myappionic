import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IpAddressService {

  ipData: any;

  constructor(private http: HttpClient) {}

  public init(callback: () => void) {
    this.http.get(environment.ipAddressServiceUrl).toPromise().then(data => {
      this.ipData = data;
      callback();
    });
  }

  get ip(): string {
    return _.get(this.ipData, 'ip');
  }

  get languageCode(): string {
    return _.get(this.ipData, 'location.language.code', 'en');
  }

  get os(): string {
    return _.get(this.ipData, 'user_agent.os');
  }

  get agent(): string {
    return _.get(this.ipData, 'user_agent.header');
  }

  get country(): any {
    return {
      code: _.get(this.ipData, 'location.country.code'),
      name: _.get(this.ipData, 'location.country.name'),
      flag: _.get(this.ipData, 'location.country.flag.twemoji'),
    };
  }

  get city(): string {
    return _.get(this.ipData, 'location.city');
  }

  get location(): any {
    return {
      lat: _.get(this.ipData, 'location.latitude'),
      lon: _.get(this.ipData, 'location.longitude')
    };
  }

  get resumedIpData(): object {
    return {
      ip: this.ip,
      country: this.country,
      city: this.city,
      location: this.location,
      agent: this.agent,
      os: this.os,
      lang: this.languageCode
    };
  }
}
