<template>
  <draggable tag="div" class="dragArea" :list="props.children" handle=".handle"
    :style="{ 'flex-direction': props.direction }" :group="{ name: 'g1' }" item-key="id">
    <template #item="{ element }">
      <div v-if="element.tag == 'widget-div'" class="contentDiv" @click="doFocus(element)"
        :style="{ 'flex-grow': element.styles.flexgrow, 'width': element.styles.width }">
        <span class="handle">{{ element.name }}</span>
        <FlexNode :children="element.children" :direction="element.styles.direction" />
      </div>
      <div v-else class="oneWidgetDiv" @click="doFocus(element)"
        :style="{ 'flex-grow': element.styles.flexgrow, 'width': element.styles.width }">
        <span class="handle">{{ element.name }}</span>
      </div>
    </template>
  </draggable>
</template>
<script setup>
import { inject, unref } from "vue";
import draggable from "vuedraggable";

const props = defineProps({
  children: Array,
  direction: {
    type: String,
    default: "column",
  },
});
let focusWidget = inject("focusWidget")
function doFocus(element) {
  focusWidget.value = element
  console.log("focus->", unref(element))
  event.stopPropagation();
}
</script>
<style  scoped>
.dragArea {
  min-height: 50px;
  flex-grow: 1;
  display: flex;
}

.oneWidgetDiv {
  border: 1px solid blue;
  margin: 5px;
  min-height: 50px;
  min-width: 50px;
}

.contentDiv {
  border: 1px solid red;
  margin: 10px;
  min-height: 50px;
  min-width: 50px;
}

.handle {
  position: absolute;
  top: -15px;
  left: 0;
  background: black;
  color: white;
  font-size: 10px;
}
</style>
