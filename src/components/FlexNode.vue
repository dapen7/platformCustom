<template>
  <template v-for="(item, index) in props.layout" :key="index">
    <ContentDiv
      v-if="item.tag == 'widget-div'"
      class="flexContentDiv"
      @dragover="dragover"
      @drop="drop(item)"
      @dragenter="dragenter(item)"
      @dragleave="dragleave(item)"
      @dragstart="dragstart(item)"
      @dragend="dragend(item)"
      draggable="true"
      :data-name="item.name"
      @click.stop.prevent="doFocusWidget(item)"
      v-bind="item.props"
    >
      <FlexNode :layout="item.children"></FlexNode>
    </ContentDiv>
    <div
      v-else
      class="oneWidgetDiv"
      @dragleave="dragleave(item)"
      @dragstart="dragstart(item)"
      @dragend="dragend(item)"
      draggable="true"
      @click.stop.prevent="doFocusWidget(item)"
    >
      {{ item.name }}
    </div>
  </template>
</template>
<script setup>
import { inject, reactive, watch } from "@vue/runtime-core";
import ContentDiv from "./widgets/ContentDiv.vue";

const props = defineProps({
  layout: Array,
});
//
let focusWidget = inject("focusWidget");
function doFocusWidget(item) {
  focusWidget.value = item;
}
//拖动相关
if (!window.blankDiv) {
  window.blankDiv = document.createElement("DIV");
  window.blankDiv.classList.add("blankDiv");
}

let dragWidget = inject("dragWidget");
function dragover(ev) {
  ev.dataTransfer.dropEffect = "move";
  ev.preventDefault();
  ev.stopPropagation();
}
function dragenter(item) {
  if (event.target == event.currentTarget) {
    // console.log("enter " + item.name);
    window.containDiv = event.target;
    if (!event.target.contains(window.blankDiv)) {
      event.target.append(window.blankDiv);
    }
  }

  event.preventDefault();
  event.stopPropagation();
}
function dragleave(item) {
  if (
    window.containDiv == event.target ||
    event.target.parentElement == window.containDiv
  ) {
    // console.log("leave " + item.name);
    if (
      event.offsetX <= event.target.offsetLeft ||
      event.offsetY <= event.target.offsetTop
    ) {
      event.target.before(window.blankDiv);
    } else {
      event.target.after(window.blankDiv);
    }
  }

  event.preventDefault();
  event.stopPropagation();
}
function dragstart(item) {
  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.setData("text/html", event.target.outerHTML);
  dragWidget.value = item;
  event.stopPropagation();
}
function dragend(item) {
  props.layout.splice(props.layout.indexOf(dragWidget.value), 1);
  event.stopPropagation();
}
function drop(item) {
  if (!item.children) {
    item.children = [];
  }
  let newNode = {};
  if (dragWidget.value.id) {
    newNode = Object.assign({}, dragWidget.value);
  } else {
    newNode = Object.assign({}, dragWidget.value, {
      name: dragWidget.value.name + "_" + window.widgetIndex++,
    });
  }
  if (!newNode.props) {
    let props = {};
    for (const key in newNode.property) {
      let isSelect = Array.isArray(newNode.property[key]);
      props[key] = isSelect ? newNode.property[key][0] : "";
    }
    newNode.props = reactive(props);
    console.log(newNode.props);
  }
  if (item.children.length == 0) {
    item.children.push(newNode);
  } else {
    let index = Array.from(window.blankDiv.parentElement.children).indexOf(
      window.blankDiv
    );
    if (index != -1) {
      item.children.splice(index, 0, newNode);
    }
  }
  window.blankDiv.remove();
  event.preventDefault();
  event.stopPropagation();
}
</script>
<style  scoped>
* {
  user-select: none;
}
.flexContentDiv {
  border: 1px solid red;
  padding: 15px;
  min-height: 50px;
  min-width: 50px;
  gap: 10px;
  background: white;
  cursor: move;
}
.flexContentDiv::before {
  content: attr(data-name);
  content: attr(data-name);
  position: absolute;
  left: 0;
  top: 0;
  color: #aaa;
  font-size: 12px;
}
.oneWidgetDiv {
  border: 1px solid blue;
  margin: 1px;
}
.active {
  background: red;
}
</style>
