<template>
  <div class="s_scr__dd_panel" v-bind:class="mode">
    <div v-for="(item) in items" :key="item.id"
         class="s__scr_dd_panel_item"
         :style="'background-color:' + item.c"
         :title="item.n"
         :data-id="item.id"
         v-bind:class="item.c === selectedColor ? 'active' : ''">
      <a href="javascript:;"
         @click="selectColor(item.c)"
      ></a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DropdownPanel extends Vue {
  @Prop() private mode!: string;
  @Prop() private items!: any[];
  @Prop() selectedColor!: string;

  private selectColor(color: string): void {
    this.$emit('currentColor', color);
  }
}
</script>

<style scoped lang="scss">
  .s_scr__dd_panel {
    padding: 5px 5px;
    background-color: #ffffff;
    position: absolute;
    border: 1px solid #b7b7b7;
    border-radius: 3px;
    &.palette {
      width: 182px;
      text-align: left;
      .s__scr_dd_panel_item {
        border-radius: 50%;
        margin: 0 1px;
        display: inline-block;
        a {
          display: block;
          width: 24px;
          height: 24px;
        }
        &.active {
          -webkit-box-shadow: inset 0px 0px 0px 2px rgba(0,0,0,1);
          -moz-box-shadow: inset 0px 0px 0px 2px rgba(0,0,0,1);
          box-shadow: inset 0px 0px 0px 2px rgba(0,0,0,1);
        }
      }
    }
  }
</style>
