<template>
  <div class="flexCustomDiv">
    <!-- 组件 -->
    <div class="toolboxDiv">
      <draggable class="dragArea list-group" :list="config.widgetListOrigin"
        :group="{ name: 'g1', pull: 'clone', put: false, sort: false }" :clone="cloneWidget" item-key="name">
        <template #item="{ element }">
          <div class="list-group-item">
            {{  element.name  }}
          </div>
        </template>
      </draggable>

    </div>
    <!-- 布局 -->
    <div class="cententDiv">
      asd1
      <FlexNode :children="config.layout"></FlexNode>
    </div>
    <!-- 属性 -->
    <div class="propertyDiv">
      <template v-if="focusWidget">
        <div>{{  focusWidget.name  }}</div>
        <div v-for="(value, name, index) in focusWidget.property" :key="index">
          <div class="propName">{{  name  }}</div>
          <div v-if="Array.isArray(value)" class="selectArea">
            <select v-model="focusWidget.props[name]">
              <option v-for="(option, index) in value" :key="index" :value="option">
                {{  option  }}
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
import draggable from "vuedraggable";

//获取数据
let config = reactive({
  layout: [
    // {
    //   tag: "widget-div",
    //   name: "容器0",
    //   id: 1111,
    //   children: [
    //     {
    //       name: "容器1",
    //       tag: "widget-div",
    //       children: [],
    //       id: 2222,
    //     },
    //     {
    //       name: "组件1",
    //       tag: "widget-com1",
    //       id: 33333,
    //     },
    //   ],
    // },
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

let idGlobal = 1;
function cloneWidget(item) {
  let props = {};
  for (let key in item.property) {
    if (Array.isArray(item.property[key])) {
      props[key] = item.property[key][0]
    }
  }
  let newItem = {
    id: idGlobal++,
    tag: item.tag,
    name: item.name + "-" + idGlobal,
    props: props,
    children: [],
  }
  return newItem
}
</script>

<style scoped>
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
