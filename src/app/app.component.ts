import { Component, ViewChild, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, tap, switchMap, takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
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

  ngOnInit() {
    this.loadImageFromURL();
  }

  loadImageFromURL() {
    var image = new Image();
    image.onload = function () {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.id = 'c';
      context.drawImage(image, 0, 0);
      let ele = document.getElementById('f');
      if (ele !== null && ele !== undefined) {
        ele.appendChild(canvas);
      }
    };
    image.src = this.imageUrl;
    let ele = document.getElementById('c');
    console.log(ele);
  }

  fileToUpload: any;
  imageUrl: any;
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);

    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
      this.loadImageFromURL();
    };
    reader.readAsDataURL(this.fileToUpload);
  }
}
