<template>
  <div class="s_scr__drawing_controls">
    <div class="s_scr_controls_inner">
      <button class="c_edit" ref="edit-mode"
              v-bind:class="drawingMode === 'edit' ? 'active' : ''"
              @click="toEditMode"></button>

      <button class="c_drawing" ref="drawing-mode"
              v-bind:class="drawingMode === 'freedraw' ? 'active' : ''"
              @click="toDrawingMode"></button>

      <button class="c_rectangle" ref="rectangle-mode"
              style="display: inline-block"
              v-bind:class="drawingMode === 'rectangle' ? 'active' : ''"
              @click="toRectangleMode"
      >rect
      </button>

      <div class="c_color_wrapper">
        <button class="c_color"
                @click="openColorPanel"
                v-bind:style="'background-color:' + currentColor"
        ></button>
        <DropdownColorPanel v-if="colorPanelIsOpened"
                       @currentColor="currentColorReceived"
                       v-click-outside="onClickOutside"
                       :selectedColor="currentColor"
                       :items="colors"
        ></DropdownColorPanel>
      </div>

      <button class="c_clear_canvas" ref="clear-canvas"
              @click="clearCanvas"></button>

      <button class="c_clear_object" ref="clear-object"
              @click="clearSelected"></button>

      <div id="drawing-mode-options" style="display: none">
        <label for="drawing-mode-selector">Mode:</label>
        <select id="drawing-mode-selector">
          <option>Pencil</option>
        </select><br>

        <label for="drawing-line-width">Line width:</label>
        <span class="info">1</span>
        <input type="range" value="1" min="0" max="150" id="drawing-line-width"><br>

        <label for="drawing-color">Line color:</label>
        <input type="color" value="#000000" id="drawing-color"><br>
      </div>

      <ZoomControl :canvasFabricRef="canvasFabricRef"/>

      <EraserControl :canvasFabricRef="canvasFabricRef" :drawingMode="drawingMode"/>

      <div class="s_scr__line_width_wrapper">
        <div class="s_scr__line_width_inner">
          <button class="c_line_width"
                  @click="openLineWidthPanel"
          >{{ currentLineWidth }}</button>
          <div>px</div>
        </div>
        <DropdownLineWidthPanel v-if="lineWidthPanelIsOpened"
                                v-click-outside="onClickOutside"
                                @currentLineWidth="currentLineWidthReceived"
                                :selectedLineWidth="currentLineWidth"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EventBus from '@/shared/eventBus';
import ZoomControl from '@/components/ZoomControl.vue';
import EraserControl from '@/components/EraserControl.vue';
import RectangleBrush from '@/plugins/rectangle-brush';
import DropdownColorPanel from '@/components/DropdownColorPanel.vue';
import DropdownLineWidthPanel from '@/components/DropdownLineWidthPanel.vue';
// import { fabric } from 'fabric';

const vClickOutside = require('v-click-outside');

Vue.use(vClickOutside);

export declare const fabric: any;

@Component({
  components: {
    ZoomControl,
    EraserControl,
    DropdownColorPanel,
    DropdownLineWidthPanel,
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
})
export default class ControlsBar extends Vue {
  @Prop() private canvasFabricRef!: fabric.Canvas;
  @Prop() private drawingMode!: string;

  private zoomRatio: number = 1;
  private rect!: any;
  private currentColor: string = '#3498db';
  private currentLineWidth: number = 4;
  private colorPanelIsOpened: boolean = false;
  private lineWidthPanelIsOpened: boolean = false;
  private colors: any[] = [
    { id: '1abc9c', c: '#1abc9c', n: 'TURQUOISE' },
    { id: '16a085', c: '#16a085', n: 'GREEN SEA' },
    { id: '2ecc71', c: '#2ecc71', n: 'EMERALD' },
    { id: '27ae60', c: '#27ae60', n: 'NEPHRITIS' },
    { id: 'f1c40f', c: '#f1c40f', n: 'SUN FLOWER' },
    { id: 'f39c12', c: '#f39c12', n: 'ORANGE' },
    { id: 'e67e22', c: '#e67e22', n: 'CARROT' },
    { id: 'd35400', c: '#d35400', n: 'PUMPKIN' },
    { id: '3498db', c: '#3498db', n: 'PETER RIVER' },
    { id: '2980b9', c: '#2980b9', n: 'BELIZE HOLE' },
    { id: 'e74c3c', c: '#e74c3c', n: 'ALIZARIN' },
    { id: 'c0392b', c: '#c0392b', n: 'POMEGRANATE' },
    { id: '9b59b6', c: '#9b59b6', n: 'AMETHYST' },
    { id: '8e44ad', c: '#8e44ad', n: 'WISTERIA' },
    { id: '34495e', c: '#34495e', n: 'WET ASPHALT' },
    { id: '2c3e50', c: '#2c3e50', n: 'MIDNIGHT BLUE' },
    { id: 'ecf0f1', c: '#ecf0f1', n: 'CLOUDS' },
    { id: 'bdc3c7', c: '#bdc3c7', n: 'SILVER' },
    { id: '95a5a6', c: '#95a5a6', n: 'CONCRETE' },
    { id: '7f8c8d', c: '#7f8c8d', n: 'ASBESTOS' },
  ];

  mounted() {
    this.toDrawingMode();
    this.listenToEvents();
  }

  private toDrawingMode(): void {
    this.emitCanvasMode('freedraw');
    this.initDefaultBrush();
    this.canvasFabricRef.freeDrawingBrush.width = this.currentLineWidth;
  }

  private toRectangleMode(): void {
    this.emitCanvasMode('rectangle');
    this.rect = new RectangleBrush(this.canvasFabricRef);
    this.rect.draw(this.currentColor, this.zoomRatio, this.currentLineWidth);
  }

  private initDefaultBrush(): void {
    // @ts-ignore
    // eslint-disable-next-line
    const pencilBrush = new fabric.PencilBrush(this.canvasFabricRef);
    pencilBrush.width = 2;
    pencilBrush.color = this.currentColor;
    this.canvasFabricRef.freeDrawingBrush = pencilBrush;
  }

  private toEditMode(): void {
    this.emitCanvasMode('edit');
  }

  private clearCanvas(): void {
    EventBus.$emit('clearCanvas', true);
    EventBus.$emit('zoomRatio', 1);
    this.emitCanvasMode('freedraw');
  }

  private clearSelected(): void {
    EventBus.$emit('clearSelected', true);
  }

  private emitCanvasMode(drawingMode: string): void {
    EventBus.$emit('drawingMode', drawingMode);
  }

  private openColorPanel(): void {
    this.colorPanelIsOpened = !this.colorPanelIsOpened;
  }

  private onClickOutside(): void {
    this.colorPanelIsOpened = false;
    this.lineWidthPanelIsOpened = false;
  }

  private listenToEvents(): void {
    EventBus.$on('zoomRatio', (zoomRatio: number) => {
      this.zoomRatio = zoomRatio;
      if (this.drawingMode === 'rectangle') {
        this.rect.draw(this.currentColor, this.zoomRatio, this.currentLineWidth);
      } else if (this.drawingMode === 'freedraw') {
        this.canvasFabricRef.freeDrawingBrush.width = this.currentLineWidth;
      }
    });
  }

  private currentColorReceived(color: string): void {
    this.currentColor = color;
    // this.$emit('currentColor', color);
    if (this.drawingMode === 'rectangle') {
      this.rect.draw(this.currentColor, this.zoomRatio, this.currentLineWidth);
    }
    this.canvasFabricRef.freeDrawingBrush.color = color;
    this.colorPanelIsOpened = false;
  }

  private openLineWidthPanel(): void {
    this.lineWidthPanelIsOpened = !this.lineWidthPanelIsOpened;
  }

  private currentLineWidthReceived(lineWidth: number): void {
    this.currentLineWidth = lineWidth;
    if (this.drawingMode === 'rectangle') {
      this.rect.draw(this.currentColor, this.zoomRatio, this.currentLineWidth);
    }
    this.canvasFabricRef.freeDrawingBrush.width = lineWidth;
    this.lineWidthPanelIsOpened = false;
  }
}
</script>

<style scoped lang="scss">
  .s_scr__drawing_controls {
    text-align: center;
    .s_scr_controls_inner {
      display: inline-block;
    }
    background-color: #b4b4b4;
    position: fixed;
    width: 100%;
    z-index: 9999;
    top: 0;
    height: 100px;
    button {
      outline: none;
      border: none;
      cursor: pointer;
      &.active {
        background-color: #42b983;
      }
    }
    .c_edit {
      display: inline-block;
      background: url(../../public/assets/icons/cursor.svg) 3px 1px no-repeat;
      width: 21px;
      height: 21px;
      background-size: 17px 17px;
    }
    .c_drawing {
      display: inline-block;
      background: url(../../public/assets/icons/edit.svg) 2px 1px no-repeat;
      width: 21px;
      height: 21px;
      background-size: 17px 17px;
    }
    .c_clear_canvas {
      background: url(../../public/assets/icons/trash.svg) 2px 1px no-repeat;
      width: 21px;
      height: 21px;
      background-size: 17px 17px;
    }
    .c_clear_object {
      background: url(../../public/assets/icons/remove.svg) 2px 1px no-repeat;
      width: 17px;
      height: 17px;
      background-size: 14px 14px;
    }
    .c_color_wrapper {
      display: inline-block;
      position: relative;
      .c_color {
        width: 24px;
        height: 24px;
      }
    }
    .s_scr__line_width_wrapper {
      display: inline-block;
      position: relative;
      .s_scr__line_width_inner {
        display: flex;
      }
    }
  }
</style>
