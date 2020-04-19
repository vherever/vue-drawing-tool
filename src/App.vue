<template>
  <div id="app">
<!--    <img alt="Vue logo" src="./assets/logo.png">-->
<!--    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>-->
    <ControlsBar />
    <Canvas ref="canvas" />
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
  canvasRef!: HTMLCanvasElement;

  mounted() {
    this.canvasRef = (this.$refs.canvas as Vue).$refs.drawing as HTMLCanvasElement;
    EventBus.$emit('DATA', 'emitted_data');
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
