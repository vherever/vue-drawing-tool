<template>
  <div class="s_scr__editor_main">
    <ControlsBar v-if="canvasFabricRef"
                 :canvasFabricRef="canvasFabricRef" />
    <Canvas ref="canvas" @canvas-fabric-ref="getCanvasFabricRef" />
      <!--    <img alt="Vue logo" src="./assets/logo.png">-->
      <!--    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>-->

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EventBus from '@/shared/eventBus';
import HelloWorld from './components/HelloWorld.vue';
import Canvas from './components/Canvas.vue';
import ControlsBar from './components/ControlsBar.vue';

@Component({
  components: {
    HelloWorld,
    Canvas,
    ControlsBar,
  },
})
export default class App extends Vue {
  private canvasRef!: HTMLCanvasElement;
  private canvasFabricRef: fabric.Canvas | null = null;

  mounted() {
    this.canvasRef = (this.$refs.canvas as Vue).$refs.drawing as HTMLCanvasElement;
  }

  private getCanvasFabricRef(canvas: fabric.Canvas): void {
    this.canvasFabricRef = canvas;
  }
}
</script>

<style lang="scss">
  html, body {
    padding: 0;
    margin: 0;
    height: 100%;
  }
  body {
    overflow-y: hidden;
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
  }
</style>
