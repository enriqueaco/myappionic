import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GiftRequestPage } from './gift-request.page';

describe('GiftRequestPage', () => {
  let component: GiftRequestPage;
  let fixture: ComponentFixture<GiftRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftRequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GiftRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
