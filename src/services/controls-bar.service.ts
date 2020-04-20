import { fabric } from 'fabric';

export default class ControlsBarService {
  private readonly canvas!: fabric.Canvas;
  private readonly zoomRatios: number[] = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
  private currentZoomIndex: number = 3;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  public get defaultZoomPercentage(): number {
    return this.zoomRatios[3] * 100;
  }

  public onZoomClick(type: string): number {
    switch (type) {
      case 'in':
        if (++this.currentZoomIndex < this.zoomRatios.length) {
          this.canvas.setZoom(this.zoomRatios[this.currentZoomIndex]);
        } else {
          this.currentZoomIndex = this.zoomRatios.length - 1;
        }
        break;
      case 'out':
        if (--this.currentZoomIndex >= 0) {
          this.canvas.setZoom(this.zoomRatios[this.currentZoomIndex]);
        } else {
          this.currentZoomIndex = 0;
        }
        break;
      default:
        break;
    }

    return this.zoomRatios[this.currentZoomIndex];
  }

  public onZoomReset(): void {
    this.currentZoomIndex = 3;
    this.canvas.setZoom(this.zoomRatios[this.currentZoomIndex]);
  }
}
