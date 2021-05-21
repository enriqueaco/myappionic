import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-init-view',
  templateUrl: './init-view.component.html',
  styleUrls: ['./init-view.component.scss'],
})
export class InitViewComponent implements OnInit {

  @Output() changeStart: EventEmitter<boolean> = new EventEmitter();

  constructor(private api: ApiService) { }

  ngOnInit() {}

  start() {
    this.changeStart.emit(true);
  }

}
