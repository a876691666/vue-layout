import './tailwind.css';

import { default as LayoutStructure } from './components/Structure/index.vue';

export default {
  install: (app: any) => {
    app.component('LayoutStructure', LayoutStructure);
  },
};

export { LayoutStructure };
