<template>
  <div class="flexCustomDiv">
    <div class="toolboxDiv">
      <div
        class="oneWidget"
        v-for="(item, index) in config.widgetListOrigin"
        :key="index"
        @dragstart="onAddWidgetDragStart(item)"
        draggable="true"
      >
        {{ item.name }}
      </div>
    </div>

    <div class="cententDiv">
      <FlexNode :layout="config.layout"></FlexNode>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity";
import { onMounted, provide } from "@vue/runtime-core";
import FlexNode from "./FlexNode.vue";

//获取数据
let config = reactive({
  layout: [
    {
      tag: "widget-div",
      name: "容器0",
      widgetIndex: 1,
      children: [
        {
          name: "容器1",
          tag: "widget-div",
          children: [],
          widgetIndex: 2,
        },
        {
          name: "组件1",
          tag: "widget-com1",
          widgetIndex: 3,
        },
      ],
    },
  ],
  widgetListOrigin: [
    {
      name: "容器",
      tag: "widget-div",
    },
    {
      name: "组件1",
      tag: "widget-com1",
    },
    {
      name: "组件2",
      tag: "widget-com2",
    },
  ],
});
window.aaa = config;
window.widgetIndex = 0;
let dragWidget = ref("");
provide("dragWidget", dragWidget);
function onAddWidgetDragStart(item) {
  event.dataTransfer.dropEffect = "copy";
  event.dataTransfer.setData("text/html", event.target.outerHTML);
  dragWidget.value = item;
}
</script>

<style scoped>
* {
  user-select: none;
}
.flexCustomDiv {
  height: 100%;
  width: 100%;
  display: flex;
}
.toolboxDiv {
  width: 300px;
  flex-basis: 300px;
  background-color: white;
  border-right: 1px solid #aaa;
  box-shadow: var(--box-shadow);
  z-index: 1;
  padding: 10px;
}
.cententDiv {
  flex-grow: 1;
}

.oneWidget {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-primary);
  cursor: move;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
