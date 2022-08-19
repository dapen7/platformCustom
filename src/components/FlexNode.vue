<template>
  <template v-for="(item, index) in props.layout" :key="index">
    <div
      v-if="item.tag == 'widget-div'"
      class="flexContentDiv"
      @dragover="dragover"
      @drop="drop(item)"
      @dragenter="dragenter(item)"
      @dragleave="dragleave(item)"
    >
      <FlexNode :layout="item.children"></FlexNode>
    </div>
    <div v-else class="oneWidgetDiv" @dragleave="dragleave">
      {{ item.name }}
    </div>
  </template>
</template>
<script setup>
import { inject, watch } from "@vue/runtime-core";

const props = defineProps({
  layout: Array,
});
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
  console.log("enter " + item.name);
  if (!event.target.contains(window.blankDiv)) {
    console.log("dragenter add");
    if (item.name == "容器1") {
      debugger;
    }
    event.target.append(window.blankDiv);
  }
  event.preventDefault();
  event.stopPropagation();
}
function dragleave(item) {
  // console.log("event.offsetX", event.offsetX);
  // console.log("event.target.offsetLeft", event.target.offsetLeft);
  console.log("leave " + item.name);
  if (
    event.offsetX <= event.target.offsetLeft ||
    event.offsetY <= event.target.offsetTop
  ) {
    event.target.before(window.blankDiv);
  } else {
    event.target.after(window.blankDiv);
  }
  event.preventDefault();
  event.stopPropagation();
}
function drop(item) {
  // var data = e.dataTransfer.getData("text/plain");
  if (!item.children) {
    item.children = [];
  }
  let newNode = {
    tag: dragWidget.value.tag,
    name: dragWidget.value.name + "_" + window.widgetIndex++,
  };
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
  padding: 5px;
  min-height: 50px;
  min-width: 50px;
  display: flex;
  gap: 10px;
}
.oneWidgetDiv {
  border: 1px solid blue;
  margin: 1px;
}
.active {
  background: red;
}
</style>
