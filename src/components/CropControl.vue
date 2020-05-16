<template>
  <div class="s_scr__crop_controls">
    <button @click="cropOkay">Crop</button>
    <button @click="cropCancel">Cancel</button>

    <input type="number" class="s_scr__canvas_width"
           v-model="cropperWidth"
           @change="onCropWidthChange" min="0">
    <span class="s_scr__crop_label">px</span>
    <span class="s_scr__crop_separator">:</span>
    <input type="number" class="s_scr__canvas_height"
           v-model="cropperHeight"
           @change="onCropHeightChange" min="0">
    <span class="s_scr__crop_label">px</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EventBus from '@/shared/eventBus';
import CanvasHelper from '@/services/canvas-helper';

export declare const fabric: any;

@Component
export default class CropControl extends Vue {
  @Prop() private canvasFabricRef!: fabric.Canvas;
  @Prop() private zoomRatio!: number;

  private canvas: any;
  private canvasHelper!: CanvasHelper;
  private cropperWidth: number = 300;
  private cropperHeight: number = 200;
  private group: any;
  private readonly strokeWidth: number = 0;
  private cropperParameters: { top: number; left: number; width: number; height: number } = {
    top: 100,
    left: 100,
    width: this.cropperWidth,
    height: this.cropperHeight,
  };

  constructor() {
    super();
    this.canvasHelper = new CanvasHelper();
  }

  mounted() {
    EventBus.$emit('drawingMode', 'crop');
    this.init(this.zoomRatio);
  }

  private get cropRectangle(): fabric.Rect {
    return this.canvas.getObjects().find((o: any) => o.type === 'crop');
  }

  private get canvasWidth(): number {
    return this.canvasFabricRef.getWidth();
  }

  private get canvasHeight(): number {
    return this.canvasFabricRef.getHeight();
  }

  private cropOkay(): void {
    this.$emit('showCropControl', true);
    EventBus.$emit('cropEmit', true);
    setTimeout(() => {
      // TODO: Improve this?
      EventBus.$emit('drawingMode', 'freedraw');
    }, 10);
  }

  private cropCancel(): void {
    this.$emit('showCropControl', true);
    this.removeCropperOverlay();
  }

  public init(zoomRatio: number): void {
    this.zoomRatio = zoomRatio;
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
    this.groupObjects(this.canvasFabricRef);
    const activeObject: any = this.canvasFabricRef.getActiveObject();
    activeObject.set('left', (activeObject.aCoords.tl.x - data.left / this.zoomRatio));
    activeObject.set('top', (activeObject.aCoords.tl.y - data.top / this.zoomRatio));
    const items = activeObject.getObjects();
    activeObject.destroy();
    this.canvasFabricRef.remove(activeObject);
    for (let i = 0; i < items.length; i++) {
      this.canvasFabricRef.add(items[i]);
    }

    this.canvasFabricRef.discardActiveObject();
    this.canvasFabricRef.remove(this.group);
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
        backgroundColor: 'rgba(0,0,0,0.75)',
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
        strokeUniform: true,
        lockScalingFlip: true,
        // minScaleLimit: 0.5,
      });
      this.canvas.add(rect);
      rect.center();
      this.canvas.setActiveObject(rect);
      this.canvas.renderAll();
    }
  }

  private listenToEvents(): void {
    const rect: fabric.Rect | any = this.cropRectangle;

    EventBus.$off('cropEmit');
    this.canvas.off('selection:cleared');

    EventBus.$on('cropEmit', () => {
      this.cropCanvas();
    });

    this.canvas.on('selection:cleared', (e: any) => {
      this.canvas.setActiveObject(e.deselected[0]);
    });

    rect.on('moving', (e: any) => {
      this.canvasHelper.preventMovingObjectsOutsideCanvas(e);
    });

    rect.on('scaling', () => {
      const width: number = parseInt((rect.width * rect.scaleX).toString(), 10);
      const height: number = parseInt((rect.height * rect.scaleY).toString(), 10);

      this.cropperWidth = width;
      this.cropperHeight = height;

      rect.minScaleLimit = 0.5;

      rect.setCoords();
      this.canvas.requestRenderAll();
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
    this.canvasFabricRef.setDimensions({
      width: this.cropperWidth,
      height: this.cropperHeight,
    });
    this.ungroupObjects(this.cropperParameters);
    this.removeCropperOverlay();
    EventBus.$emit('canvasDimensions', {
      width: this.cropperWidth,
      height: this.cropperHeight,
    });
  }

  private onCropWidthChange(e: any): void {
    const value: number = parseInt(e.target.value.toString(), 10);
    const cropRect: any = this.canvas.getObjects().find((o: any) => o.type === 'crop');
    const scale: any = cropRect.getObjectScaling();
    cropRect.set('width', value / scale.scaleX);
    cropRect.set('minScaleLimit', 0.5);
    cropRect.setCoords();
    this.canvas.requestRenderAll();
  }

  private onCropHeightChange(e: any): void {
    const value: number = parseInt(e.target.value.toString(), 10);
    const cropRect: any = this.canvas.getObjects().find((o: any) => o.type === 'crop');
    const scale: any = cropRect.getObjectScaling();
    cropRect.set('height', value / scale.scaleY);
    cropRect.set('minScaleLimit', 0.5);
    cropRect.setCoords();
    this.canvas.requestRenderAll();
  }
}
</script>

<style scoped lang="scss">
  .s_scr__crop_controls {
    .s_scr__canvas_width {
      margin-left: 25px;
      width: 40px;
    }
    .s_scr__canvas_height {
      width: 40px;
    }
    .s_scr__crop_label {
      font-size: 13px;
      margin-left: 2px;
    }
    .s_scr__crop_separator {
      font-size: 15px;
      margin: 0 5px;
    }
  }
</style>