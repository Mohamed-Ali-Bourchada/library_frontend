import { TestBed } from '@angular/core/testing';

import { BookservicesService } from './bookservices.service';

describe('BookservicesService', () => {
  let service: BookservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
