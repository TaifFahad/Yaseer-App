import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentsListPage } from './parents-list.page';

describe('ParentsListPage', () => {
  let component: ParentsListPage;
  let fixture: ComponentFixture<ParentsListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});