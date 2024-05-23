<template>
  <slot />
</template>
<script setup lang="ts">
import { provide } from 'vue';

const props = withDefaults(defineProps<{ id?: string }>(), {});

provide('structureId', props.id);
</script>
