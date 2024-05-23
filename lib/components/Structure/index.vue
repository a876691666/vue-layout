<template>
  <LayoutBox :structure="structure">
    <template v-for="(_, name) in $slots" v-slot:[name]>
      <slot :name="name" />
    </template>
  </LayoutBox>
</template>

<script setup lang="ts">
import { StyleType } from '../../types';
import { LayoutBox } from '../Box';
import { useStructure } from '../../core/useStructure';
import { inject } from 'vue';

withDefaults(defineProps<{ style?: StyleType }>(), {
  style: () => ({ width: '1920px', height: '1080px' }),
});

const { structure } = useStructure(inject('structureId'));
</script>
