import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, tap, switchMap, takeUntil, finalize } from 'rxjs/operators';
@Component({
  selector: 'hello',
  template: `
  <canvas 
    #canvas [style.border]="'1px solid black'"width="500" height="200"></canvas>`,
})
export class HelloComponent {
  @Input() name: string;
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    const mouseDownStream = fromEvent(this.canvas.nativeElement, 'mousedown');
    const mouseMoveStream = fromEvent(this.canvas.nativeElement, 'mousemove');
    const mouseUpStream = fromEvent(window, 'mouseup');
    mouseDownStream
      .pipe(
        tap((event: MouseEvent) => {
          this.ctx.beginPath();
          this.ctx.strokeStyle = 'red';
          this.ctx.lineWidth = 5;
          this.ctx.lineJoin = 'round';
          this.ctx.moveTo(event.offsetX, event.offsetY);
        }),
        switchMap(() =>
          mouseMoveStream.pipe(
            tap((event: MouseEvent) => {
              this.ctx.lineTo(event.offsetX, event.offsetY);
              this.ctx.stroke();
            }),
            takeUntil(mouseUpStream),
            finalize(() => {
              this.ctx.closePath();
            })
          )
        )
      )
      .subscribe(console.log);
  }
}
