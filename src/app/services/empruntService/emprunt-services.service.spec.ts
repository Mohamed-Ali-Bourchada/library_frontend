import { TestBed } from '@angular/core/testing';

import { EmpruntServicesService } from './emprunt-services.service';

describe('EmpruntServicesService', () => {
  let service: EmpruntServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpruntServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
