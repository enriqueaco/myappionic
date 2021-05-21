import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddOwnlistPage } from './add-ownlist.page';

describe('AddOwnlistPage', () => {
  let component: AddOwnlistPage;
  let fixture: ComponentFixture<AddOwnlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOwnlistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddOwnlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
