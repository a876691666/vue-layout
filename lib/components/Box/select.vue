<template>
  <div
    class="layout-box-selected"
    :style="{
      position: 'fixed',
      left: rect?.left + 'px',
      top: rect?.top + 'px',
      width: rect?.width + 'px',
      height: rect?.height + 'px',
      pointerEvents: 'none',
    }"
  >
    <div class="control-top" :class="{ 'control-disabled': selectStructure?.type !== 'position-leaf' }"></div>
    <div class="control-left" :class="{ 'control-disabled': selectStructure?.type !== 'position-leaf' }"></div>
    <div class="control-right"></div>
    <div class="control-bottom" @pointerdown="handleBottomStart"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useStructure } from '../../core/useStructure';

const { selectStructure } = useStructure();

const rect = ref<DOMRect | null>(null);

const handleBottomStart = (e: PointerEvent) => {
  if (!selectStructure.value) return;
  const startY = e.clientY;
  const startHeight = rect.value?.height;
  const handleMove = (e: PointerEvent) => {
    if (!startHeight) return;
    rect.value = {
      ...rect.value!,
      height: startHeight + e.clientY - startY,
    };
    if (selectStructure.value) {
      if (!selectStructure.value.style) selectStructure.value.style = {};
      selectStructure.value.style.height = rect.value.height + 'px';
    }
  };
  const handleEnd = () => {
    window.removeEventListener('pointermove', handleMove);
    window.removeEventListener('pointerup', handleEnd);
  };
  window.addEventListener('pointermove', handleMove);
  window.addEventListener('pointerup', handleEnd);
};

watch(selectStructure, (value) => {
  if (!value) return;
  const dom = document.querySelector(`.layout-box-dev-selected[data-uuid="${value.uuid}"]`);
  if (!dom) return;
  rect.value = dom.getBoundingClientRect();
});
</script>
<style scoped lang="less">
.control-bottom {
  position: absolute;
  bottom: -2.5px;
  left: 0;
  width: 100%;
  height: 5px;
  padding: 2px 0;
  pointer-events: all;
  cursor: ns-resize;

  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background-color: red;
  }
}

.control-left {
  position: absolute;
  top: 0;
  left: -2.5px;
  width: 5px;
  height: 100%;
  padding: 0 2px;
  pointer-events: all;
  cursor: ew-resize;

  &::before {
    content: '';
    display: block;
    width: 1px;
    height: 100%;
    background-color: red;
  }
}

.control-right {
  position: absolute;
  top: 0;
  right: -2.5px;
  width: 5px;
  height: 100%;
  padding: 0 2px;
  pointer-events: all;
  cursor: ew-resize;

  &::before {
    content: '';
    display: block;
    width: 1px;
    height: 100%;
    background-color: red;
  }
}

.control-top {
  position: absolute;
  top: -2.5px;
  left: 0;
  width: 100%;
  height: 5px;
  padding: 2px 0;
  pointer-events: all;
  cursor: ns-resize;

  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background-color: red;
  }
}
.control-disabled {
  opacity: 0.8;
  cursor: not-allowed;
}
</style>
