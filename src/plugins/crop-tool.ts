/*eslint-disable */
import EventBus from '@/shared/eventBus';
import CanvasHelper from "@/services/canvas-helper";

export declare const fabric: any;

export default class CropTool {
  private canvas: any;
  private readonly canvasWidth: number;
  private readonly canvasHeight: number;
  private canvasHelper!: CanvasHelper;
  private cropperParameters: { top: number, left: number, width: number, height: number } = {
    top: 100,
    left: 100,
    width: 300,
    height: 200,
  };

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.canvasHelper = new CanvasHelper();
  }

  public init(): void {
    this.draw();
    this.listenToEvents();
  }

  public removeCropperOverlay(): void {
    const cropOverlay = document.getElementById('s_scr__canvas_overlay');
    this.canvas = null;
    cropOverlay && (cropOverlay.parentNode as any).remove();
  }

  private draw(): void {
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
        top: this.cropperParameters.top,
        left: this.cropperParameters.left,
        width: this.cropperParameters.width,
        height: this.cropperParameters.height,
        strokeDashArray: [5, 5],
        stroke: '#ffffff',
        strokeWidth: 1,
        globalCompositeOperation: 'destination-out',
        type: 'crop',
      });
      this.canvas.add(rect);
      rect.center();
      this.canvas.setActiveObject(rect);
      this.canvas.renderAll();
    }
  }

  private listenToEvents(): void {
    EventBus.$off('cropEmit');
    this.canvas.off('object:moving');

    EventBus.$on('cropEmit', () => {
      this.cropCanvas();
    });

    this.canvas.on('object:moving', (e: any) => {
      this.canvasHelper.preventMovingObjectsOutsideCanvas(e);
    });
  }

  private cropCanvas(): void {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      const aCoords = activeObject.aCoords;
      this.cropperParameters = {
        top: parseFloat(activeObject.top.toFixed(2)),
        left: parseFloat(activeObject.left.toFixed(2)),
        width: parseFloat((aCoords.tr.x - aCoords.tl.x).toFixed(2)),
        height: parseFloat((aCoords.bl.y - aCoords.tl.y).toFixed(2)),
      };
    }
    EventBus.$emit('canvasDimensions', this.cropperParameters);
  }
}
