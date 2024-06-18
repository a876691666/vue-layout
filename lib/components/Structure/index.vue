<template>
  <LayoutBox :structure="structure">
    <template #_tools="{ structure }">
      <slot name="_tools" :structure="structure" />
    </template>
    <template v-for="(_, name) in $slots" #[name]="boxProps">
      <slot :name="name" :="boxProps" />
    </template>
  </LayoutBox>
</template>

<script setup lang="ts">
import { StructureItem, StyleType } from '../../types';
import { LayoutBox } from '../Box';
import { useStructure } from '../../core/useStructure';
import { Ref } from 'vue';

defineSlots<{
  [key: string]: (props: {
    structure: StructureItem;
    styleRef?: Ref<StyleType>;
    propsRef?: Ref<{ [key: string]: any }>;
    globalPropsRef?: Ref<{ [key: string]: any }>;
  }) => any;
  _tools: (props: { structure?: StructureItem }) => any;
}>();

withDefaults(defineProps<{ style?: StyleType }>(), { style: () => ({ width: '1920px', height: '1080px' }) });

const { structure } = useStructure();
</script>
