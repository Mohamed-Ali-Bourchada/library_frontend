import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmprenterComponent } from './emprenter.component';

describe('EmprenterComponent', () => {
  let component: EmprenterComponent;
  let fixture: ComponentFixture<EmprenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmprenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmprenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
