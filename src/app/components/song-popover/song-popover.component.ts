import { Component, OnInit, Input } from '@angular/core';
import { Song } from '../../models/song.model';
import { NavigationExtras, Router } from '@angular/router';
import { Status } from '../../constants/status';
import { PlaylistStatusService } from '../../services/playlist-status.service';
import { Howl } from 'howler';
import { LoadingController, PopoverController } from '@ionic/angular';
import { PlaylistPage } from '../../pages/playlist/playlist.page';

@Component({
  selector: 'app-song-popover',
  templateUrl: './song-popover.component.html',
  styleUrls: ['./song-popover.component.scss'],
})
export class SongPopoverComponent implements OnInit {

  @Input() song: Song;
  @Input() page: PlaylistPage;
  status: Status;
  active = false;

  constructor(
    private router: Router,
    private playlistStatus: PlaylistStatusService,
    public popoverController: PopoverController
  ) {
    this.status = playlistStatus.status;
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.active = true;
  }




  openSong() {
    this.popoverController.dismiss();
    if (this.status.isPlaying) {
      if (this.song._id === this.status.activeTrack._id) {
        // this.page.togglePlayer(true);
        this.router.navigateByUrl('/play-song');
      } else {
        this.page.start(this.song, (res) => {
          console.log('ssssss');
          if (res && this.active) {
            this.active = false;
            this.page.togglePlayer(true);
            this.router.navigateByUrl('/play-song');
          }
        });
      }
    } else {
      this.page.start(this.song, (res) => {
        console.log('ffff');
        if (res && this.active) {
          this.active = false;
          this.page.togglePlayer(true);
          this.router.navigateByUrl('/play-song');
        }
      });
    }
  }

}
