import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuyPlanPage } from './buy-plan.page';

describe('BuyPlanPage', () => {
  let component: BuyPlanPage;
  let fixture: ComponentFixture<BuyPlanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyPlanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BuyPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
