import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GiftPayPage } from './gift-pay.page';

describe('GiftPayPage', () => {
  let component: GiftPayPage;
  let fixture: ComponentFixture<GiftPayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftPayPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GiftPayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
