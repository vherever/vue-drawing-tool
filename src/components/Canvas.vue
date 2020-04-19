<template>
  <div class="s_scr__editor_page">
    <div class="s_scr__canvas_wrapper">
      <canvas class="s_scr__drawing_canvas" id="drawing" ref="drawing"
      ></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { fabric } from 'fabric';
import EventBus from '@/shared/eventBus';
import CanvasSnapGridService from '@/services/canvas-snap-grid.service';

@Component
export default class Canvas extends Vue {
  private canvas!: fabric.Canvas;
  private gridInitialized: boolean = false;
  private snapGridInstance!: CanvasSnapGridService;

  mounted() {
    this.initCanvas();
    this.setCanvasSize(800, 600);
    this.listenToEvents();
    this.snapGridInstance = new CanvasSnapGridService(this.canvas);
  }

  private initCanvas(): void {
    const canvasRef: HTMLCanvasElement = this.$refs.drawing as HTMLCanvasElement;
    this.canvas = new fabric.Canvas(canvasRef, {
      backgroundColor: '#FFFFFF',
      isDrawingMode: true,
      selection: true,
    });
    this.canvas.renderAll();
  }

  private removeGrid(): void {
    this.snapGridInstance.removeGrid();
  }

  private setCanvasSize(width: number, height: number): void {
    this.canvas.setDimensions({ width, height });
  }

  private listenToEvents(): void {
    EventBus.$on('isDrawingMode', (isDrawingMode: boolean) => {
      this.canvas.isDrawingMode = isDrawingMode;
      // this.snapToGrid();
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
      // console.log('___ e UP', e); // todo
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
  .s_scr__editor_page {
    height: 100%;
    background-color: #212224;
    .s_scr__canvas_wrapper {
      height: 100%;
      display: inline-block;
      .canvas-container {
        margin: 0 auto;
        .s_scr__drawing_canvas {
          border: 1px solid lightgray;
        }
      }
    }
  }
</style>
