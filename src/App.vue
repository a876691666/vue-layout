<script setup lang="ts">
import { LayoutStructure } from '../lib';
import { SelectVue } from '../lib/components/Box';
import TreeVue from '../lib/components/Tree';
import { StructureItem } from '../lib/types';

const LayoutStructureProps = {
  style: { width: '100%', height: '100%' },
  structure: {
    type: 'block',
    id: 'root',
    full: true,
    children: [
      {
        type: 'position',
        id: 'root-position',
        children: [
          {
            style: { left: '400px', top: '400px' },
            type: 'position-leaf',
            children: [{ type: 'vue', component: 'div', children: [{ type: 'leaf', id: 'logo' }] }],
          },
          { style: { left: '100px', top: '100px' }, type: 'position-leaf', id: 'menu' },
          { style: { left: '600px', top: '600px' }, type: 'position-leaf', id: 'footer' },
        ],
      },
    ],
  } as StructureItem,
};
</script>

<template>
  <div class="flex">
    <div class="w-48">
      <TreeVue id="main" />
    </div>
    <div style="width: 1000px; height: 1000px; background-color: #ccc; position: relative" class="w-full">
      <div style="transform: scale(0.8); width: 100%; height: 100%">
        <LayoutStructure :structure="LayoutStructureProps.structure" id="main" :style="LayoutStructureProps.style">
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
      <SelectVue id="main" />
    </div>
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
