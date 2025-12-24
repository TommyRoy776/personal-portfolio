import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobExperience } from './job-experience';

describe('JobExperience', () => {
  let component: JobExperience;
  let fixture: ComponentFixture<JobExperience>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobExperience]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobExperience);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
