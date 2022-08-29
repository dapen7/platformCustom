<template>
  <div :style="{ 'flex-direction': props.direction }" style="display: flex">
    <slot></slot>
  </div>
</template>
<script setup>
const props = defineProps({
  direction: String,
});
console.log(props.direction);
</script>