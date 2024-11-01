import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifiPage } from './verifi.page';

describe('VerifiPage', () => {
  let component: VerifiPage;
  let fixture: ComponentFixture<VerifiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
