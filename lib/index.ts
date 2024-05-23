import { LayoutStructure, LayoutStructureProvide } from './components/Structure';
import { LayoutSelect } from './components/Box';
import { LayoutTree } from './components/Tree';
import { useStructure } from './core/useStructure';
import './tailwind.css';

export * from './types';
export { LayoutStructure, LayoutStructureProvide, LayoutSelect, LayoutTree, useStructure };

export default {
  install: (app: any) => {
    app.component('LayoutStructure', LayoutStructure);
    app.component('LayoutStructureProvide', LayoutStructureProvide);
    app.component('LayoutSelect', LayoutSelect);
    app.component('LayoutTree', LayoutTree);
  },
};
