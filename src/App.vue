<script setup lang="ts">
import { LayoutStructure, LayoutStructureProvide, LayoutSelect, LayoutTree, StructureItem, useStructure } from '../lib';

const LayoutStructureProps = {
  style: { width: '100%', height: '100%' },
  structure: {
    type: 'position',
    id: 'root',
    full: true,
    ignore: true,
    children: [
      {
        type: 'vue',
        id: 'component-div',
        props: { id: '123' },
        style: { left: '400px', top: '400px' },
        positionLeaf: true,
        component: 'div',
        children: [
          { type: 'block', id: 'logo', style: { width: '250px' }, showDrag: true },
          { type: 'block', id: 'logo', style: { width: '250px' }, showDrag: true },
        ],
      },
      { style: { left: '100px', top: '100px' }, type: 'block', positionLeaf: true, dragTop: true, id: 'menu' },
      {
        style: { left: '600px', top: '600px' },
        type: 'block',
        positionLeaf: true,
        id: 'footer',
        children: [
          {
            type: 'vue',
            id: 'component-div',
            component: 'TestVue',
            children: [
              { type: 'vue', id: 'component-div', component: 'TestVue' },
              { type: 'vue', id: 'component-div', component: 'TestVue' },
              { type: 'vue', id: 'component-div', component: 'TestVue' },
            ],
          },
          {
            type: 'vue',
            id: 'component-div',
            component: 'TestVue',
            children: [
              { type: 'vue', id: 'component-div', component: 'TestVue' },
              { type: 'vue', id: 'component-div', component: 'TestVue' },
              { type: 'vue', id: 'component-div', component: 'TestVue' },
            ],
          },
          {
            type: 'vue',
            id: 'component-div',
            component: 'TestVue',
            children: [
              { type: 'vue', id: 'component-div', component: 'TestVue' },
              { type: 'vue', id: 'component-div', component: 'TestVue' },
              { type: 'vue', id: 'component-div', component: 'TestVue' },
            ],
          },
        ],
      },
    ],
  } as StructureItem,
};

const structureStore = useStructure('main');

const { selectStructure, setGlobalPropsRef, isDrag, setStructure } = structureStore;

setStructure(LayoutStructureProps.structure);

isDrag.value = false;

setGlobalPropsRef({
  uid: '1',
});
</script>

<template>
  <p>
    {{ selectStructure?.id || '-' }}
  </p>
  <div class="flex">
    <LayoutStructureProvide id="main" :structureStore="structureStore">
      <div class="w-48">
        <LayoutTree>
          <template #item="{ structure, isSelect, isHover }">
            <div :class="{ 'layout-tree-item-selected': isSelect, 'layout-tree-item-hover': isHover }">
              {{ structure.id }}
            </div>
          </template>
        </LayoutTree>
      </div>
      <div style="width: 1000px; height: 1000px; background-color: #ccc; position: relative" class="w-full">
        <div style="transform: scale(0.8); width: 100%; height: 100%">
          <LayoutStructure :style="LayoutStructureProps.style">
            <template #_tools="{ structure }">{{ structure }}</template>
            <template #logo>
              <img class="logo" src="https://vuejs.org/images/logo.png" alt="Vue logo" />
            </template>
            <template #menu>
              <div style="width: 200px; height: 200px; background-color: #646cff"></div>
            </template>
            <template #content>
              <div style="width: 100px; height: 100px; background-color: #42b883"></div>
            </template>
          </LayoutStructure>
        </div>
        <LayoutSelect />
      </div>
    </LayoutStructureProvide>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
