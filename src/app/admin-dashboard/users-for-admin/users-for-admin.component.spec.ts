import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersForAdminComponent } from './users-for-admin.component';

describe('UsersForAdminComponent', () => {
  let component: UsersForAdminComponent;
  let fixture: ComponentFixture<UsersForAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersForAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersForAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
