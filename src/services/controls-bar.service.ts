// import { fabric } from 'fabric';
export declare const fabric: any;

export default class ControlsBarService {
  private readonly canvas!: fabric.Canvas;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }
}
