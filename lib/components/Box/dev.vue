<template>
  <div
    :="$props.props"
    class="layout-box layout-box-dev"
    :class="{
      'layout-box-dev-drag': showDrag,
      'layout-box-dev-selected': selectStructure?.uuid === $props.props['data-uuid'],
      'layout-box-dev-hover': hoverStructure?.uuid === $props.props['data-uuid'],
    }"
    @pointerenter="handleHoverStructure"
    @pointerleave="hoverStructure = undefined"
    @click.stop="handleSelectStructure"
    v-if="dev"
  >
    <slot />
    <template v-if="showDrag">
      <div
        class="layout-box-dev-drag-before"
        :class="{ 'layout-box-dev-drag-before-selected': selectBefore }"
        @pointerenter="selectBefore = true"
        @pointerleave="selectBefore = false"
      ></div>
      <div
        class="layout-box-dev-drag-center"
        :class="{ 'layout-box-dev-drag-center-selected': selectCenter }"
        @pointerenter="selectCenter = true"
        @pointerleave="selectCenter = false"
      ></div>
      <div
        class="layout-box-dev-drag-after"
        :class="{ 'layout-box-dev-drag-after-selected': selectAfter }"
        @pointerenter="selectAfter = true"
        @pointerleave="selectAfter = false"
      ></div>
    </template>
  </div>
  <div :="props" class="layout-box" v-else>
    <slot />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStructure } from '../../core/useStructure';
import { StructureItem } from '../../types';

const props = withDefaults(defineProps<{ dev?: boolean; props: any; structure?: StructureItem }>(), { dev: false });

const { handleSelectStructure, handleHoverStructure, selectStructure, hoverStructure, isDrag } = useStructure();

const showDrag = computed(() => isDrag.value && props.structure?.showDrag);

const selectBefore = ref(false);
const selectAfter = ref(false);
const selectCenter = ref(false);
</script>
<style scoped>
.layout-box {
  position: relative;
}
.layout-box-dev-drag-before {
  position: absolute;
  top: 0;
  height: 25%;
  left: 0;
  right: 0;
  background: rgba(150, 0, 0, 0.05);
}
.layout-box-dev-drag-center {
  position: absolute;
  top: 25%;
  height: 50%;
  left: 0;
  right: 0;
  background: rgba(0, 150, 0, 0.05);
}
.layout-box-dev-drag-after {
  position: absolute;
  bottom: 0;
  height: 25%;
  left: 0;
  right: 0;
  background: rgba(0, 0, 150, 0.05);
}
.layout-box-dev-drag::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 3px dashed #000;
  pointer-events: none;
}

.layout-box-dev-drag-center-selected {
  background: rgba(255, 255, 255, 0.4);
}
.layout-box-dev-drag-before-selected {
  background: rgba(255, 255, 255, 0.4);
}
.layout-box-dev-drag-after-selected {
  background: rgba(255, 255, 255, 0.4);
}
</style>
