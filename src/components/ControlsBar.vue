<template>
  <div class="s_scr__drawing_controls">
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
    >rect</button>

    <br>
    <button class="c_clear_canvas" ref="clear-canvas"
            @click="clearCanvas"></button><br>

    <button class="c_clear_object" ref="clear-object"
            @click="clearSelected"></button><br>

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

    <ZoomControl :canvasFabricRef="canvasFabricRef" />

    <EraserControl :canvasFabricRef="canvasFabricRef" :drawingMode="drawingMode" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EventBus from '@/shared/eventBus';
import ZoomControl from '@/components/ZoomControl.vue';
import EraserControl from '@/components/EraserControl.vue';
import RectangleBrush from '@/plugins/rectangle-brush';
// import { fabric } from 'fabric';
export declare const fabric: any;

@Component({
  components: {
    ZoomControl,
    EraserControl,
  },
})
export default class ControlsBar extends Vue {
  @Prop() private canvasFabricRef!: fabric.Canvas;
  @Prop() private drawingMode!: string;

  mounted() {
    this.toDrawingMode();
  }

  private toDrawingMode(): void {
    this.emitCanvasMode('freedraw');
    this.initDefaultBrush();
  }

  private toRectangleMode(): void {
    this.emitCanvasMode('rectangle');
    const rect = new RectangleBrush(this.canvasFabricRef);
  }

  private initDefaultBrush(): void {
    // @ts-ignore
    // eslint-disable-next-line
    const pencilBrush = new fabric.PencilBrush(this.canvasFabricRef);
    pencilBrush.width = 2;
    pencilBrush.color = '#000000';
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
}
</script>

<style scoped lang="scss">
  .s_scr__drawing_controls {
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
      background: url(../../public/assets/icons/cursor.svg) 3px 1px no-repeat;
      width: 21px;
      height: 21px;
      background-size: 17px 17px;
    }
    .c_drawing {
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
  }
</style>
