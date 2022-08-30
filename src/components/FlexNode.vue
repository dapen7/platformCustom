<template>
  <draggable tag="div" class="dragArea" :list="props.children" handle=".handle"
    :style="{ 'flex-direction': props.direction }" :group="{ name: 'g1' }" item-key="id">
    <template #item="{ element }">
      <div v-if="element.tag == 'widget-div'" class="contentDiv">
        <span class="handle">{{  element.name  }}</span>
        <FlexNode :children="element.children" />
      </div>
      <div v-else class="oneWidgetDiv">
        <span>{{  element.name  }}</span>
      </div>
    </template>
  </draggable>
</template>
<script setup>
import draggable from "vuedraggable";

const props = defineProps({
  children: Array,
  direction: {
    type: String,
    default: "column",
  },
});

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
}

.contentDiv {
  border: 1px solid red;
  flex-grow: 1;
  margin: 10px;
}

.handle {
  position: absolute;
  top: -15px;
  left: 0;
  background: black;
  color: white;
}
</style>
