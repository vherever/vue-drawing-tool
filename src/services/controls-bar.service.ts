import { fabric } from 'fabric';

export default class ControlsBarService {
  private readonly canvas!: fabric.Canvas;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }
}
