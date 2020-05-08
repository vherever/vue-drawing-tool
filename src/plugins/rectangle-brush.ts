/*eslint-disable */
// import { fabric } from 'fabric';
import EventBus from '@/shared/eventBus';

export declare const fabric: any;
import ObjectControlsHelper from '@/plugins/object-controls-helper';

export default class RectangleBrush {
  private readonly canvas: any;
  private objectControlsHelper!: ObjectControlsHelper;

  constructor(canvas: any) {
    this.canvas = canvas;
    this.objectControlsHelper = new ObjectControlsHelper();
  }

  public draw(color: string, zoomRatio: number, lineWidth: number, isFilled?: boolean): void {
    this.canvas.off('mouse:down');
    this.canvas.off('mouse:up');
    this.canvas.off('mouse:move');
    const fabricCanvas = this.canvas;
    let initialPos: any, bounds: any, rect: any, dragging = false, freeDrawing = true;
    const options = {
      drawRect: true,
      onlyOne: false,
      rectProps: {
        stroke: color,
        strokeWidth: lineWidth,
        fill: isFilled ? color : 'transparent',
        selectable: false,
        id: this.objectControlsHelper.generateGuid(),
      }
    }
    function onMouseDown(e: any) {
      dragging = true;
      if (!freeDrawing) {
        return
      }
      initialPos = { ...e.pointer }
      bounds = {}
      rect = new fabric.Rect({
        left: initialPos.x,
        top: initialPos.y,
        width: 0, height: 0,
        ...options.rectProps
      });
      fabricCanvas.add(rect);
    }
    function update(pointer: any) {
      if (initialPos.x > pointer.x) {
        bounds.x = Math.max(0, pointer.x)
        bounds.width = initialPos.x - bounds.x
      } else {
        bounds.x = initialPos.x
        bounds.width = pointer.x - initialPos.x
      }
      if (initialPos.y > pointer.y) {
        bounds.y = Math.max(0, pointer.y)
        bounds.height = initialPos.y - bounds.y
      } else {
        bounds.height = pointer.y - initialPos.y
        bounds.y = initialPos.y
      }
      rect.left = bounds.x / zoomRatio
      rect.top = bounds.y / zoomRatio
      rect.width = bounds.width / zoomRatio
      rect.height = bounds.height / zoomRatio
      rect.dirty = true
      fabricCanvas.requestRenderAllBound()
    }
    function onMouseMove(e: any) {
      if (!dragging || !freeDrawing) {
        return
      }
      requestAnimationFrame(() => update(e.pointer));
    }
    function onMouseUp(e: any) {
      dragging = false;
      if (!freeDrawing) { return }
      if (rect && (rect.width == 0 || rect.height === 0)) {
        fabricCanvas.remove(rect);
      }
      if(!rect){
        rect = new fabric.Rect({
          ...bounds, left: bounds.x, top: bounds.y,
          ...options.rectProps
        });
        fabricCanvas.add(rect)
        rect.dirty = true
        fabricCanvas.requestRenderAllBound()
      }
      rect.setCoords(); // important!
    }
    function install() {
      freeDrawing = true; dragging = false; rect = null;
      fabricCanvas.on('mouse:down', onMouseDown);
      fabricCanvas.on('mouse:move', onMouseMove);
      fabricCanvas.on('mouse:up', onMouseUp);
    }

    freeDrawing && install();
  }
}
