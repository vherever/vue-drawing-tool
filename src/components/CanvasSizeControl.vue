<template>
  <div class="s_scr__canvas_size_wrapper">
    <button @click="changeCanvasSize">size</button>
    <div class="s_scr__dd_panel"
         v-click-outside="onClickOutside"
         v-if="panelIsActive">
      <label for="s_sir__canvas_width" class="s_scr__canvas_width">
        width:
        <input id="s_sir__canvas_width" type="number">
        <span>px</span>
      </label>
      <label for="s_sir__canvas_height" class="s_scr__canvas_height">
        height:
        <input id="s_sir__canvas_height" type="number">
        <span>px</span>
      </label>

      <label for="s_sir__proportional_check" class="s_scr__proportional_check">
        Proportional:
        <input type="checkbox" id="s_sir__proportional_check">
      </label>

      <button @click="resizeCanvas">Resize</button>
      <button @click="cancelResize">Cancel</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

const vClickOutside = require('v-click-outside');

Vue.use(vClickOutside);

@Component({
  directives: {
    clickOutside: vClickOutside.directive,
  },
})
export default class CanvasSizeControl extends Vue {
  private panelIsActive: boolean = false;

  mounted() {
    console.log('mounted');
  }

  private changeCanvasSize(): void {
    this.panelIsActive = !this.panelIsActive;
  }

  private resizeCanvas(): void {
    console.log('resizeCanvas');
    this.panelIsActive = false;
  }

  private cancelResize(): void {
    console.log('cancelResize');
    this.panelIsActive = false;
  }

  private onClickOutside(): void {
    this.panelIsActive = false;
  }
}
</script>

<style scoped lang="scss">
  .s_scr__canvas_size_wrapper {
    position: relative;
    .s_scr__dd_panel {
      width: 150px;
      text-align: left;
    }
    .s_scr__canvas_width {
      display: inline;
      input {
        width: 50px;
      }
    }
    .s_scr__canvas_height {
      display: inline;
      input {
        width: 50px;
      }
    }
    .s_scr__proportional_check {
    }
  }
</style>
