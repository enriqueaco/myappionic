import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GiftConfirmPage } from './gift-confirm.page';

describe('GiftConfirmPage', () => {
  let component: GiftConfirmPage;
  let fixture: ComponentFixture<GiftConfirmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftConfirmPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GiftConfirmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
