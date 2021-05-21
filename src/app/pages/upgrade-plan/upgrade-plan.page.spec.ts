import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpgradePlanPage } from './upgrade-plan.page';

describe('UpgradePlanPage', () => {
  let component: UpgradePlanPage;
  let fixture: ComponentFixture<UpgradePlanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradePlanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpgradePlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
