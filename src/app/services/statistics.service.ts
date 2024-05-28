import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  level: BehaviorSubject<number> = new BehaviorSubject(1);
  pointsScored: BehaviorSubject<number> = new BehaviorSubject(0);
  record: BehaviorSubject<number> = new BehaviorSubject(this.getLocalStorage());

  constructor() {}
  setLevel(level: number) {
    this.level.next(level);
  }

  setPoints(points: number) {
    this.pointsScored.next(points);
  }

  setRecord(record: number) {
    if (this.record.value < record) {
      this.record.next(record);
      this.setLocalStorage(record);
    }
  }

  private setLocalStorage(record: number) {
    localStorage.setItem('record', record.toString());
  }

  private getLocalStorage() {
    const local = localStorage.getItem('record');
    return local ? Number(local) : 0;
  }
}
