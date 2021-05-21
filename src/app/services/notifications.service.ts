import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NOTIFICATION_TYPES } from '../constants/constants';
import { Notification } from '../models/notification.model';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import * as _ from 'lodash';
import { firestore } from 'firebase';
import { Song } from '../models/song.model';
import { ReproductionLog } from '../models/reproduction-log.model';
import { IpAddressService } from './ip-address.service';
import { DetailsLog } from '../models/details-log.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  public notifications: BehaviorSubject<Notification[]> = new BehaviorSubject([]);
  forAllNotifications: Notification[] = [];
  userNotifications: Notification[] = [];
  currentUser: User;
  constructor(
    private db: AngularFirestore,
    private auth: AuthService,
    private ipService: IpAddressService
  ) { }

  init() {
    this.ipService.init(() => { });
    this.auth.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.db.collection('notifications', ref => {
          return ref.where('deleted', '==', false)
            .where('user', '==', user._id)
            .orderBy('createdAt', 'desc');
        }).valueChanges().subscribe(notifications => {
          this.userNotifications = notifications;
          this.refresh();
        });
      } else {
        this.userNotifications = [];
        this.refresh();
      }
    });
    this.db.collection('notifications', ref => {
      return ref.where('deleted', '==', false)
        .where('user', '==', NOTIFICATION_TYPES.forAll)
        .orderBy('createdAt', 'desc');
    }).valueChanges().subscribe(notifications => {
      this.forAllNotifications = notifications;
      this.refresh();
    });
  }

  refresh() {
    const notifications: Notification[] = _.concat(this.forAllNotifications, this.userNotifications);
    this.notifications.next(_.orderBy(notifications, ['createdAt'], ['desc']));
  }

  allSeen() {
    this.db.collection('notifications').ref
      .where('deleted', '==', false)
      .where('user', '==', NOTIFICATION_TYPES.forAll)
      .where('seen', '==', false)
      .orderBy('createdAt', 'desc')
      .get().then(snap => {
        snap.forEach(doc => {
          doc.ref.set({ seen: true }, { merge: true });
        });
      });
  }

  addReproductionLog(song: Song, user: User) {
    this.db.doc<ReproductionLog>(`reproductions/${song._id}`).get().subscribe(doc => {
      if (doc.exists) {
        const log = doc.data();
        log.count += 1;
        if (_.get(this.ipService.country, 'code')) {
          if (_.indexOf(log.countries, this.ipService.country.code) === -1) {
            log.countries.push(_.get(this.ipService.country, 'code'));
          }
        }
        doc.ref.set(log, { merge: true }).then(() => {
          const details: DetailsLog = {
            createdAt: firestore.Timestamp.now(),
            ipData: this.ipService.resumedIpData,
            user: user ? _.pick(user, ['email', 'fullname']) : null
          };
          this.db.collection(`reproductions/${song._id}/details`).add(details);
        });
      } else {
        const log: ReproductionLog = {
          id: song._id,
          song: _.pick(song, ['indexNumber', 'title', 'fullname', 'duration', 'author', 'icon', 'iconBackground', 'description']),
          count: 1,
          countries: _.get(this.ipService.country, 'code') ? [_.get(this.ipService.country, 'code')] : []
        };
        this.db.doc<ReproductionLog>(`reproductions/${song._id}`).set(log).then(() => {
          const details: DetailsLog = {
            createdAt: firestore.Timestamp.now(),
            ipData: this.ipService.resumedIpData,
            user: user ? _.pick(user, ['email', 'fullname']) : null
          };
          this.db.collection(`reproductions/${song._id}/details`).add(details);
        });
      }
    });
  }

  addPreloadLog(song: Song, user: User) {
    this.db.doc<ReproductionLog>(`preloads/${song._id}`).get().subscribe(doc => {
      if (doc.exists) {
        const log = doc.data();
        log.count += 1;
        if (_.get(this.ipService.country, 'code')) {
          if (_.indexOf(log.countries, this.ipService.country.code) === -1) {
            log.countries.push(_.get(this.ipService.country, 'code'));
          }
        }
        doc.ref.set(log, { merge: true }).then(() => {
          const details: DetailsLog = {
            createdAt: firestore.Timestamp.now(),
            ipData: this.ipService.resumedIpData,
            user: user ? _.pick(user, ['email', 'fullname']) : null
          };
          this.db.collection(`preloads/${song._id}/details`).add(details);
        });
      } else {
        const log: ReproductionLog = {
          id: song._id,
          song: _.pick(song, ['indexNumber', 'title', 'fullname', 'duration', 'author', 'icon', 'iconBackground', 'description']),
          count: 1,
          countries: _.get(this.ipService.country, 'code') ? [_.get(this.ipService.country, 'code')] : []
        };
        this.db.doc<ReproductionLog>(`preloads/${song._id}`).set(log).then(() => {
          const details: DetailsLog = {
            createdAt: firestore.Timestamp.now(),
            ipData: this.ipService.resumedIpData,
            user: user ? _.pick(user, ['email', 'fullname']) : null
          };
          this.db.collection(`preloads/${song._id}/details`).add(details);
        });
      }
    });
  }
}
