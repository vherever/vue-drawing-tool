<template>
  <div class="s_scr__canvas_wrapper" v-bind:class="canvasClass">
    <div v-if="drawingMode"></div>
    <canvas class="s_scr__drawing_canvas" id="drawing" ref="drawing"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { fabric } from 'fabric';
import EventBus from '@/shared/eventBus';
import CanvasSnapGridService from '@/services/canvas-snap-grid.service';
import AppService from '@/services/app-service';

@Component
export default class Canvas extends Vue {
  @Prop() private canvasFabricRef!: fabric.Canvas;
  @Prop() private drawingMode!: string;
  private canvas!: fabric.Canvas;
  private gridInitialized: boolean = false;
  private snapGridInstance!: CanvasSnapGridService;
  private appServiceInstance!: AppService;
  private canvasWidth!: number;
  private canvasHeight!: number;
  private canvasClass: string = '';

  mounted() {
    this.appServiceInstance = new AppService();
    this.initCanvas();
    this.setCanvasSize(this.canvasWidth, this.canvasHeight);
    this.listenToEvents();
    this.snapGridInstance = new CanvasSnapGridService(this.canvas);
  }

  updated() {
    this.canvas.isDrawingMode = !(this.drawingMode === 'edit' || this.drawingMode === 'rectangle');
  }

  private clearCanvas(): void {
    this.canvas.clear();
    this.canvas.backgroundColor = '#FFFFFF';
    this.canvas.isDrawingMode = true;
  }

  private initCanvas(): void {
    const canvasRef: HTMLCanvasElement = this.$refs.drawing as HTMLCanvasElement;
    this.canvas = new fabric.Canvas(canvasRef, {
      isDrawingMode: true,
      selection: false,
    });
    this.canvas.hoverCursor = 'default';
    this.canvasWidth = this.appServiceInstance.windowInnerWidth;
    this.canvasHeight = this.appServiceInstance.windowInnerHeight - 100;
    fabric.Object.prototype.set({
      transparentCorners: true,
      cornerColor: '#00FFC4',
      cornerSize: 8,
    });
    this.$emit('canvas-fabric-ref', this.canvas);
    this.clearCanvas();
  }

  private removeGrid(): void {
    this.snapGridInstance.removeGrid();
  }

  private setCanvasSize(width: number, height: number): void {
    this.canvas.setDimensions({ width, height });
  }

  private listenToEvents(): void {
    EventBus.$on('clearCanvas', () => {
      this.clearCanvas();
    });

    EventBus.$on('clearSelected', () => {
      const activeObjects = this.canvas.getActiveObjects();
      this.canvas.remove(...activeObjects);
      this.canvas.discardActiveObject();
    });

    EventBus.$on('zoomRatio', (zoomRatio: any) => {
      this.canvasClass = zoomRatio >= 1 ? '' : 'v-aligned';
      const canvasWidth: number = this.canvasWidth * zoomRatio;
      const canvasHeight: number = this.canvasHeight * zoomRatio;
      this.canvas.setZoom(zoomRatio);
      this.setCanvasSize(canvasWidth, canvasHeight);
    });

    EventBus.$on('drawingMode', (drawingMode: string) => {
      console.log('___ drawingMode123', drawingMode); // todo
      // disable selection
      this.canvas.forEachObject((object: any) => {
        object.selectable = false;
      });

      // clear selection
      this.canvas.discardActiveObject();
      this.canvas.requestRenderAll();

      if (this.canvas) {
        this.canvas.off('mouse:down');
        this.canvas.off('mouse:up');
        this.canvas.off('mouse:move');
      }

      if (drawingMode === 'edit') {
        // this.canvas.selection = true;
        this.canvas.forEachObject((object: any) => {
          object.selectable = true;
        });
      }
    });

    this.canvas.on('object:moving', (e) => {
      // console.log('___ moving', e.target); // todo
    });

    this.canvas.on('object:rotating', (e: any) => {
      // console.log('___ rotating', e.target); // todo
    });

    this.canvas.on('mouse:over', (e: any) => {
      const activeObj = this.canvas.getActiveObject();
      if (e.target && activeObj) {
        const activeObjectId: string = activeObj.matrixCache && activeObj.matrixCache.key;

        if (e.target.matrixCache && e.target.matrixCache.key) {
          if (activeObjectId !== e.target.matrixCache.key) {
            // eslint-disable-next-line
            (e.target as any)._renderControls((this.canvas as any).contextTop, {
              hasControls: false,
            });
          }
        }
      }
    });

    this.canvas.on('path:created', (e: any) => {
      // console.log('___ e path created', e); // todo
    });

    this.canvas.on('mouse:up', (e) => {
      // if using eraser tool - need to clear white path
      this.canvas.clearContext((this.canvas as any).contextTop);
    });

    this.canvas.on('mouse:move', (e) => {
      // this.canvas.renderTop();
      // console.log('___ e', e); // todo
      // this.canvas.clearContext((this.canvas as any).contextTop);
    });

    this.canvas.on('selection:cleared', (e) => {
      // console.log('___ e selection:cleared', e); // todo
    });

    this.canvas.on('mouse:down', () => {
      this.canvas.clearContext((this.canvas as any).contextTop);
    });

    this.canvas.on('mouse:out', (e) => {
      if (e.target) {
        this.canvas.clearContext((this.canvas as any).contextTop);
      }
    });
  }

  private snapToGrid(): void {
    if (!this.canvas.isDrawingMode && !this.gridInitialized) {
      const canvasElements = this.canvas.getObjects();
      this.canvas.clear();
      this.canvas.backgroundColor = '#FFFFFF';
      this.snapGridInstance.gridSnap();
      this.canvas.add(...canvasElements);
      this.gridInitialized = true;
    } else {
      this.removeGrid();
      this.gridInitialized = false;
    }
  }
}
</script>

<style scoped lang="scss">
  .s_scr__canvas_wrapper {
    background-color: #000000;
    position: relative;
    height: calc(100% - 100px);
    overflow: scroll;
    padding-top: 100px;
    .s_scr__drawing_canvas {
      /*border: 3px solid #f1c40f;*/
    }
  }
</style>
