import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { StatisticsService } from 'src/app/services/statistics.service';
import { DialogAnimationsExampleComponent } from '../dialog-animations-example/dialog-animations-example.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnInit, AfterViewInit {
  @ViewChild('gameBorder') gameBorder!: ElementRef;

  pixel: number[] = [];
  snake: number[] = [312, 311];
  food!: number;
  intervalId?: number;
  interval: number = 300;
  level: number = 1;

  currentDirection: string = 'ArrowRight';
  nextDirection: string = 'ArrowRight';

  constructor(
    private statisticsService: StatisticsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    for (let i = 0; i < 625; i++) {
      this.pixel.push(i);
    }
    this.randomFood();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.gameBorder.nativeElement.focus();
    }, 0);
  }

  public isSnake(e: number): boolean {
    return this.snake.some((el) => e === el);
  }

  public isHead(e: number): boolean {
    return this.snake[0] === e;
  }

  public isFood(element: number): boolean {
    return element === this.food;
  }

  public keydown(ev: KeyboardEvent): void {
    const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (!validKeys.includes(ev.key)) {
      return;
    }
    this.noRevers(ev);
    if (!this.intervalId) {
      this.startGameLoop();
    }
  }

  private startGameLoop() {
    this.intervalId = window.setInterval(() => {
      this.currentDirection = this.nextDirection;

      const head = this.snake[0];
      let newHead: number | undefined;

      switch (this.currentDirection) {
        case 'ArrowUp':
          newHead = head - 25;
          if (newHead < 0) {
            this.gameOver();
            return;
          }
          break;
        case 'ArrowDown':
          newHead = head + 25;
          if (newHead >= 625) {
            this.gameOver();
            return;
          }
          break;
        case 'ArrowRight':
          newHead = head + 1;
          const rightOver = [
            25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350,
            375, 400, 425, 450, 475, 500, 525, 550, 575, 600, 625,
          ];
          if (rightOver.includes(newHead)) {
            this.gameOver();
            return;
          }
          break;
        case 'ArrowLeft':
          newHead = head - 1;
          const leftOver = [
            -1, 24, 49, 74, 99, 124, 149, 174, 199, 224, 249, 274, 299, 324,
            349, 374, 399, 424, 449, 474, 499, 524, 549, 574, 599,
          ];
          if (leftOver.includes(newHead)) {
            this.gameOver();
            return;
          }
          break;
        default:
          return;
      }

      if (newHead !== undefined && this.snake.includes(newHead)) {
        this.gameOver();
        return;
      }

      this.snake.unshift(newHead);

      if (newHead === this.food) {
        this.statisticsService.setPoints(this.snake.length - 2);
        this.randomFood();
        if (this.snake.length % 10 === 0) {
          this.interval -= 20;
          this.level += 1;
          this.statisticsService.setLevel(this.level);
          this.restartGameLoop();
        }
      } else {
        this.snake.pop();
      }
    }, this.interval);
  }

  private restartGameLoop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.startGameLoop();
    }
  }

  private openDialog(): MatDialogRef<DialogAnimationsExampleComponent, any> {
    return this.dialog.open(DialogAnimationsExampleComponent, {
      width: '1350px',
      height: '300px',
      enterAnimationDuration: '2000ms',
      exitAnimationDuration: '900ms',
      panelClass: 'custom-dialog-container',
    });
  }

  private gameOver() {
    clearInterval(this.intervalId);
    this.statisticsService.setRecord(this.snake.length - 2);
    this.openDialog()
      .afterClosed()
      .subscribe(() => {
        this.resetGame();
      });
  }

  private resetGame() {
    this.snake = [312, 311];
    this.currentDirection = 'ArrowRight';
    this.nextDirection = 'ArrowRight';
    this.intervalId = undefined;
    this.interval = 300;
    this.level = 1;
    this.statisticsService.setLevel(this.level);
    this.statisticsService.setPoints(this.snake.length - 2);
    this.randomFood();
  }

  private noRevers(ev: KeyboardEvent) {
    const newKey = ev.key;

    if (
      (this.currentDirection === 'ArrowRight' && newKey === 'ArrowLeft') ||
      (this.currentDirection === 'ArrowLeft' && newKey === 'ArrowRight') ||
      (this.currentDirection === 'ArrowUp' && newKey === 'ArrowDown') ||
      (this.currentDirection === 'ArrowDown' && newKey === 'ArrowUp')
    ) {
      return;
    }

    this.nextDirection = newKey;
  }

  private randomFood() {
    const availablePixels = this.pixel.filter(
      (pixel) => !this.snake.includes(pixel)
    );
    const randomIndex = Math.floor(Math.random() * availablePixels.length);
    this.food = availablePixels[randomIndex];
  }
}
