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
    <template v-if="showDrag">
      <div class="layout-box-dev-drag-before-sketch" :class="{ 'layout-box-dev-drag-before-sketch-selected': selectBefore }"></div>
      <div class="layout-box-dev-drag-center-sketch" :class="{ 'layout-box-dev-drag-center-sketch-selected': selectCenter }">
        <slot />
      </div>
      <div class="layout-box-dev-drag-after-sketch" :class="{ 'layout-box-dev-drag-after-sketch-selected': selectAfter }"></div>
      <div class="layout-box-dev-drag-before" @pointerenter="selectBefore = true" @pointerleave="selectBefore = false"></div>
      <div class="layout-box-dev-drag-center" @pointerenter="selectCenter = true" @pointerleave="selectCenter = false"></div>
      <div class="layout-box-dev-drag-after" @pointerenter="selectAfter = true" @pointerleave="selectAfter = false"></div>
    </template>
    <slot v-else />
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
  text-align: center;
  color: #000;
}
.layout-box-dev-drag-center {
  position: absolute;
  top: 25%;
  height: 50%;
  left: 0;
  right: 0;
  text-align: center;
  color: #000;
}
.layout-box-dev-drag-after {
  position: absolute;
  bottom: 0;
  height: 25%;
  left: 0;
  right: 0;
  text-align: center;
  color: #000;
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
.layout-box-dev-drag-center-sketch {
  position: relative;
  border: 1px dashed red;
  background: rgba(0, 0, 0, 0.1);
}
.layout-box-dev-drag-before-sketch {
  height: 20px;
  border: 1px dashed red;
  background: rgba(0, 0, 0, 0.1);
}
.layout-box-dev-drag-after-sketch {
  height: 20px;
  border: 1px dashed red;
  background: rgba(0, 0, 0, 0.1);
}

.layout-box-dev-drag-center-sketch-selected {
  background: rgba(255, 255, 255, 0.2);
}
.layout-box-dev-drag-before-sketch-selected {
  background: rgba(255, 255, 255, 0.2);
}
.layout-box-dev-drag-after-sketch-selected {
  background: rgba(255, 255, 255, 0.2);
}
</style>
