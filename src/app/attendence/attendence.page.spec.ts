import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttendencePage } from './attendence.page';

describe('AttendencePage', () => {
  let component: AttendencePage;
  let fixture: ComponentFixture<AttendencePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
