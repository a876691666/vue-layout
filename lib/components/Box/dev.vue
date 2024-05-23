<template>
  <div
    :="$props.props"
    class="layout-box layout-box-dev"
    :class="{
      'layout-box-dev-selected': selectStructure?.uuid === $props.props['data-uuid'],
      'layout-box-dev-hover': hoverStructure?.uuid === $props.props['data-uuid'],
    }"
    @pointerenter="handleHoverStructure"
    @pointerleave="hoverStructure = null"
    v-if="dev"
    @click.stop="handleSelectStructure"
  >
    <slot />
  </div>
  <div :="props" class="layout-box" v-else>
    <slot />
  </div>
</template>
<script setup lang="ts">
import { inject } from 'vue';
import { useStructure } from '../../core/useStructure';

const props = withDefaults(defineProps<{ dev?: boolean; props: any }>(), { dev: false });

const { handleSelectStructure, handleHoverStructure, selectStructure, hoverStructure } = useStructure(inject('structureId'));
</script>
<style scoped>
.layout-box-dev-selected {
}
.layout-box-dev-hover {
}
</style>
