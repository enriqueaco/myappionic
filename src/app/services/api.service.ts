import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../models/settings.model';
import { environment } from '../../environments/environment';
import { List } from '../models/list.model';
import { Song } from '../models/song.model';
import { FIRST_INIT, SETTINGS_TYPES } from '../constants/constants';
import { User } from '../models/user.model';
import { OwnList } from '../models/own-list.model';
import { Payment } from '../models/payment.model';
import { DownloadFile } from '../models/download-file.model';
import { Gift } from '../models/gift.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  rootURL = environment.urlBase;
  public settings = {};

  constructor(private http: HttpClient) { }

  get firstInit() {
    const value = localStorage.getItem(FIRST_INIT);
    return value ? true : false;
  }

  setFirstInit(value: boolean) {
    localStorage.setItem(FIRST_INIT, JSON.stringify(value));
  }

  init() {
    this.getSettings();
    return new Promise<any>((resolve, reject) => {
      if (this.settings[SETTINGS_TYPES.freeDaysPeriod]) {
        return resolve(this.settings);
      }
      this.getSettings().then(settings => {
        for (const item of settings) {
          this.settings[item.type] = item.data;
        }
        resolve(this.settings);
      }).catch(reject);
    });
  }

  getSettings() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type'
    });
    return this.http.post<Settings[]>(this.rootURL + 'settings', {}).toPromise();
  }

  getCurrentUser() {
    return this.http.post<User>(this.rootURL + 'user/current', {}).toPromise();
  }

  createUser(data) {
    return this.http.post<User>(this.rootURL + 'user/create', { data }).toPromise();
  }

  updateUser(data) {
    return this.http.post<User>(this.rootURL + 'user/update', { data }).toPromise();
  }
  sendCode(email, code) {
    return this.http.post<any>(this.rootURL + 'user/sendcode', { email, code }).toPromise();
  }

  getAmounts() {
    return this.http.post(this.rootURL + 'getAmountSongsByTypes', {}).toPromise();
  }

  getListsByTypes(types) {
    return this.http.post<List[]>(this.rootURL + 'getListsByTypes', { types }).toPromise();
  }

  getListByType(type) {
    return this.http.post<List>(this.rootURL + 'getListByType', { type }).toPromise();
  }

  getSongsByList(listId) {
    return this.http.post<any>(this.rootURL + 'getSongsByList', { listId }).toPromise();
  }

  getSongsByLiturgical(listId) {
    return this.http.post<any>(this.rootURL + 'getSongsByLiturgical', { listId }).toPromise();
  }

  getSongsByCriteria(criteria) {
    return this.http.post<Song[]>(this.rootURL + 'getSongsByCriteria', { criteria }).toPromise();
  }

  // Own Lists
  getOwnLists() {
    return this.http.post<OwnList[]>(this.rootURL + 'getOwnLists', {}).toPromise();
  }

  addOwnList(name) {
    return this.http.post<OwnList>(this.rootURL + 'addOwnList', { name }).toPromise();
  }

  updateOwnList(id, name) {
    return this.http.post<OwnList>(this.rootURL + 'updateOwnList', { id, name }).toPromise();
  }

  removeOwnList(id) {
    return this.http.post<OwnList>(this.rootURL + 'removeOwnList', { id }).toPromise();
  }

  getSongs(ownList: string) {
    return this.http.post<Song[]>(this.rootURL + 'getSongs', { ownList }).toPromise();
  }

  addSongsToOwnList(songs: string[], ownList: string) {
    return this.http.post<Song[]>(this.rootURL + 'addSongsToOwnList', { songs, ownList }).toPromise();
  }

  getSongsByOwnList(listId) {
    return this.http.post<any>(this.rootURL + 'getSongsByOwnList', { listId }).toPromise();
  }

  removeSongOfOwnList(song: string, ownList: string) {
    return this.http.post<any>(this.rootURL + 'removeSongToOwnList', { song, ownList }).toPromise();
  }

  getOwnListsBySong(song: string) {
    return this.http.post<OwnList[]>(this.rootURL + 'getOwnListsBySong', { song }).toPromise();
  }

  setEmailContact(fullname: string, email: string, message: string) {
    return this.http.post<OwnList[]>(this.rootURL + 'setEmailContact', { fullname, email, message }).toPromise();
  }

  getAmountOwnLists() {
    return this.http.post<any>(this.rootURL + 'getAmountOwnLists', {}).toPromise();
  }

  getPlans() {
    return this.http.post<any>(this.rootURL + 'getPlans', {}).toPromise();
  }

  getValidPromoCodes() {
    return this.http.post<any>(this.rootURL + 'getValidPromoCodes', {}).toPromise();
  }

  savePayment(payment: Payment) {
    return this.http.post<Payment>(this.rootURL + 'savePayment', { payment }).toPromise();
  }

  saveUniquePayment(payment: Payment) {
    return this.http.post<Payment>(this.rootURL + 'saveUniquePayment', { payment }).toPromise();
  }

  cancelPayment(payment: Payment) {
    return this.http.post<any>(this.rootURL + 'cancelPayment', { payment }).toPromise();
  }

  getDownloads() {
    return this.http.post<DownloadFile>(this.rootURL + 'getDownloads', {}).toPromise();
  }

  createGift(fullname: string, email: string) {
    return this.http.post<Gift>(this.rootURL + 'createGift', { fullname, email }).toPromise();
  }

  payGift(payment: Payment) {
    return this.http.post<any>(this.rootURL + 'payGift', { payment }).toPromise();
  }

  cancelGift(id: string) {
    return this.http.post<any>(this.rootURL + 'cancelGift', { id }).toPromise();
  }

  getHistory() {
    return this.http.post<Payment[]>(this.rootURL + 'getHistory', { }).toPromise();
  }

  getSubscription(id: string) {
    return this.http.post<any>(this.rootURL + 'getSubscription', { id }).toPromise();
  }

  cancelSubscription(paymentId: string) {
    return this.http.post<Payment>(this.rootURL + 'cancelSubscription', { id: paymentId }).toPromise();
  }
}
