import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlcoholLevelComponent } from './alcohol-level.component';

describe('AlcoholLevelComponent', () => {
  let component: AlcoholLevelComponent;
  let fixture: ComponentFixture<AlcoholLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlcoholLevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlcoholLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
