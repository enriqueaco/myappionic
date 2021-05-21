import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MusicSheetPage } from './music-sheet.page';

describe('MusicSheetPage', () => {
  let component: MusicSheetPage;
  let fixture: ComponentFixture<MusicSheetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicSheetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MusicSheetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
