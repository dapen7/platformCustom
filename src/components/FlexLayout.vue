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
        <!-- 样式 -->
        <div v-if="focusWidget.styleConfig">
          <div>样式</div>
          <div v-for="(styleConfig, index) in styleConfigAll" :key="index">
            <template v-if="focusWidget.styleConfig.includes(styleConfig.key)">
              <div class="propName">{{  styleConfig.name  }}</div>
              <div v-if="styleConfig.select" class="selectArea">
                <select v-model="focusWidget.styles[styleConfig.key]">
                  <option v-for="(option, index) in styleConfig.select" :key="index" :value="option.id">
                    {{  option.name  }}
                  </option>
                </select>
              </div>
              <div v-else>
                <input v-model="focusWidget.styles[styleConfig.key]" />
              </div>
            </template>
          </div>
        </div>
        <!-- 属性 -->
        <div>属性</div>
        <div v-for="(property, index) in focusWidget.properties" :key="index">
          <div class="propName">{{  property.name  }}</div>
          <div v-if="property.select" class="selectArea">
            <select v-model="focusWidget.props[property.key]">
              <option v-for="(option, index) in property.select" :key="index" :value="option.id">
                {{  option.name  }}
              </option>
            </select>
          </div>
          <div v-else>
            <input v-model="focusWidget.props[property.key]" />
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

let styleConfigAll = [
  {
    name: "方向",
    key: "direction",
    select: [{ id: "row", name: "行" }, { id: "column", name: "列" }]
  },
  {
    name: "填充",
    key: "flexgrow",
    select: [{ id: 1, name: "是" }, { id: 0, name: "否" }]
  },
  {
    name: "宽度",
    key: "width",
  },
]
//获取数据
let config = reactive({
  layout: [
  ],
  widgetListOrigin: [
    {
      name: "容器",
      tag: "widget-div",
      properties: [],
      styleConfig: ["direction", "flexgrow", "width"]
    },
    {
      name: "表单",
      tag: "widget-form",
      properties: [
        {
          name: "数据源",
          key: "v-model",
        },
        {
          name: "配置",
          key: "formConfig",
          listConfig: [
            {
              name: "标签",
              key: "label",
            },
            {
              name: "key",
              key: "key",
            },
            {
              name: "类型",
              key: "type",
              select: [
                { id: "input", name: "输入框" },
                { id: "select", name: "下拉列表" },
                { id: "checkbox", name: "checkbox" },
                { id: "radio", name: "radio" },
                { id: "datepicker", name: "日期选择" },
                {
                  id: "timepicker", name: "时间选择"
                },
              ]
            }
          ],
        }
      ]
    },
    {
      name: "组件2",
      tag: "widget-com2",
    },
  ],
});
window.aaa = config;
//添加组件
let idGlobal = 1;
function cloneWidget(originItem) {
  let item = JSON.parse(JSON.stringify(originItem))

  let styles = {};
  if (item.styleConfig) {
    styleConfigAll.forEach(property => {
      if (item.styleConfig.includes(property.key)) {
        if (property.select && property.select.length > 0) {
          styles[property.key] = property.select[0].id
        } else {
          styles[property.key] = ""
        }
      }
    })
  }

  let props = {};
  if (item.properties) {
    item.properties.forEach(property => {
      if (property.select && property.select.length > 0) {
        props[property.key] = property.select[0].id
      } else {
        props[property.key] = ""
      }
    })
  }
  let newItem = {
    id: idGlobal++,
    tag: item.tag,
    name: item.name + "-" + idGlobal,
    styleConfig: item.styleConfig,
    styles: styles,
    props: props,
    properties: item.properties,
    children: [],
  }
  return newItem
}
//设置属性
let focusWidget = ref("")
provide("focusWidget", focusWidget)
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
