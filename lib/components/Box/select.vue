<template>
  <div
    class="layout-box-selected"
    :class="{ 'layout-box-selected-drag': isDrag }"
    ref="domRef"
    v-if="selectStructure"
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
    <div v-if="selectStructure?.dragTop" class="control-top" @pointerdown="handleTopStart"></div>
    <div v-else class="control-top control-disabled"></div>

    <div v-if="selectStructure?.dragLeft" class="control-left" @pointerdown="handleLeftStart"></div>
    <div v-else class="control-left control-disabled"></div>

    <div v-if="selectStructure?.dragRight" class="control-right" @pointerdown="handleRightStart"></div>
    <div v-else class="control-right control-disabled"></div>

    <div v-if="selectStructure?.dragBottom" class="control-bottom" @pointerdown="handleBottomStart"></div>
    <div v-else class="control-bottom control-disabled"></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch, nextTick, onUnmounted, computed } from 'vue';
import { useStructure } from '../../core/useStructure';

const { selectStructure, getStyleRef, event, isDrag } = useStructure();

const styleRef = computed(() => getStyleRef(selectStructure.value?.uuid)?.value);
watch(selectStructure, () => nextTick(() => updateRect()));
watch(styleRef, () => updateRect(), { deep: true });

const rect = ref<DOMRect | null>(null);

const realSize = ref({ width: 0, height: 0, x: 0, y: 0 });
const sizeScale = ref({ x: 1, y: 1 });
const reoffset = ref({ x: 0, y: 0 });

const handleLeftStart = (e: PointerEvent) => {
  if (!selectStructure.value) return;
  updateRect();
  const startX = e.clientX;
  const startWidth = rect.value?.width || 0;
  const startLeft = parseFloat(styleRef.value?.left || '0');
  const handleMove = (e: PointerEvent) => {
    if (!selectStructure.value || !styleRef.value) return;
    const moveLength = startWidth - (e.clientX - startX);
    styleRef.value.width = `${moveLength / sizeScale.value.x}px`;
    styleRef.value.left = `${startLeft + (e.clientX - startX) / sizeScale.value.x}px`;
  };
  const handleEnd = () => {
    window.removeEventListener('pointermove', handleMove);
    window.removeEventListener('pointerup', handleEnd);
  };
  window.addEventListener('pointermove', handleMove);
  window.addEventListener('pointerup', handleEnd);
};

const handleTopStart = (e: PointerEvent) => {
  if (!selectStructure.value) return;
  updateRect();
  const startY = e.clientY;
  const startHeight = rect.value?.height || 0;
  const startTop = parseFloat(styleRef.value?.top || '0');
  const handleMove = (e: PointerEvent) => {
    if (!selectStructure.value || !styleRef.value) return;
    const moveLength = startHeight - (e.clientY - startY);
    styleRef.value.height = `${moveLength / sizeScale.value.y}px`;
    styleRef.value.top = `${startTop + (e.clientY - startY) / sizeScale.value.y}px`;
  };
  const handleEnd = () => {
    window.removeEventListener('pointermove', handleMove);
    window.removeEventListener('pointerup', handleEnd);
  };
  window.addEventListener('pointermove', handleMove);
  window.addEventListener('pointerup', handleEnd);
};

const handleBottomStart = (e: PointerEvent) => {
  if (!selectStructure.value) return;
  updateRect();
  const startY = e.clientY;
  const startHeight = rect.value?.height || 0;
  const handleMove = (e: PointerEvent) => {
    if (!selectStructure.value || !styleRef.value) return;
    const moveLength = startHeight + e.clientY - startY;
    styleRef.value.height = `${moveLength / sizeScale.value.y}px`;
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
  const startWidth = rect.value?.width || 0;
  const handleMove = (e: PointerEvent) => {
    if (!selectStructure.value || !styleRef.value) return;
    const moveLength = startWidth + e.clientX - startX;
    styleRef.value.width = `${moveLength / sizeScale.value.x}px`;
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
  realSize.value = { width: dom.clientWidth, height: dom.clientHeight, x: dom.clientLeft, y: dom.clientTop };
  sizeScale.value = { x: rect.value.width / realSize.value.width, y: rect.value.height / realSize.value.height };
};

const updateOffset = () => {
  if (!domRef.value) return;
  const parent = domRef.value.parentElement;
  const parentRect = parent?.getBoundingClientRect();
  reoffset.value = { x: parentRect?.left || 0, y: parentRect?.top || 0 };
};

onMounted(() => {
  updateOffset();

  // 检测所有父级的滚动事件
  let parent = domRef.value?.parentElement;
  while (parent) {
    parent.addEventListener('scroll', updateOffset);
    parent = parent.parentElement;
  }

  window.addEventListener('resize', updateRect);

  event.on('updateSelectRect', updateRect);
});

onUnmounted(() => {
  let parent = domRef.value?.parentElement;
  while (parent) {
    parent.removeEventListener('scroll', updateOffset);
    parent = parent.parentElement;
  }

  window.removeEventListener('resize', updateRect);

  event.off('updateSelectRect', updateRect);
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

.control-move {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  pointer-events: all;
  cursor: move;

  background: rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }
}

.control-disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

.layout-box-selected-drag {
  .control-top {
    pointer-events: none;
  }
  .control-left {
    pointer-events: none;
  }
  .control-right {
    pointer-events: none;
  }
  .control-bottom {
    pointer-events: none;
  }
  .control-move {
    pointer-events: none;
  }
}
</style>
