<template>
  <slot />
</template>
<script setup lang="ts">
import { provide } from 'vue';
import { useStructure } from '../../core/useStructure';
import { StructureItem } from '../../types';

const props = withDefaults(defineProps<{ id?: string; structure: StructureItem }>(), {});

provide('structureId', props.id);

const { structure: _structure, setStructure } = useStructure(props.id);

setStructure(props.structure);
</script>
