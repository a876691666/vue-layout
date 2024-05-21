<template>
  <div
    :="$props.props"
    class="layout-box layout-box-dev"
    :class="{
      'layout-box-dev-selected': selectStructure?.uuid === $props.props['data-uuid'],
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

const props = withDefaults(
  defineProps<{
    id: string;
    dev?: boolean;
    props: any;
  }>(),
  {
    dev: false,
  }
);

const { handleSelectStructure, selectStructure } = useStructure(props.id);
</script>
<style scoped>
.layout-box-dev-selected {
}
</style>
