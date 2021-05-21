import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreloadSongPage } from './preload-song.page';

describe('PreloadSongPage', () => {
  let component: PreloadSongPage;
  let fixture: ComponentFixture<PreloadSongPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreloadSongPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreloadSongPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
