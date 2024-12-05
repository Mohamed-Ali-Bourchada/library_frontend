import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmprintAdminComponent } from './emprint-admin.component';

describe('EmprintAdminComponent', () => {
  let component: EmprintAdminComponent;
  let fixture: ComponentFixture<EmprintAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmprintAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmprintAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
