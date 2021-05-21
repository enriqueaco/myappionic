import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreloadListPage } from './preload-list.page';

describe('PreloadListPage', () => {
  let component: PreloadListPage;
  let fixture: ComponentFixture<PreloadListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreloadListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreloadListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
