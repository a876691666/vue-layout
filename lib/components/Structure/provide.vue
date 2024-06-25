<template>
  <slot />
</template>
<script setup lang="ts">
import { provide } from 'vue';
import { StructureStoreType } from '../../core/useStructure';
import { StructureItem } from '../../types';

const props = withDefaults(defineProps<{ id?: string; structure?: StructureItem; structureStore?: StructureStoreType }>(), {});

provide('structureId', props.id);

provide('structureStore', props.structureStore);
</script>
