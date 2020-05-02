/*eslint-disable */
import { fabric } from 'fabric';
import ObjectControlsHelper from '@/plugins/object-controls-helper';

export default class RectangleBrush {
  private readonly canvas: any;
  private objectControlsHelper!: ObjectControlsHelper;

  constructor(canvas: any) {
    this.canvas = canvas;
    this.objectControlsHelper = new ObjectControlsHelper();
    this.init();
  }

  private init(): void {
    const fabricCanvas = this.canvas;
    fabricCanvas.off('mouse:over');
    uninstall();
    let initialPos: any, bounds: any, rect: any, dragging = false, freeDrawing = true
    const options = {
      drawRect: true,
      onlyOne: false,
      rectProps: {
        stroke: '#000000',
        strokeWidth: 2,
        fill: '',
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
      fabricCanvas.add(rect)
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
      rect.left = bounds.x
      rect.top = bounds.y
      rect.width = bounds.width
      rect.height = bounds.height
      rect.dirty = true
      fabricCanvas.requestRenderAllBound()
      // fabricCanvas.requestRenderAll()
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
        // fabricCanvas.requestRenderAll()
      }
      rect.setCoords(); // important!
      // uninstall();
    }
    function install() {
      freeDrawing = true; dragging = false; rect = null;
      fabricCanvas.on('mouse:down', onMouseDown);
      fabricCanvas.on('mouse:move', onMouseMove);
      fabricCanvas.on('mouse:up', onMouseUp);
    }
    function uninstall() {
      freeDrawing = false; dragging = false; rect = null
      fabricCanvas.off('mouse:down', onMouseDown);
      fabricCanvas.off('mouse:move', onMouseMove);
      fabricCanvas.off('mouse:up', onMouseUp);
    }

    freeDrawing && install()
  }
}
