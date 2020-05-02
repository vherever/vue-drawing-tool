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
import 'fabric-customise-controls';
import EventBus from '@/shared/eventBus';
import CanvasSnapGridService from '@/services/canvas-snap-grid.service';
import AppService from '@/services/app-service';
import ObjectControlsHelper from '@/plugins/object-controls-helper';

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
  private objectControlsHelper: ObjectControlsHelper;

  constructor() {
    super();
    this.objectControlsHelper = new ObjectControlsHelper();
  }

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
      borderColor: 'lightgrey',
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
        let isMoving: boolean;

        this.canvas.off('mouse:down');
        this.canvas.off('mouse:up');
        this.canvas.off('mouse:move');
        this.canvas.off('object:selected');
        this.canvas.off('selection:updated');

        this.canvas.on('object:rotating', (e: any) => {
          // console.log('___ rotating', e.target); // todo
        });

        /*eslint-disable */
        this.canvas.on('path:created', (e: any) => {
          // console.log('___ e path created', e); // todo
          e.path.id = this.objectControlsHelper.generateGuid();
        });

        this.canvas.on('mouse:up', (e) => {
          // if using eraser tool - need to clear white path
          this.canvas.clearContext((this.canvas as any).contextTop);
        });

        this.canvas.on('mouse:move', (e: any) => {
          // this.canvas.renderTop();
          // console.log('___ e', e); // todo
          // this.canvas.clearContext((this.canvas as any).contextTop);
          if (isMoving) {
            const activeObj: any = this.canvas.getActiveObject();
            // console.log('___ activeObj', activeObj); // todo
            // console.log('___ aObj', activeObj.left, activeObj.top); // todo
            const width = e.target.width * e.target.scaleX;
            const height = e.target.height * e.target.scaleY;
            const angle = e.target.angle * Math.PI / 180;
            const aCoords = activeObj.aCoords;
            this.updateObjectControlsPanelPosition(activeObj.left, activeObj.top, width, angle);
          }
        });

        this.canvas.on('mouse:down', () => {
          this.canvas.clearContext((this.canvas as any).contextTop);
        });

        this.canvas.on('mouse:out', (e) => {
          if (e.target) {
            this.canvas.clearContext((this.canvas as any).contextTop);
          }
        });

        this.canvas.on('object:moved', (e) => {
          // console.log('___ e vvv', e); // todo
          isMoving = false;
        });

        this.canvas.on('object:scaling', (e: any) => {
          const activeObj: any = this.canvas.getActiveObject();
          const width = e.target.width * e.target.scaleX;
          const height = e.target.height * e.target.scaleY;
          const angle = e.target.angle * Math.PI / 180;
          const aCoords = activeObj.aCoords;
          this.updateObjectControlsPanelPosition(activeObj.left, activeObj.top, width, angle);
        });

        this.canvas.on('object:rotating', (e: any) => {
          const activeObj: any = this.canvas.getActiveObject();
          const width = e.target.width * e.target.scaleX;
          const angle = e.target.angle * Math.PI / 180;
          this.updateObjectControlsPanelPosition(activeObj.left, activeObj.top, width, angle);
        });

        this.canvas.on('object:moving', (e) => {
          isMoving = true;
        })

        this.canvas.on('selection:cleared', (e) => {
          console.log('___ e cleared', e); // todo
          this.removeObjectControlsPanel();
        });

        this.canvas.on('selection:updated', (e: any) => {
          console.log('___ selection:updated', e); // todo
          this.removeObjectControlsPanel();
          this.generateObjectControlsPanel(e);
        });

        this.canvas.on('object:selected', (e: any) => {
          console.log('___ e selected', e); // todo
          this.generateObjectControlsPanel(e)
        });
      }
      if (drawingMode === 'edit') {
        this.canvas.selection = true;
        this.canvas.forEachObject((object: any) => {
          object.selectable = true;
          // object.setControlsVisibility({
          //   mt: false,
          //   mb: false,
          //   ml: false,
          //   mr: false,
          //   tr: false,
          //   tl: false,
          //   br: false,
          //   bl: false,
          //   mtr: false,
          // });
          object.customiseCornerIcons({
            settings: {
              borderColor: '#0094dd',
              cornerSize: 25,
              cornerShape: 'rect',
              cornerBackgroundColor: 'transparent',
              transparentCorners: false,
            },
            mtr: {
              icon: 'data:image/svg+xml;base64,PHN2ZyBpZD0iQ2FwYV8xIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0ODguNDcxIDQ4OC40NzEiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNDg4LjQ3MSA0ODguNDcxIiB3aWR0aD0iNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0zMDUuMjkzIDc2LjMyNC05MS41ODgtNzYuMzI0djYzLjQ5NmMtMTAzLjM5MSAxNC44OTItMTgzLjE3NiAxMDMuODIxLTE4My4xNzYgMjExLjI2OSAwIDExNy44MzkgOTUuODY3IDIxMy43MDYgMjEzLjcwNiAyMTMuNzA2IDEyLjI2OCAwIDI0LjU5Ni0xLjA1OCAzNi42MTEtMy4xM2wtNS4xODgtMzAuMDgyYy0xMC4zMTYgMS43NzQtMjAuODg1IDIuNjgzLTMxLjQyNCAyLjY4My0xMDEuMDA5IDAtMTgzLjE3Ni04Mi4xNjctMTgzLjE3Ni0xODMuMTc2IDAtOTAuNTg3IDY2LjE1My0xNjUuODE2IDE1Mi42NDctMTgwLjQxOXY1OC4zMDFjMC0uMDAxIDkxLjU4OC03Ni4zMjQgOTEuNTg4LTc2LjMyNHoiLz48cGF0aCBkPSJtNDA5LjQ2MiAxOTUuNTc5IDI3LjUxOC0xMy4yMDhjLTE0LjE5MS0yOS41Ni0zNS40MDQtNTUuODg2LTYxLjMxMi03Ni4xMTVsLTE4Ljc4MyAyNC4wNmMyMi4yMjYgMTcuMzY3IDQwLjM5OCAzOS45MzYgNTIuNTc3IDY1LjI2M3oiLz48cGF0aCBkPSJtNDU1LjkgMjQ1LjEtMzAuMjMxIDQuMjA0YzEuMTQ4IDguMzE4IDEuNzQ0IDE2LjgxNSAxLjc0NCAyNS40NjEgMCAxOS44NTYtMy4xNDUgMzkuMzY5LTkuMzYyIDU3Ljk4OGwyOC45NDkgOS42NmM3LjI2LTIxLjczNCAxMC45NDItNDQuNDk3IDEwLjk0Mi02Ny42NDggMC05Ljk1OC0uNjg2LTE5Ljk0Ni0yLjA0Mi0yOS42NjV6Ii8+PHBhdGggZD0ibTMyOC44MDEgNDM3LjMxIDE0LjEwMiAyNy4wNzFjMjkuMDgzLTE1LjE2IDU0LjY5My0zNy4yMDggNzQuMDU4LTYzLjc0MmwtMjQuNjU2LTE4LjAwOGMtMTYuNjIyIDIyLjc3OC0zOC41OCA0MS42OC02My41MDQgNTQuNjc5eiIvPjwvc3ZnPg==',
            },
          });
        });

        this.canvas.on('mouse:over', (e: any) => {
          // console.log('___ e over', e); // todo
          const activeObj = this.canvas.getActiveObject();
          if (e.target) {
            const activeObjectId: string = activeObj && activeObj.matrixCache
              && activeObj.matrixCache.key;
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
      }
    });
  }

  private updateObjectControlsPanelPosition(left: number, top: number, width: number, angle: number): void {
    const canvasWrapper: any = document
      .getElementsByClassName('s_scr__canvas_wrapper')[0];
    const objectControlsPanel: any = canvasWrapper
      .getElementsByClassName('s_scr__object_controls_panel');
    const btnTop: number = top + 50;
    const btnLeft: number = left + width / 2 - 12;
    objectControlsPanel[0].setAttribute('style', `
      top: ${btnTop}px;
      left: ${btnLeft}px;
      position: absolute;
      cursor: pointer;
      width: 16px;
      height: 16px;
      background-color: lightblue;
    `);
    this.canvas.clearContext((this.canvas as any).contextTop);
  }

  private generateObjectControlsPanel(e: any): void {
    if (e.target) {
      const width = e.target.width * e.target.scaleX;
      const height = e.target.height * e.target.scaleY;
      const btnTop: number = e.target.aCoords.tr.y + 50;
      const btnLeft: number = e.target.aCoords.tr.x - width / 2 - 12;
      const objectControls: HTMLDivElement = document.createElement('div');
      objectControls.setAttribute('class', 's_scr__object_controls_panel');
      objectControls.setAttribute('id', `s_scr__${e.target.id}`);
      objectControls.setAttribute('style', `
              top: ${btnTop}px;
              left: ${btnLeft}px;
              position: absolute;
              cursor: pointer;
              width: 16px;
              height: 16px;
              background-color: lightblue;
            `);
      const canvasWrapper = document
        .getElementsByClassName('s_scr__canvas_wrapper')[0];
      if (canvasWrapper) {
        canvasWrapper.appendChild(objectControls);
      }
    }
  }

  private removeObjectControlsPanel(): void {
    const canvasWrapper: any = document
      .getElementsByClassName('s_scr__canvas_wrapper')[0];
    const objectControlsPanel: any = canvasWrapper
      .getElementsByClassName('s_scr__object_controls_panel');
    if (objectControlsPanel.length) {
      objectControlsPanel[0].remove();
    }
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
