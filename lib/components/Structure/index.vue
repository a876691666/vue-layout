<template>
  <LayoutBox :structure="structure">
    <template v-for="(_, name) in $slots" #[name]="boxProps">
      <slot :name="name" :="boxProps" />
    </template>
  </LayoutBox>
</template>

<script setup lang="ts">
import { StructureItem, StyleType } from '../../types';
import { LayoutBox } from '../Box';
import { useStructure } from '../../core/useStructure';
import { Ref, inject } from 'vue';

defineSlots<{
  [key: string]: (props: { structure: StructureItem; styleRef?: Ref<StyleType>; propsRef?: Ref<{ [key: string]: any }> }) => any;
}>();

withDefaults(defineProps<{ style?: StyleType }>(), { style: () => ({ width: '1920px', height: '1080px' }) });

const { structure } = useStructure(inject('structureId'));
</script>
