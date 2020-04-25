<template>
  <a href="javascript:;"
     class="c_eraser"
     v-if="isEraserActive"
     v-bind:class="drawingMode === 'eraser' ? 'active' : ''"
     @click="onEraserClick"></a>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { fabric } from 'fabric';
import EraserBrush from '@/plugins/eraser-plugin';
import EventBus from '@/shared/eventBus';

@Component
export default class EraserControl extends Vue {
  @Prop() private canvasFabricRef!: fabric.Canvas;
  @Prop() private drawingMode!: string;
  private isEraserActive: boolean = true;

  mounted() {
    this.listenToEvents();
  }

  private onEraserClick(): void {
    EventBus.$emit('drawingMode', 'eraser');
    const canvas = this.canvasFabricRef;
    canvas.isDrawingMode = true;
    const eraserBrush = new EraserBrush(canvas);
    eraserBrush.width = 25;
    eraserBrush.color = '#ffffff';
    canvas.freeDrawingBrush = eraserBrush;
  }

  private listenToEvents(): void {
    EventBus.$on('zoomRatio', (zoomRatio: number) => {
      this.isEraserActive = zoomRatio === 1;
      if (zoomRatio !== 1) {
        if (this.drawingMode === 'eraser') {
          EventBus.$emit('drawingMode', 'edit');
        }
      }
    });
  }
}
</script>

<style scoped lang="scss">
  .c_eraser {
    background: url(./../assets/icons/eraser.svg) 2px 1px no-repeat;
    display: inline-block;
    width: 21px;
    height: 21px;
    background-size: 17px 17px;
    &.active {
      background-color: #42b983;
    }
  }
</style>
