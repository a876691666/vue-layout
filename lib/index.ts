import { default as LayoutStructure } from './components/Structure/index.vue';
import './tailwind.css';

export default {
  install: (app: any) => {
    app.component('LayoutStructure', LayoutStructure);
  },
};

export { LayoutStructure };
