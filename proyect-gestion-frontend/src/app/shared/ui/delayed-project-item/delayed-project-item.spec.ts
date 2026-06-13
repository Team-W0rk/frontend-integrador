import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayedProjectItem } from './delayed-project-item';

describe('DelayedProjectItem', () => {
  let component: DelayedProjectItem;
  let fixture: ComponentFixture<DelayedProjectItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelayedProjectItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelayedProjectItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
