<template>
  <LayoutBox :structure="structure">
    <template v-for="(_, name) in $slots" v-slot:[name]="t">
      <slot :name="name" :structure="t.structure" :styleRef="t.styleRef" />
    </template>
  </LayoutBox>
</template>

<script setup lang="ts">
import { StructureItem, StyleType } from '../../types';
import { LayoutBox } from '../Box';
import { useStructure } from '../../core/useStructure';
import { Ref, inject } from 'vue';

defineSlots<{ [key: string]: (props: { structure: StructureItem; styleRef?: Ref<StyleType> }) => any }>();

withDefaults(defineProps<{ style?: StyleType }>(), { style: () => ({ width: '1920px', height: '1080px' }) });

const { structure } = useStructure(inject('structureId'));
</script>
