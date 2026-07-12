import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private activePageSubject = new BehaviorSubject<number>(0);
  activePage$ = this.activePageSubject.asObservable();

  private virtualScrollYSubject = new BehaviorSubject<number>(0);
  virtualScrollY$ = this.virtualScrollYSubject.asObservable();

  getActivePage(): number {
    return this.activePageSubject.value;
  }

  setActivePage(page: number) {
    this.activePageSubject.next(page);
  }

  setVirtualScrollY(y: number) {
    this.virtualScrollYSubject.next(y);
  }

  getVirtualScrollY(): number {
    return this.virtualScrollYSubject.value;
  }
}
