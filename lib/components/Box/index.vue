<template>
  <LayoutDevBox
    dev
    :props="{
      class: className,
      style: { ...style, ...styleRef },
      'data-uuid': structure?.uuid,
      'data-id': structure?.id,
      'data-type': structure?.type,
    }"
  >
    <template v-if="structure?.type === 'block'">
      <template v-if="structure.children">
        <LayoutBox v-for="(item, index) in structure.children" :key="index" :structure="item">
          <template v-for="(_, name) in $slots" #[name]="slotProps">
            <slot :name="name" :="slotProps" />
          </template>
        </LayoutBox>
      </template>
      <slot v-else :name="structure.id" :structure="structure" :styleRef="getCurrentStyleRef()" :propsRef="getCurrentPropsRef()" />
    </template>
    <template v-else-if="structure?.type === 'flex'" class="flex flex-wrap" :data-id="structure.id">
      <template v-if="structure.children">
        <LayoutBox v-for="(item, index) in structure.children" :key="index" :structure="item">
          <template v-for="(_, name) in $slots" #[name]="slotProps">
            <slot :name="name" :="slotProps" />
          </template>
        </LayoutBox>
      </template>
      <slot v-else :name="structure.id" :structure="structure" :styleRef="getCurrentStyleRef()" :propsRef="getCurrentPropsRef()" />
    </template>
    <template v-else-if="structure?.type === 'position'" class="relative" :data-id="structure.id">
      <template v-if="structure.children">
        <LayoutBox v-for="(item, index) in structure.children" :key="index" :structure="item">
          <template v-for="(_, name) in $slots" #[name]="slotProps">
            <slot :name="name" :="slotProps" />
          </template>
        </LayoutBox>
      </template>
      <slot v-else :name="structure.id" :structure="structure" :styleRef="getCurrentStyleRef()" :propsRef="getCurrentPropsRef()" />
    </template>
    <template v-else-if="structure?.type === 'vue'" :data-id="structure.id">
      <component :is="structure.component" :="propsRef">
        <template v-if="structure.children">
          <LayoutBox v-for="(item, index) in structure.children" :key="index" :structure="item">
            <template v-for="(_, name) in $slots" #[name]="slotProps">
              <slot :name="name" :="slotProps" />
            </template>
          </LayoutBox>
        </template>
        <slot v-else :name="structure.id" :structure="structure" :styleRef="getCurrentStyleRef()" :propsRef="getCurrentPropsRef()" />
      </component>
    </template>
  </LayoutDevBox>
</template>

<script setup lang="ts">
import { Ref, inject, ref } from 'vue';
import { StructureItem, StyleType } from '../../types';
import { LayoutDevBox } from '.';
import { useStructure } from '../../core/useStructure';

const props = withDefaults(defineProps<{ style?: StyleType; structure?: StructureItem }>(), { style: () => ({}) });
defineOptions({ name: 'LayoutBox' });
defineSlots<{
  [key: string]: (props: { structure: StructureItem; styleRef?: Ref<StyleType>; propsRef?: Ref<{ [key: string]: any }> }) => any;
}>();

const { getStyleRef, getPropsRef } = useStructure(inject('structureId'));
const styleRef = getStyleRef(props.structure?.uuid);
const propsRef = getPropsRef(props.structure?.uuid);
const getCurrentStyleRef = () => styleRef;
const getCurrentPropsRef = () => propsRef;

const layoutType = ref(props.structure?.type);

const className = ref<string[]>([]);

const defineBlockClassName = () => {
  const result: string[] = [];

  if (props.structure?.type !== 'block') return result;

  return result;
};

const defineFlexClassName = () => {
  const result: string[] = [];

  if (props.structure?.type !== 'flex') return result;
  if (props.structure?.direction === 'row') result.push('layout-box-flex-row');
  if (props.structure?.direction === 'column') result.push('layout-box-flex-column');

  return result;
};

const defineAnyClassName = () => {
  const result: string[] = [];

  if (props.structure?.positionLeaf) result.push('layout-box-position-leaf');
  if (props.structure?.full) result.push('layout-box-full');

  return result;
};

const updateClassName = () => {
  const newClass = [`layout-box-${layoutType.value}`];

  if (layoutType.value === 'block') newClass.push(...defineBlockClassName());
  if (layoutType.value === 'flex') newClass.push(...defineFlexClassName());

  newClass.push(...defineAnyClassName());

  className.value = newClass;
};

updateClassName();
</script>
<style scoped>
.layout-box {
  box-sizing: border-box;
}
.layout-box-block {
  display: block;
}
.layout-box-full {
  width: 100%;
  height: 100%;
}
.layout-box-flex {
  display: flex;
}
.layout-box-flex-row {
  flex-direction: row;
}
.layout-box-flex-column {
  flex-direction: column;
}
.layout-box-position {
  position: relative;
  width: 100%;
  height: 100%;
}
.layout-box-position-leaf {
  position: absolute;
}
.layout-box-leaf {
}
</style>
