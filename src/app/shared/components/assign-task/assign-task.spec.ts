import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTask } from './assign-task';

describe('AssignTask', () => {
  let component: AssignTask;
  let fixture: ComponentFixture<AssignTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignTask]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignTask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
