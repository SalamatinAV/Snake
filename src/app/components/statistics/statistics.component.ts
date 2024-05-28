import { Component, OnInit } from '@angular/core';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  level!: number;
  pointsScored!: number;
  record!: number;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.statisticsService.level.subscribe((level) => (this.level = level));
    this.statisticsService.pointsScored.subscribe(
      (points) => (this.pointsScored = points)
    );
    this.statisticsService.record.subscribe((record) => (this.record = record));
  }
}
