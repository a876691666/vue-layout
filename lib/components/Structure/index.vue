<template>
  <LayoutBox :structure="_structure">
    <template v-for="(_, name) in $slots" v-slot:[name]>
      <slot :name="name" />
    </template>
  </LayoutBox>
</template>

<script setup lang="ts">
import { StructureItem, StyleType } from '../../types';
import { LayoutBox } from '../Box';
import { useStructure } from '../../core/useStructure';
import { inject } from 'vue';

const props = withDefaults(defineProps<{ style?: StyleType; structure?: StructureItem }>(), {
  style: () => ({ width: '1920px', height: '1080px' }),
});

const { structure: _structure, setStructure } = useStructure(inject('structureId'));

setStructure(props.structure);
</script>
