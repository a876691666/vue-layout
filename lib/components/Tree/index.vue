<template>
  <div class="layout-tree" v-if="structure">
    <TreeItem :id="props.id" :structure="structure"></TreeItem>
  </div>
</template>

<script setup lang="ts">
import { StructureProps } from '../../types';
import { useStructure } from '../../core/useStructure';
import TreeItem from './item.vue';

defineOptions({
  name: 'Tree',
});

const props: StructureProps = withDefaults(
  defineProps<{
    id: string;
  }>(),
  {}
);

const { structure } = useStructure(props.id);
</script>
