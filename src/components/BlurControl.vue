<template>
  <button class="c_blur_control"
          @click="onBlurClick">blur</button>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
} from 'vue-property-decorator';
import { FabricGroupFormatter } from '@/helpers/class-extend.helper';
import EventBus from '@/shared/eventBus';

export declare const fabric: any;

@Component
export default class BlurControl extends Vue {
  @Prop() private fabricCanvasRef!: fabric.Canvas;
  @Prop() private zoomRatio!: number;
  private image!: any;
  private blurredCanvas!: any;

  private blurSelection(left: number, top: number, img: any): void {
    if (img) {
      img.cropX = left * this.zoomRatio;
      img.cropY = top * this.zoomRatio;
      img.width *= img.scaleX;
      img.height *= img.scaleY;
      img.scaleX = 1;
      img.scaleY = 1;
      img.type2 = 'blur';
      this.image = img;
    } else {
      // eslint-disable-next-line
      fabric.Image.fromURL(this.blurredCanvas.toDataURL(), (img) => {
        img.cropX = left * this.zoomRatio;
        img.cropY = top * this.zoomRatio;
        img.width = 200; // Default
        img.height = 200; // Default
        img.objectCaching = false;
        this.fabricCanvasRef.add(img);
        img.bringToFront();
        img.hasRotatingPoint = false;
        img.strokeUniform = true;
        img.lockScalingFlip = true;
        img.type2 = 'blur';
        this.image = img;
        img.set({
          stroke: 'lightgrey',
          strokeWidth: 1,
          strokeDashArray: [5, 5],
          top: 0,
          left: 0,
        });
        this.fabricCanvasRef.setActiveObject(img);
        img.off('moving');
        img.on('moving', (options) => {
          const newLeft = options.target.left / this.zoomRatio;
          const newTop = options.target.top / this.zoomRatio;
          this.blurSelection(newLeft, newTop, options.target);
        });

        img.off('scaling');
        img.on('scaling', (options) => {
          const newLeft = options.target.left / this.zoomRatio;
          const newTop = options.target.top / this.zoomRatio;
          this.blurSelection(newLeft, newTop, img = options.target);
        });
      });
    }
  }

  private copyCanvas() {
    const copiedCanvas = (this.fabricCanvasRef as any).toCanvasElement();
    const blurredImage = new fabric.Image(copiedCanvas);
    const filter = new fabric.Image.filters.Blur({
      blur: 0.1,
    });
    blurredImage.filters.push(filter);
    blurredImage.applyFilters();
    const blurredCanvas = new fabric.Canvas(copiedCanvas);
    this.blurredCanvas = blurredCanvas;
    blurredCanvas.add(blurredImage);
  }

  private listenToEvents(): void {
    EventBus.$off('blurConfirm');
    EventBus.$on('blurConfirm', () => {
      const objects = this.fabricCanvasRef.getObjects()
        .filter((obj: any) => obj.intersectsWithObject(this.image));

      if (objects.length > 0) {
        const mergedGroup = new fabric.Group(objects);
        this.image.set({
          stroke: 'transparent',
        });
        const newPath = new FabricGroupFormatter(mergedGroup, this.image);
        const { left, top } = newPath;
        const newData = mergedGroup.toDataURL({
          withoutTransform: true,
        });
        fabric.Image.fromURL(newData, (fabricImage: any) => {
          fabricImage.set({
            left,
            top,
          });

          this.fabricCanvasRef.remove(...objects);
          this.fabricCanvasRef.add(fabricImage);
        });
      }
    });
  }

  private onBlurClick(): void {
    this.copyCanvas();
    this.blurSelection(0, 0, null);
    this.listenToEvents();
    EventBus.$emit('drawingMode', 'edit');
  }
}
</script>

<style scoped lang="scss">

</style>
