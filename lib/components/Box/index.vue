<template>
  <LayoutDevBox
    dev
    :props="{
      class: className,
      style: { ...style, ...styleRef },
      'data-uuid': structureAgent?.uuid,
      'data-id': structureAgent?.id,
      'data-type': structureAgent?.type,
    }"
    v-show="!structureAgent?.hidden"
  >
    <template v-if="structureAgent?.type === 'block'">
      <template v-if="structureAgent.children && structureAgent.children.length">
        <LayoutBox v-for="(item, index) in structureAgent.children" :key="index" :structure="item">
          <template v-for="(_, name) in $slots" #[name]="slotProps">
            <slot :name="name" :="slotProps" />
          </template>
        </LayoutBox>
      </template>
      <slot
        v-else
        :name="structureAgent.id"
        :structure="structureAgent"
        :styleRef="getCurrentStyleRef()"
        :propsRef="getCurrentPropsRef()"
        :globalPropsRef="getGlobalPropsRef()"
      />
    </template>
    <template v-else-if="structureAgent?.type === 'flex'" class="flex flex-wrap" :data-id="structureAgent.id">
      <template v-if="structureAgent.children && structureAgent.children.length">
        <LayoutBox v-for="(item, index) in structureAgent.children" :key="index" :structure="item">
          <template v-for="(_, name) in $slots" #[name]="slotProps">
            <slot :name="name" :="slotProps" />
          </template>
        </LayoutBox>
      </template>
      <slot
        v-else
        :name="structureAgent.id"
        :structure="structureAgent"
        :styleRef="getCurrentStyleRef()"
        :propsRef="getCurrentPropsRef()"
        :globalPropsRef="getGlobalPropsRef()"
      />
    </template>
    <template v-else-if="structureAgent?.type === 'position'" class="relative" :data-id="structureAgent.id">
      <template v-if="structureAgent.children && structureAgent.children.length">
        <LayoutBox v-for="(item, index) in structureAgent.children" :key="index" :structure="item">
          <template v-for="(_, name) in $slots" #[name]="slotProps">
            <slot :name="name" :="slotProps" />
          </template>
        </LayoutBox>
      </template>
      <slot
        v-else
        :name="structureAgent.id"
        :structure="structureAgent"
        :styleRef="getCurrentStyleRef()"
        :propsRef="getCurrentPropsRef()"
        :globalPropsRef="getGlobalPropsRef()"
      />
    </template>
    <template v-else-if="structureAgent?.type === 'vue'" :data-id="structureAgent.id">
      <component :is="structureAgent.component" :="{ ...propsRef, ...(structure?.noGlobalProps ? {} : globalPropsRef) }">
        <template v-if="structureAgent.children && structureAgent.children.length">
          <LayoutBox v-for="(item, index) in structureAgent.children" :key="index" :structure="item">
            <template v-for="(_, name) in $slots" #[name]="slotProps">
              <slot :name="name" :="slotProps" />
            </template>
          </LayoutBox>
        </template>
        <slot
          v-else
          :name="structureAgent.id"
          :structure="structureAgent"
          :styleRef="getCurrentStyleRef()"
          :propsRef="getCurrentPropsRef()"
          :globalPropsRef="getGlobalPropsRef()"
        />
      </component>
    </template>
  </LayoutDevBox>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import { StructureItem, StyleType } from '../../types';
import { LayoutDevBox } from '.';
import { useStructure } from '../../core/useStructure';

const props = withDefaults(defineProps<{ style?: StyleType; structure?: StructureItem }>(), { style: () => ({}) });
defineOptions({ name: 'LayoutBox' });
defineSlots<{
  [key: string]: (props: {
    structure: StructureItem;
    styleRef?: Ref<StyleType>;
    propsRef?: Ref<{ [key: string]: any }>;
    globalPropsRef?: Ref<{ [key: string]: any }>;
  }) => any;
}>();

const { getStyleRef, getPropsRef, getGlobalPropsRef, findStructure } = useStructure();
const structureAgent = findStructure(props.structure?.uuid || '');
const styleRef = getStyleRef(props.structure?.uuid);
const propsRef = getPropsRef(props.structure?.uuid);
const globalPropsRef = getGlobalPropsRef();
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
  if (props.structure?.fullw) result.push('layout-box-fullw');
  if (props.structure?.fullh) result.push('layout-box-fullh');

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
.layout-box-fullw {
  width: 100%;
}
.layout-box-fullh {
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
</style>
