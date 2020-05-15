<template>
  <div class="s_scr__crop_controls"
       v-if="cropControlsIsActive">
    <button @click="cropOkay">Crop</button>
    <button @click="cropCancel">Cancel</button>

    <input type="number" class="s_scr__canvas_width">
    <input type="number" class="s_scr__canvas_height">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EventBus from '@/shared/eventBus';
import CropTool from '@/plugins/crop-tool';

export declare const fabric: any;

@Component
export default class CropControl extends Vue {
  @Prop() private canvasFabricRef!: fabric.Canvas;
  @Prop() private cropControlsIsActive!: boolean;
  @Prop() private zoomRatio!: number;
  private cropInstance!: CropTool;

  mounted() {
    this.cropInstance = new CropTool(this.canvasFabricRef);
  }

  updated() {
    if (this.cropControlsIsActive) {
      EventBus.$emit('drawingMode', 'crop');
      this.cropInstance.init(this.canvasWidth, this.canvasHeight, this.zoomRatio);
    }
  }

  private get canvasWidth(): number {
    return this.canvasFabricRef.getWidth();
  }

  private get canvasHeight(): number {
    return this.canvasFabricRef.getHeight();
  }

  private cropOkay(): void {
    this.$emit('cropControlsIsActive', false);
    EventBus.$emit('cropEmit', true);
    setTimeout(() => {
      // TODO: Improve this?
      EventBus.$emit('drawingMode', 'freedraw');
    }, 10);
  }

  private cropCancel(): void {
    this.$emit('cropControlsIsActive', false);
    this.cropInstance.removeCropperOverlay();
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
  }
</style>
