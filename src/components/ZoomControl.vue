<template>
  <div class="s_scr__zoom_controls" style="display: inline-block">
    <a href="javascript:;" class="c_zoom_in" id="s_scr__zoom_in" @click="onZoomClick('in')"></a>
    <a href="javascript:;" class="c_zom_out" id="s_scr__zoom_out" @click="onZoomClick('out')"></a>
    <a href="javascript:;" class="reset_zoom" id="s_scr__zoom_reset"
       v-show="showZoomRatio"
       @click="resetZoom()">reset</a>
    <span class="zoom_ratio_info" id="s_scr__zoom_ratio"
          v-show="showZoomRatio">Zoom: {{ currentZoomPercentage }}%</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EventBus from '@/shared/eventBus';

@Component
export default class ZoomControl extends Vue {
  @Prop() private canvasFabricRef!: fabric.Canvas;
  private readonly zoomRatios: number[] = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
  private currentZoomIndex: number = 3;
  private defaultZoomPercentage: number = 100;
  private currentZoomPercentage: number | null = null;

  mounted() {
    this.currentZoomPercentage = this.defaultZoomPercentage;
    this.listenToEvents();
  }

  private get showZoomRatio(): boolean {
    return this.currentZoomPercentage !== this.defaultZoomPercentage;
  }

  private onZoomClick(type: string): void {
    switch (type) {
      case 'in':
        if (++this.currentZoomIndex < this.zoomRatios.length) {
          this.canvasFabricRef.setZoom(this.zoomRatios[this.currentZoomIndex]);
          EventBus.$emit('zoomRatio', this.zoomRatios[this.currentZoomIndex]);
          if (this.currentZoomIndex === 3) {
            this.currentZoomPercentage = 100;
          }
        } else {
          this.currentZoomIndex = this.zoomRatios.length - 1;
        }
        break;
      case 'out':
        if (--this.currentZoomIndex >= 0) {
          this.canvasFabricRef.setZoom(this.zoomRatios[this.currentZoomIndex]);
          EventBus.$emit('zoomRatio', this.zoomRatios[this.currentZoomIndex]);
          if (this.currentZoomIndex === 3) {
            this.currentZoomPercentage = 100;
          }
        } else {
          this.currentZoomIndex = 0;
        }
        break;
      default:
        break;
    }

    this.canvasFabricRef.setZoom(this.zoomRatios[this.currentZoomIndex]);
    this.currentZoomPercentage = this.zoomRatios[this.currentZoomIndex] * 100;
  }

  private resetZoom(): void {
    this.currentZoomPercentage = this.defaultZoomPercentage;
    EventBus.$emit('zoomRatio', 1);
    this.currentZoomIndex = 3;
  }

  private listenToEvents(): void {
    EventBus.$on('clearCanvas', () => {
      this.currentZoomPercentage = this.defaultZoomPercentage;
      this.currentZoomIndex = 3;
    });
  }
}
</script>

<style scoped lang="scss">
  .s_scr__zoom_controls {
    .c_zoom_in {
      background: url(./../assets/icons/zoom-in.svg) 2px 1px no-repeat;
      width: 21px;
      height: 21px;
      background-size: 17px 17px;
      display: inline-block;
    }
    .c_zom_out {
      background: url(./../assets/icons/zoom-out.svg) 2px 1px no-repeat;
      width: 21px;
      height: 21px;
      background-size: 17px 17px;
      display: inline-block;
    }
    .reset_zoom {
      margin-left: 15px;
    }
    .zoom_ratio_info {
      margin-left: 15px;
    }
  }
</style>
