<template>
  <div class="s_scr__editor_main">
    <ControlsBar v-if="canvasFabricRef"
                 :canvasFabricRef="canvasFabricRef"
                 :drawingMode="drawingMode" />
    <Canvas ref="canvas"
                @canvas-fabric-ref="getCanvasFabricRef"
                :drawingMode="drawingMode" />

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EventBus from '@/shared/eventBus';
import Canvas from './components/Canvas.vue';
import ControlsBar from './components/ControlsBar.vue';

@Component({
  components: {
    Canvas,
    ControlsBar,
  },
})
export default class App extends Vue {
  private canvasRef!: HTMLCanvasElement;
  private canvasFabricRef: fabric.Canvas | null = null;
  private drawingMode: string = 'rectangle';

  mounted() {
    this.canvasRef = (this.$refs.canvas as Vue).$refs.drawing as HTMLCanvasElement;
    this.listenToEvents();
  }

  private getCanvasFabricRef(canvas: fabric.Canvas): void {
    this.canvasFabricRef = canvas;
  }

  private listenToEvents(): void {
    EventBus.$on('drawingMode', (drawingMode: string) => {
      console.log('___ drawingMode', drawingMode); // todo
      this.drawingMode = drawingMode;
    });
  }
}
</script>

<style lang="scss">
  html, body {
    padding: 0;
    margin: 0;
    height: 100%;
  }
  * {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    box-sizing: border-box;
  }
  body {
    overflow-y: hidden;
  }
  a {
    text-decoration: none;
  }
  .s_scr__editor_main {
    height: 100%;
    width: 100%;
    .canvas-container {
      position: absolute !important;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: 0 auto;
      margin-top: 100px;
    }
    .v-aligned {
      .canvas-container {
        top: 100px;
        margin: auto;
      }
    }
  }
  .s_scr__dd_panel {
    background-color: #ffffff;
    position: absolute;
    border: 1px solid #b7b7b7;
    border-radius: 3px;
  }
</style>
