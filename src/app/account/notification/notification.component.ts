import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifyType } from '../../models/notify.model';
import { covertDateToDMY } from '../../util/formatDate';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit{
  unreadNotifications: NotifyType[];
  readNotifications: NotifyType[];

  constructor(private router: Router, private route: ActivatedRoute, private notifyService: NotifyService) {
    this.route.queryParams.subscribe(params => {
      const notifies = JSON.parse(params['data']);
      console.log(notifies);
      this.unreadNotifications = notifies
    });
  }

  ngOnInit(): void {
      this.notifyService.getReadNotify().subscribe(res => {
        console.log(res);
        this.readNotifications = res.data
      })
  }

  formatDate(d: Date) {
    return covertDateToDMY(d);
  }

  onReadNotify(notify: NotifyType) {
    this.notifyService.changeReadNotify(notify._id).subscribe(res => {
      if(res.message === 'ok') {
        this.unreadNotifications = this.unreadNotifications.filter(noti => noti._id !== notify._id);
        this.readNotifications = [notify, ...this.readNotifications];
      }
    })
  }

}
