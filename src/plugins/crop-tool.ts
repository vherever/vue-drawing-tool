/*eslint-disable */
export declare const fabric: any;

export default class CropTool {
  private canvas: any;
  private readonly canvasWidth: number;
  private readonly canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  public draw(): void {
    const canvasWrapper = document.getElementsByClassName('s_scr__canvas_wrapper')[0];
    if (!document.getElementById('s_scr__canvas_overlay')) {
      const drawingOverlay = document.createElement('canvas');
      drawingOverlay.id = 's_scr__canvas_overlay';
      canvasWrapper.appendChild(drawingOverlay);
      this.canvas = new fabric.Canvas('s_scr__canvas_overlay', {
        isDrawingMode: false,
        selection: false,
        backgroundColor: '#0000009e',
      });
      this.canvas.setDimensions({ width: this.canvasWidth, height: this.canvasHeight });

      const rect = new fabric.Rect({
        top: 150,
        left: 80,
        width: 200,
        height: 200,
        strokeDashArray: [5, 5],
        stroke: '#ffffff',
        strokeWidth: 1,
        globalCompositeOperation: 'destination-out',
        type: 'crop',
      });
      console.log('rect', rect);
      this.canvas.add(rect);
      this.canvas.renderAll();
    }
  }
}
