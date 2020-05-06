<template>
  <div class="s_scr__dd_panel">
    <div class="s__scr_dd_panel_item"
         v-for="(item) in items" :key="item.id"
         v-bind:class="item.v === selectedLineWidth ? 'active' : ''">
      <a href="javascript:;"
         @click="selectLineHeight(item.v)">{{ item.v }}</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DropdownLineWidthPanel extends Vue {
  @Prop() private selectedLineWidth;

  private items: any[] = [
    { id: 0, v: 2 },
    { id: 1, v: 4 },
    { id: 2, v: 8 },
    { id: 3, v: 16 },
    { id: 4, v: 24 },
    { id: 5, v: 32 },
  ];

  private selectLineHeight(lineWidth: number): void {
    this.$emit('currentLineWidth', lineWidth);
  }
}
</script>

<style scoped lang="scss">
  .s_scr__dd_panel {
    .s__scr_dd_panel_item {
      &.active {
        background-color: #b7b7b7;
      }
    }
  }
</style>
