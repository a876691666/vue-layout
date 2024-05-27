<template>
  <div
    class="layout-box-selected"
    ref="domRef"
    :style="{
      position: 'absolute',
      left: rect?.left + 'px',
      top: rect?.top + 'px',
      width: rect?.width + 'px',
      height: rect?.height + 'px',
      pointerEvents: 'none',
      transform: `translate(${-reoffset.x}px, ${-reoffset.y}px)`,
    }"
  >
    <div class="control-top" :class="{ 'control-disabled': !selectStructure?.positionLeaf }"></div>
    <div class="control-left" :class="{ 'control-disabled': !selectStructure?.positionLeaf }"></div>
    <div class="control-right" @pointerdown="handleRightStart"></div>
    <div class="control-bottom" @pointerdown="handleBottomStart"></div>
  </div>
</template>
<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue';
import { useStructure } from '../../core/useStructure';

const { selectStructure } = useStructure(inject('structureId'));

const rect = ref<DOMRect | null>(null);

const realSize = ref({ width: 0, height: 0 });
const sizeScale = ref({ x: 1, y: 1 });
const reoffset = ref({ x: 0, y: 0 });

const handleBottomStart = (e: PointerEvent) => {
  if (!selectStructure.value) return;
  updateRect();
  const startY = e.clientY;
  const startHeight = rect.value?.height;
  const handleMove = (e: PointerEvent) => {
    if (!startHeight) return;
    rect.value = { ...rect.value!, height: startHeight + e.clientY - startY };
    if (selectStructure.value) {
      if (!selectStructure.value.style) selectStructure.value.style = {};
      selectStructure.value.style.height = `${rect.value.height / sizeScale.value.y}px`;
    }
  };
  const handleEnd = () => {
    window.removeEventListener('pointermove', handleMove);
    window.removeEventListener('pointerup', handleEnd);
  };
  window.addEventListener('pointermove', handleMove);
  window.addEventListener('pointerup', handleEnd);
};

const handleRightStart = (e: PointerEvent) => {
  if (!selectStructure.value) return;
  updateRect();
  const startX = e.clientX;
  const startWidth = rect.value?.width;
  const handleMove = (e: PointerEvent) => {
    if (!startWidth) return;
    rect.value = { ...rect.value!, width: startWidth + e.clientX - startX };
    if (selectStructure.value) {
      if (!selectStructure.value.style) selectStructure.value.style = {};
      selectStructure.value.style.width = `${rect.value.width / sizeScale.value.x}px`;
    }
  };
  const handleEnd = () => {
    window.removeEventListener('pointermove', handleMove);
    window.removeEventListener('pointerup', handleEnd);
  };
  window.addEventListener('pointermove', handleMove);
  window.addEventListener('pointerup', handleEnd);
};

const domRef = ref<HTMLElement | null>(null);

const updateRect = () => {
  if (!selectStructure.value) return;
  const dom = document.querySelector(`.layout-box-dev-selected[data-uuid="${selectStructure.value.uuid}"]`);
  if (!dom) return;
  updateOffset();
  rect.value = dom.getBoundingClientRect();
  realSize.value = { width: dom.clientWidth, height: dom.clientHeight };
  sizeScale.value = { x: rect.value.width / realSize.value.width, y: rect.value.height / realSize.value.height };
};

watch(selectStructure, () => {
  updateRect();
});

const updateOffset = () => {
  if (!domRef.value) return;
  const parent = domRef.value.parentElement;
  const parentRect = parent?.getBoundingClientRect();
  reoffset.value = { x: parentRect?.left || 0, y: parentRect?.top || 0 };
};

onMounted(() => {
  updateOffset();
});
</script>
<style scoped lang="less">
.layout-box-selected {
  // 禁止用户选择
  user-select: none;
}
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
