import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksForAdminComponent } from './books-for-admin.component';

describe('BooksForAdminComponent', () => {
  let component: BooksForAdminComponent;
  let fixture: ComponentFixture<BooksForAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksForAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksForAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
