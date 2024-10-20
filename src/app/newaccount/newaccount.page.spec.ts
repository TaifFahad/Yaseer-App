import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewaccountPage } from './newaccount.page';

describe('NewaccountPage', () => {
  let component: NewaccountPage;
  let fixture: ComponentFixture<NewaccountPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewaccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
