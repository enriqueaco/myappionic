import { Component, OnInit, Input } from '@angular/core';
import { Howl } from 'howler';
import { VOLUME_CANTO_APP } from '../../constants/constants';

@Component({
  selector: 'app-volume-popover',
  templateUrl: './volume-popover.component.html',
  styleUrls: ['./volume-popover.component.scss'],
})
export class VolumePopoverComponent implements OnInit {

  @Input() player: Howl = null;
  @Input() playerBackground: Howl = null;

  constructor() { }

  ngOnInit() {}

  changeVolume(event) {
    const volume = event.detail.value / 100;
    this.player.volume(volume);
    this.playerBackground.volume(volume);
    localStorage.setItem(VOLUME_CANTO_APP, volume.toString());
  }

}
