<template>
  <div class="flexCustomDiv">
    <!-- 组件 -->
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
    <!-- 布局 -->
    <div class="cententDiv">
      <FlexNode :layout="config.layout"></FlexNode>
    </div>
    <!-- 属性 -->
    <div class="propertyDiv">
      <template v-if="focusWidget">
        <div>{{ focusWidget.name }}</div>
        <div v-for="(value, name, index) in focusWidget.property" :key="index">
          <div class="propName">{{ name }}</div>
          <div v-if="Array.isArray(value)" class="selectArea">
            <select v-model="focusWidget.props[name]">
              <option
                v-for="(option, index) in value"
                :key="index"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>
        </div>
      </template>
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
      id: 1,
      children: [
        {
          name: "容器1",
          tag: "widget-div",
          children: [],
          id: 2,
        },
        {
          name: "组件1",
          tag: "widget-com1",
          id: 3,
        },
      ],
    },
  ],
  widgetListOrigin: [
    {
      name: "容器",
      tag: "widget-div",
      property: {
        direction: ["colume", "row"],
      },
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

//provide("focusWidget");
let focusWidget = ref("");
provide("focusWidget", focusWidget);
//布局
window.widgetIndex = 0;
let dragWidget = ref("");
provide("dragWidget", dragWidget);
function onAddWidgetDragStart(item) {
  event.dataTransfer.dropEffect = "copy";
  event.dataTransfer.setData("text/html", event.target.outerHTML);
  dragWidget.value = item;
  event.stopPropagation();
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
.propertyDiv {
  width: 200px;
  padding: 10px;
  border-left: 1px solid #aaa;
}
</style>
