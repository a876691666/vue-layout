<script setup lang="ts">
import { LayoutStructure } from '../lib';
import { SelectVue } from '../lib/components/Box';
import { StructureProps } from '../lib/types';

const LayoutStructureProps: StructureProps = {
  style: {
    width: '100%',
    height: '100%',
  },
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
            style: { left: '400px', top: '400px', width: '300px', height: '300px' },
            type: 'position-leaf',
            children: [
              {
                type: 'block',
                id: 'header',
                children: [{ type: 'leaf', id: 'logo' }],
              },
            ],
          },
          {
            style: { left: '100px', top: '100px', width: '300px', height: '300px' },
            type: 'position-leaf',
            children: [
              {
                type: 'block',
                id: 'content',
                full: true,
                children: [
                  {
                    type: 'block',
                    id: 'sidebar',
                    children: [{ type: 'leaf', id: 'menu' }],
                  },
                  {
                    type: 'block',
                    id: 'main',
                    children: [{ type: 'leaf', id: 'content' }],
                  },
                ],
              },
            ],
          },
          {
            style: { left: '600px', top: '600px', width: '300px', height: '300px' },
            type: 'position-leaf',
            children: [
              {
                type: 'block',
                id: 'footer',
                children: [{ type: 'leaf', id: 'footer' }],
              },
            ],
          },
        ],
      },
    ],
  },
};
</script>

<template>
  <div style="width: 1000px; height: 1000px; background-color: #ccc">
    <div style="transform: scale(0.8); width: 100%; height: 100%">
      <LayoutStructure :="LayoutStructureProps">
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
  </div>
  <SelectVue />
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
