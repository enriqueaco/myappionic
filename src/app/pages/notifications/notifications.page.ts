import { Component, OnInit } from '@angular/core';
import { Notification } from '../../models/notification.model';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notifications: Notification[] = [];

  constructor(
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    this.notificationsService.notifications.subscribe(notifications => {
      this.notifications = notifications;
    });
    this.notificationsService.allSeen();
  }

}
