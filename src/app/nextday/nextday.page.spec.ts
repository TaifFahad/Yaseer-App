import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NextdayPage } from './nextday.page';

describe('NextdayPage', () => {
  let component: NextdayPage;
  let fixture: ComponentFixture<NextdayPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NextdayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
