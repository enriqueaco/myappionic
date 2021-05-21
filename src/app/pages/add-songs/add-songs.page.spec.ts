import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddSongsPage } from './add-songs.page';

describe('AddSongsPage', () => {
  let component: AddSongsPage;
  let fixture: ComponentFixture<AddSongsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSongsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddSongsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
