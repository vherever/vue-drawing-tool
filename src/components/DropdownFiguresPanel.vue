<template>
  <div class="s_scr__dd_panel">
    <div class="s__scr_dd_panel_item"
         v-bind:class="item.v === selectedFigure ? item.v + ' active' : item.v"
         v-for="(item) in items" :key="item.id"
         v-bind:title="item.name">
      <a href="javascript:;"
         @click="selectFigure(item.v)">
        <span v-bind:style="setStyle(item)"></span>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DropdownFiguresPanel extends Vue {
  @Prop() private currentColor!: string;
  @Prop() private selectedFigure!: string;

  private items: any[] = [
    { id: 0, v: 'rect_e', name: 'Empty Rectangle' },
    { id: 1, v: 'rect_f', name: 'Filled Rectangle' },
    // { id: 2, v: 'circle_e', name: 'Empty Circle' },
    // { id: 3, v: 'circle_f', name: 'Filled Circle' },
  ];

  private setStyle(item: any): string {
    switch (item.v) {
      case 'rect_e':
        return `border: ${2}px solid ${this.currentColor}`;
      case 'rect_f':
        return `background-color: ${this.currentColor}`;
      default:
        return '';
    }
  }

  private selectFigure(figure: string): void {
    this.$emit('currentFigure', figure);
  }
}
</script>

<style scoped lang="scss">
  .s_scr__dd_panel {
    width: 35px;
    .s__scr_dd_panel_item {
      font-size: 13px;
      padding: 2px 0;
      a {
        height: 25px;
        color: #545454;
      }
      &.active {
        background-color: #dddddd;
      }
      &.rect_e {
        span {
          width: 25px;
          height: 18px;
          border: 2px solid;
          display: block;
        }
      }
      &.rect_f {
        span {
          width: 25px;
          height: 18px;
          display: block;
        }
      }
    }
  }
</style>
