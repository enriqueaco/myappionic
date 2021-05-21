import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OwnListsPage } from './own-lists.page';

describe('OwnListsPage', () => {
  let component: OwnListsPage;
  let fixture: ComponentFixture<OwnListsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnListsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OwnListsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
