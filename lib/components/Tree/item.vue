<template>
  <div
    class="layout-tree-item"
    v-if="structure"
    :class="{
      'layout-tree-item-selected': selectStructure?.uuid === structure.uuid,
      'layout-tree-item-hover': hoverStructure?.uuid === structure.uuid,
    }"
  >
    <div @click="selectStructure = structure" @pointerenter="hoverStructure = structure" @pointerleave="hoverStructure = undefined">
      <slot :structure="structure" :isSelect="selectStructure?.uuid === structure.uuid" :isHover="hoverStructure?.uuid === structure.uuid">
        {{ structure.uuid }} {{ structure.id }}
      </slot>
    </div>
    <template v-if="structure.children && structure.children.length">
      <LayoutTreeItem :structure="item" v-for="item in getChildren(structure)" :key="item.uuid">
        <template #default="defaultProps">
          <slot :="defaultProps" />
        </template>
      </LayoutTreeItem>
    </template>
  </div>
</template>

<script setup lang="ts">
import { StructureItem } from '../../types';
import { useStructure } from '../../core/useStructure';

defineOptions({ name: 'LayoutTreeItem' });

defineSlots<{ default(props: { structure: StructureItem; isSelect: boolean; isHover: boolean }): any }>();

withDefaults(defineProps<{ structure?: StructureItem }>(), {});

const getChildren = (structure: StructureItem) => {
  if (structure.treeReverse) {
    return structure.children?.slice().reverse();
  }
  return structure.children;
};

const { selectStructure, hoverStructure } = useStructure();
</script>
<style scoped>
.layout-tree-item {
  border: 1px solid #000;
  padding: 2px;
  padding-left: 10px;
}
.layout-tree-item-selected {
  border: 3px solid red;
}
.layout-tree-item-hover {
  border: 5px solid green;
}
</style>
