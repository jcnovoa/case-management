import { TestBed } from '@angular/core/testing';

import { PlatformModuleService } from './platform-module.service';

describe('PlatformModuleService', () => {
  let service: PlatformModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlatformModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
