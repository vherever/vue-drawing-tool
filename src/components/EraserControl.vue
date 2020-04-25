<template>
  <a href="javascript:;" @click="onEraserClick">eraser</a>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { fabric } from 'fabric';
import EraserBrush from '@/plugins/eraser-plugin';
import EventBus from '@/shared/eventBus';

@Component
export default class EraserControl extends Vue {
  @Prop() private canvasFabricRef!: fabric.Canvas;

  private onEraserClick(): void {
    EventBus.$emit('isDrawingMode', false);
    const canvas = this.canvasFabricRef;
    canvas.isDrawingMode = true;
    const eraserBrush = new EraserBrush(canvas);
    eraserBrush.width = 10;
    eraserBrush.color = '#ffffff';
    canvas.freeDrawingBrush = eraserBrush;
  }
}
</script>
