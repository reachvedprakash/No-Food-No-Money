import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocationResultsPage } from './location-results.page';

describe('LocationResultsPage', () => {
  let component: LocationResultsPage;
  let fixture: ComponentFixture<LocationResultsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationResultsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
