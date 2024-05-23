<template>
  <div class="layout-tree" v-if="structure">
    <LayoutTreeItem :structure="structure">
      <template #default="props">
        <slot name="item" :structure="props.structure" :isSelect="props.isSelect" :isHover="props.isHover">
          {{ props.structure.uuid }}
        </slot>
      </template>
    </LayoutTreeItem>
  </div>
</template>

<script setup lang="ts">
import { StructureItem } from '../../types';
import { useStructure } from '../../core/useStructure';
import LayoutTreeItem from './item.vue';
import { inject } from 'vue';

defineOptions({ name: 'LayoutTree' });

defineSlots<{ item(props: { structure: StructureItem; isSelect: boolean; isHover: boolean }): any }>();

const { structure } = useStructure(inject('structureId'));
</script>
