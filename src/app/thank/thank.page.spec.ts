import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ThankPage } from './thank.page';

describe('ThankPage', () => {
  let component: ThankPage;
  let fixture: ComponentFixture<ThankPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThankPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ThankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
