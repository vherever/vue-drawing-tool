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

    <div id="drawing-mode-options" style="display: inline-block">
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

    <div class="s_scr__zoom_controls">
      <a href="javascript:;" class="zoom_in" id="s_scr__zoom_in">+</a>
      <a href="javascript:;" class="zom_out" id="s_scr__zoom_out">-</a>
      <a href="javascript:;" class="reset_zoom" id="s_scr__zoom_reset">reset</a>
      <span class="zoom_ratio_info" id="s_scr__zoom_ratio">ratio</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EventBus from '@/shared/eventBus';

@Component
export default class ControlsBar extends Vue {
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
  button {
    &.active {
      background-color: #42b983;
    }
  }
</style>
