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
      <slot :structure="structure" :isSelect="selectStructure?.uuid === structure.uuid" :isHover="hoverStructure?.uuid === structure.uuid">
        {{ structure.uuid }} {{ structure.id }}
      </slot>
    </div>
    <template v-if="structure.children && structure.children.length">
      <TreeItem :id="$props.id" :structure="item" v-for="item in structure.children" :key="item.uuid">
        <template #default="defaultProps">
          <slot :="defaultProps" />
        </template>
      </TreeItem>
    </template>
  </div>
</template>

<script setup lang="ts">
import { StructureItem, StructureProps } from '../../types';
import { useStructure } from '../../core/useStructure';

defineOptions({
  name: 'TreeItem',
});

defineSlots<{
  default(props: { structure: StructureItem; isSelect: boolean; isHover: boolean }): any;
}>();

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
