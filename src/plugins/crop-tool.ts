import EventBus from '@/shared/eventBus';
import CanvasHelper from '@/services/canvas-helper';

export declare const fabric: any;

export default class CropTool {
  private canvas: any;
  private canvasWidth!: number;
  private canvasHeight!: number;
  private canvasHelper!: CanvasHelper;
  private cropperParameters: { top: number; left: number; width: number; height: number } = {
    top: 100,
    left: 100,
    width: 300,
    height: 200,
  };
  private group: any;
  private readonly parentCanvas: any;
  private strokeWidth: number = 2;

  constructor(parentCanvas: any) {
    this.parentCanvas = parentCanvas;
    this.canvasHelper = new CanvasHelper();
  }

  public init(canvasWidth: number, canvasHeight: number): void {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.draw();
    this.listenToEvents();
  }

  public removeCropperOverlay(): void {
    const cropOverlay = document.getElementById('s_scr__canvas_overlay');
    this.canvas = null;
    if (cropOverlay) {
      (cropOverlay.parentNode as any).remove();
    }
  }

  private groupObjects(canvasParent: any): void {
    const objects = canvasParent.getObjects().map((o: any) => o.set('active', true));
    const group = new fabric.Group(objects);
    // eslint-disable-next-line
    canvasParent._activeObject = null;
    canvasParent.setActiveObject(group.setCoords()).renderAll();

    const ao = canvasParent.getActiveObject();
    const objectsInGroup = ao.getObjects();
    ao.clone((newgroup: any) => {
      this.group = newgroup;
      objectsInGroup.forEach((object: any) => {
        canvasParent.remove(object);
      });
      canvasParent.add(this.group);
    });
  }

  private ungroupObjects(data: any): void {
    console.log('data', data);
    this.groupObjects(this.parentCanvas);
    const activeObject: any = this.parentCanvas.getActiveObject();
    activeObject.set('left', activeObject.aCoords.tl.x - data.left);
    activeObject.set('top', activeObject.aCoords.tl.y - data.top);
    const items = activeObject.getObjects();
    activeObject.destroy();
    this.parentCanvas.remove(activeObject);
    for (let i = 0; i < items.length; i++) {
      this.parentCanvas.add(items[i]);
    }

    this.parentCanvas.discardActiveObject();
    this.parentCanvas.remove(this.group);
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
        top: this.cropperParameters.top + this.strokeWidth / 2,
        left: this.cropperParameters.left + this.strokeWidth / 2,
        width: this.cropperParameters.width - this.strokeWidth,
        height: this.cropperParameters.height - this.strokeWidth,
        strokeDashArray: [5, 5],
        stroke: 'black',
        strokeWidth: this.strokeWidth,
        globalCompositeOperation: 'destination-out',
        type: 'crop',
        hasRotatingPoint: false,
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
    this.canvas.off('selection:cleared');

    EventBus.$on('cropEmit', () => {
      this.cropCanvas();
    });

    this.canvas.on('object:moving', (e: any) => {
      this.canvasHelper.preventMovingObjectsOutsideCanvas(e);
    });

    this.canvas.on('selection:cleared', (e: any) => {
      this.canvas.setActiveObject(e.deselected[0]);
    });
  }

  private cropCanvas(): void {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      const { aCoords } = activeObject;
      this.cropperParameters = {
        top: parseFloat(activeObject.top.toFixed(2)),
        left: parseFloat(activeObject.left.toFixed(2)),
        width: parseFloat((aCoords.tr.x - aCoords.tl.x).toFixed(2)),
        height: parseFloat((aCoords.bl.y - aCoords.tl.y).toFixed(2)),
      };
      /*
      this.cropperParameters = {
        top: activeObject.top,
        left: activeObject.left,
        width: activeObject.width,
        height: activeObject.height,
      };
       */
    }
    this.parentCanvas.setDimensions({
      width: this.cropperParameters.width,
      height: this.cropperParameters.height,
    });
    this.ungroupObjects(this.cropperParameters);
    this.removeCropperOverlay();
  }
}
