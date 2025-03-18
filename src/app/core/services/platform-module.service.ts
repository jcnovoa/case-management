import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlatformModuleService {
  private platformModules = [
    'Home',
    'Analytics',
    'Evaluations',
    'Playbooks',
    'Work',
    'My Space',
    'Administration'
  ];

  constructor() { }

  getPlatformModules(): Observable<string[]> {
    return of(this.platformModules);
  }
}
