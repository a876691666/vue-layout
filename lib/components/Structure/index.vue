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
import { useStructure } from '../../core/useStructure';

const props: StructureProps = withDefaults(defineProps<StructureProps>(), {
  style: () => ({
    width: '1920px',
    height: '1080px',
  }),
});

const { structure, setStructure } = useStructure();

setStructure(props.structure);
</script>
