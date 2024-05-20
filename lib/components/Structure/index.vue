<template>
  <BoxVue :structure="structure">
    <template v-for="(_, name) in $slots" v-slot:[name]>
      <slot :name="name" />
    </template>
  </BoxVue>
</template>

<script setup lang="ts">
import { StructureProps } from '../../types';
import BoxVue from '../Box';

withDefaults(defineProps<StructureProps>(), {
  style: () => ({
    width: '1920px',
    height: '1080px',
  }),
});
</script>
