<template>
  <div class="s_scr__drawing_controls">
    <button class="" ref="edit-mode"
            v-bind:class="!isDrawingMode ? 'active' : ''"
            @click="toEditMode">edit mode</button>

    <button class="btn btn-info" ref="drawing-mode"
            v-bind:class="isDrawingMode ? 'active' : ''"
            @click="toDrawingMode">drawing mode</button><br>

    <button class="btn btn-info" ref="clear-canvas"
            @click="clearCanvas">Clear all</button><br>

    <button class="btn btn-info" ref="clear-object"
            @click="clearSelected">Clear selected</button><br>

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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EventBus from '@/shared/eventBus';
import ZoomControl from '@/components/ZoomControl.vue';

@Component({
  components: {
    ZoomControl,
  },
})
export default class ControlsBar extends Vue {
  @Prop() private canvasFabricRef!: fabric.Canvas;
  private isDrawingMode: boolean = true;

  mounted() {
    console.log('___ ControlsBar', this.$refs); // todo
    this.listenToEvents();
  }

  private toDrawingMode(): void {
    this.emitCanvasMode(true);
  }

  private toEditMode(): void {
    this.emitCanvasMode(false);
  }

  private clearCanvas(): void {
    EventBus.$emit('clearCanvasUp', true);
    EventBus.$emit('zoomRatio', 1);
  }

  private clearSelected(): void {
    EventBus.$emit('clearSelected', true);
  }

  private emitCanvasMode(isDrawingMode: boolean): void {
    EventBus.$emit('isDrawingMode', isDrawingMode);
    this.isDrawingMode = isDrawingMode;
  }

  private listenToEvents(): void {
    EventBus.$on('clearCanvasDown', () => {
      this.isDrawingMode = true;
    });
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
      &.active {
        background-color: #42b983;
      }
    }
  }
</style>
