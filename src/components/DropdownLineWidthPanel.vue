<template>
  <div class="s_scr__dd_panel">
    <div class="s__scr_dd_panel_item"
         v-for="(item) in items" :key="item.id"
         v-bind:class="item.v === selectedLineWidth ? 'active' : ''">
      <a href="javascript:;"
         @click="selectLineHeight(item.v)">
        <div class="item_line_preview"
             v-bind:style="'height:' + item.v + 'px; background-color:' + currentColor"></div>
        <div class="text">{{ item.v }}<span>px</span></div>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DropdownLineWidthPanel extends Vue {
  @Prop() private selectedLineWidth!: number;
  @Prop() private currentColor!: string;

  private items: any[] = [
    { id: 0, v: 2 },
    { id: 1, v: 4 },
    { id: 2, v: 6 },
    { id: 3, v: 8 },
    { id: 4, v: 16 },
    { id: 5, v: 20 },
  ];

  private selectLineHeight(lineWidth: number): void {
    this.$emit('currentLineWidth', lineWidth);
  }
}
</script>

<style scoped lang="scss">
  .s_scr__dd_panel {
    width: 100px;
    text-align: left;
    .s__scr_dd_panel_item {
      &.active {
        background-color: #dddddd;
      }
      a {
        display: flex;
        place-content: center space-between;
        align-items: center;
        color: #545454;
        font-size: 13px;
        .item_line_preview {
          width: 60px;
          /*height: 2px;*/
          background-color: #000000;
        }
        .text {
          margin-left: 5px;
          width: 32px;
          span {
            font-size: 11px;
            margin-left: 2px;
          }
        }
        padding: 2px 0;
      }
    }
  }
</style>
