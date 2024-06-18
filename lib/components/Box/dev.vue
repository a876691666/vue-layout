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
    @pointerdown.stop.passive="handleStartSelectStructure"
    draggable="false"
    v-if="dev"
  >
    <slot />
    <slot name="_tools" :structure="structure" v-if="selectStructure && selectStructure === structure" />
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
import { computed, ref, watch } from 'vue';
import { useStructure } from '../../core/useStructure';
import { StructureItem } from '../../types';

const props = withDefaults(defineProps<{ dev?: boolean; props: any; structure?: StructureItem }>(), { dev: false });

const { handleSelectStructure, handleHoverStructure, selectStructure, hoverStructure, isDrag, getStyleRef } = useStructure();

const showDrag = computed(() => isDrag.value && props.structure?.showDrag);

const selectBefore = ref(false);
const selectAfter = ref(false);
const selectCenter = ref(false);

const isMove = ref(false);
const isDown = ref(false);

watch(isDown, (d) => {
  if (!d) isMove.value = false;
});

const pointer = ref({ x: 0, y: 0 });
const startPointer = ref({ x: 0, y: 0 });
const moveScale = ref({ x: 1, y: 1 });

const handleMoveSelectStructure = (event: MouseEvent) => {
  if (!isDown.value) return;
  const currnetPointer = { x: event.clientX, y: event.clientY };
  const distance = Math.sqrt(Math.pow(currnetPointer.x - startPointer.value.x, 2) + Math.pow(currnetPointer.y - startPointer.value.y, 2));
  if (Math.abs(distance) > 5) {
    isMove.value = true;
  }

  const diffX = currnetPointer.x - pointer.value.x;
  const diffY = currnetPointer.y - pointer.value.y;

  pointer.value = { x: currnetPointer.x, y: currnetPointer.y };
  if (isMove.value) {
    if (selectStructure.value?.positionLeaf) {
      const styleRef = getStyleRef(selectStructure.value?.uuid);

      if (!styleRef?.value) return;
      styleRef.value.left = `${parseFloat(styleRef.value.left || '0') + diffX * moveScale.value.x}px`;
      styleRef.value.top = `${parseFloat(styleRef.value.top || '0') + diffY * moveScale.value.y}px`;
    }
  }
};

const handleStartSelectStructure = (e: MouseEvent) => {
  startPointer.value = { x: e.clientX, y: e.clientY };
  pointer.value = { x: e.clientX, y: e.clientY };
  e.stopPropagation();

  let flag = false;
  if (
    !selectStructure.value ||
    (selectStructure.value !== hoverStructure.value && hoverStructure.value?.parentUuid !== selectStructure.value?.uuid)
  ) {
    handleSelectStructure(e);
    flag = true;
  }

  if (selectStructure.value) {
    const target = document.querySelector(`[data-uuid="${selectStructure.value.uuid}"]`) as HTMLElement;

    if (target) {
      const bbox = target!.getBoundingClientRect();
      moveScale.value = { x: target.clientWidth / bbox.width, y: target?.clientHeight / bbox.height };
    }
  }

  isDown.value = true;

  const handleEndSelectStructure = (event: MouseEvent) => {
    if (!isMove.value && !flag) {
      handleSelectStructure(event);
    }
    isDown.value = false;

    window.removeEventListener('pointermove', handleMoveSelectStructure);
    window.removeEventListener('pointerup', handleEndSelectStructure);
  };
  window.addEventListener('pointermove', handleMoveSelectStructure);
  window.addEventListener('pointerup', handleEndSelectStructure);
};
</script>
<style scoped>
.layout-box > * {
  user-select: none;
  pointer-events: none;
  -webkit-user-drag: none;
}
.layout-box {
  position: relative;
  user-select: none;
  pointer-events: all;
  -webkit-user-drag: none;
}
.layout-box-dev-drag-before {
  pointer-events: all;
  position: absolute;
  top: 0;
  height: 25%;
  left: 0;
  right: 0;
  background: rgba(150, 0, 0, 0.05);
}
.layout-box-dev-drag-center {
  pointer-events: all;
  position: absolute;
  top: 25%;
  height: 50%;
  left: 0;
  right: 0;
  background: rgba(0, 150, 0, 0.05);
}
.layout-box-dev-drag-after {
  pointer-events: all;
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
