<template>
  <div
    :="props"
    class="layout-box layout-box-dev"
    :class="{
      'layout-box-dev-selected': selectStructure?.uuid === props['data-uuid'],
    }"
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
import { useStructure } from '../../core/useStructure';

withDefaults(
  defineProps<{
    dev?: boolean;
    props: any;
  }>(),
  {
    dev: false,
  }
);

const { handleSelectStructure, selectStructure } = useStructure();
</script>
<style scoped>
.layout-box-dev-selected {
  border: 1px solid #ff0000;
}
</style>
