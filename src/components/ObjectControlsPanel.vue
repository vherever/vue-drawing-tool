<template>
  <div class="s_scr__object_controls_panel"
       id="s_sir__object_controls_panel"
       v-bind:style="'top: ' + (topPosition + 10) + 'px; left: ' +
       (leftPosition - panelW / 2) + 'px;'">
    <button class="s_scr__object_remove"
            @click="removeObject"></button>
    <button class="s_scr__object_copy"
            @click="copyAndPasteObject"></button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EventBus from '@/shared/eventBus';

export declare const fabric: any;

@Component
export default class ObjectControlsPanel extends Vue {
  @Prop() private selectedObject: any;
  @Prop() private fabricCanvasRef!: fabric.Canvas;
  private readonly offsetTop: number = 100; // height of the controls panel
  private panelW: number = 0;
  private clipboard!: any;

  mounted() {
    this.panelW = this.panelWidth;
  }

  updated() {
    this.panelW = this.panelWidth;
  }

  private get panelWidth(): number {
    const panelElement: HTMLDivElement = document
      .getElementById('s_sir__object_controls_panel') as HTMLDivElement;
    return panelElement.offsetWidth;
  }

  private get topPosition(): number {
    return this.selectedObject.oCoords.mb.y + this.offsetTop;
  }

  private get leftPosition(): number {
    return this.selectedObject.oCoords.mb.x;
  }

  private removeObject(): void {
    EventBus.$emit('clearSelected', true);
  }

  private copyAndPasteObject(): void {
    this.copyObject();
    this.pasteObject();
  }

  private copyObject() {
    this.fabricCanvasRef.getActiveObject().clone((cloned: any) => {
      this.clipboard = cloned;
    });
  }

  private pasteObject() {
    this.clipboard.clone((clonedObj: any) => {
      console.log('clonedObj', clonedObj);
      this.fabricCanvasRef.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
      });
      if (clonedObj.type === 'activeSelection') {
        clonedObj.canvas = this.fabricCanvasRef;
        clonedObj.forEachObject((obj: any) => {
          this.fabricCanvasRef.add(obj);
        });
        clonedObj.setCoords();
      } else {
        this.fabricCanvasRef.add(clonedObj);
      }
      this.clipboard.top += 10;
      this.clipboard.left += 10;
      this.fabricCanvasRef.setActiveObject(clonedObj);
      this.fabricCanvasRef.requestRenderAll();
    });
  }
}
</script>

<style scoped lang="scss">
  .s_scr__object_controls_panel {
    position: absolute;
    background-color: #ffffff;
    padding: 1px 2px;
    .s_scr__object_remove {
      display: inline-block;
      background: url(../../public/assets/icons/remove.svg) 3px 2px no-repeat;
      width: 16px;
      height: 16px;
      background-size: 8px 10px;
      cursor: pointer;
      border: 1px solid #ffffff;
      outline: none;
    }
    .s_scr__object_copy {
      display: inline-block;
      background: url(../../public/assets/icons/copy.svg) 2px 1px no-repeat;
      width: 16px;
      height: 16px;
      background-size: 11px 11px;
      cursor: pointer;
      border: 1px solid #ffffff;
      outline: none;
    }
  }
</style>
