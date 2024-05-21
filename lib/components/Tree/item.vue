<template>
  <div
    class="layout-tree-item"
    v-if="structure"
    :class="{
      'layout-tree-item-selected': selectStructure?.uuid === structure.uuid,
      'layout-tree-item-hover': hoverStructure?.uuid === structure.uuid,
    }"
  >
    <div @click="selectStructure = structure" @pointerenter="hoverStructure = structure" @pointerleave="hoverStructure = null">
      {{ structure.uuid }} {{ structure.id }}
    </div>
    <template v-if="structure.children && structure.children.length">
      <Tree :id="$props.id" :structure="item" v-for="item in structure.children" :key="item.uuid"></Tree>
    </template>
  </div>
</template>

<script setup lang="ts">
import { StructureItem, StructureProps } from '../../types';
import { useStructure } from '../../core/useStructure';

defineOptions({
  name: 'Tree',
});

const props: StructureProps = withDefaults(
  defineProps<{
    id: string;
    structure?: StructureItem;
  }>(),
  {}
);

const { selectStructure, hoverStructure } = useStructure(props.id);
</script>
<style scoped>
.layout-tree-item {
  padding-left: 10px;
  border: 1px solid #000;
  padding: 2px;
}
.layout-tree-item-selected {
  border: 3px solid red;
}
.layout-tree-item-hover {
  border: 5px solid green;
}
</style>
