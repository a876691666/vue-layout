<template>
  <DevVue
    dev
    :props="{
      class: className,
      style: { ...style, ...structure?.style },
      'data-uuid': structure?.uuid,
      'data-id': structure?.id,
      'data-type': structure?.type,
    }"
  >
    <template v-if="structure?.type === 'block'">
      <Box v-for="(item, index) in structure.children" :key="index" :structure="item">
        <template v-for="(_, name) in $slots" v-slot:[name]>
          <slot :name="name" />
        </template>
      </Box>
    </template>
    <template v-else-if="structure?.type === 'flex'" class="flex flex-wrap" :data-id="structure.id">
      <Box v-for="(item, index) in structure.children" :key="index" :structure="item">
        <template v-for="(_, name) in $slots" v-slot:[name]>
          <slot :name="name" />
        </template>
      </Box>
    </template>
    <template v-else-if="structure?.type === 'position'" class="relative" :data-id="structure.id">
      <Box v-for="(item, index) in structure.children" :key="index" :structure="item">
        <template v-for="(_, name) in $slots" v-slot:[name]>
          <slot :name="name" />
        </template>
      </Box>
    </template>
    <template v-else-if="structure?.type === 'position-leaf'" class="relative" :data-id="structure.id">
      <Box v-for="(item, index) in structure.children" :key="index" :structure="item">
        <template v-for="(_, name) in $slots" v-slot:[name]>
          <slot :name="name" />
        </template>
      </Box>
    </template>
    <div v-else-if="structure?.type === 'leaf'" :style="structure.style" :data-id="structure.id">
      <slot :name="structure.id" />
    </div>
  </DevVue>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { StructureProps } from '../../types';
import DevVue from './dev.vue';

defineOptions({
  name: 'Box',
});

const props = withDefaults(defineProps<StructureProps>(), {
  style: () => ({}),
});

const layoutType = ref(props.structure?.type);

const className = ref<string[]>([]);

const defineBlockClassName = () => {
  const result: string[] = [];

  if (props.structure?.type !== 'block') return result;
  if (props.structure?.full) result.push('layout-box-block-full');

  return result;
};

const defineFlexClassName = () => {
  const result: string[] = [];

  if (props.structure?.type !== 'flex') return result;
  if (props.structure?.direction === 'row') result.push('layout-box-flex-row');
  if (props.structure?.direction === 'column') result.push('layout-box-flex-column');

  return result;
};

const updateClassName = () => {
  const newClass = [`layout-box-${layoutType.value}`];

  if (layoutType.value === 'block') newClass.push(...defineBlockClassName());
  if (layoutType.value === 'flex') newClass.push(...defineFlexClassName());

  className.value = newClass;
};

updateClassName();

const slots = defineSlots();
</script>
<style scoped>
.layout-box {
  box-sizing: border-box;
}
.layout-box-block {
  display: block;
}
.layout-box-block-full {
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
