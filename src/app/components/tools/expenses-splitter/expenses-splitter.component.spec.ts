import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesSplitterComponent } from './expenses-splitter.component';

describe('ExpensesSplitterComponent', () => {
  let component: ExpensesSplitterComponent;
  let fixture: ComponentFixture<ExpensesSplitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesSplitterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesSplitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
