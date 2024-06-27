import { Ref, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import { StructureItem, StyleType, VueStructureItem } from '../types';
import { v5 } from 'uuid';
import mitt, { Emitter } from 'mitt';

// 递归设置结构的uuid
const setStructureUuid = (structure: StructureItem, structureMap: Map<string, Ref<StructureItem | undefined>>) => {
  if (!structure.uuid) {
    structure.uuid = v5(Math.random().toString(), v5.URL);
  }
  structureMap.set(structure.uuid, ref(structure));

  structure.children?.forEach((child) => {
    setStructureUuid(child, structureMap);
  });
};

// 递归设置parentUuid
const setParentUuid = (structure: StructureItem, parentUuid?: string) => {
  structure.parentUuid = parentUuid;

  structure.children?.forEach((child) => {
    setParentUuid(child, structure.uuid);
  });
};

const cacheMap: Record<
  string,
  {
    structure: Ref<StructureItem | undefined>;
    structureMap: Map<string, Ref<StructureItem | undefined>>;
    structureStyleMap: Map<string, Ref<StyleType>>;
    structurePropsMap: Map<string, Ref<{ [key: string]: any }>>;
    globalPropsRef: Ref<{ [key: string]: any }>;
    selectStructure: Ref<StructureItem | undefined>;
    hoverStructure: Ref<StructureItem | undefined>;
    selectParentStructure: Ref<string[]>;
    event: Emitter<{ updateSelectRect: void; dragMoveEnd: StructureItem | undefined }>;
  }
> = {};

const isAlt = ref(false);
const isCtrl = ref(false);
const isDrag = ref(false);

export type StructureStoreType = {
  isAlt: Ref<boolean>;
  isCtrl: Ref<boolean>;
  event: Emitter<{ updateSelectRect: void; dragMoveEnd: StructureItem | undefined }>;
  addStructure: (structure: StructureItem, parentUuid: string, index?: number) => StructureItem;
  removeStructure: (uuid: string) => void;
  updateStructure: (uuid: string, structure: StructureItem) => void;
  findStructure: (uuid: string) => Ref<StructureItem | undefined> | undefined;
  findUuidFromId: (id: string) => string | undefined;
  getStyleRef: (uuid?: string) => Ref<StyleType> | undefined;
  getPropsRef: (uuid?: string) => Ref<{ [key: string]: any }> | undefined;
  structure: Ref<StructureItem | undefined>;
  setStructure: (structure?: StructureItem) => void;
  selectStructure: Ref<StructureItem | undefined>;
  hoverStructure: Ref<StructureItem | undefined>;
  handleSelectStructure: (event: MouseEvent) => void;
  handleHoverStructure: (event: MouseEvent) => void;
  getGlobalPropsRef: () => Ref<{ [key: string]: any }>;
  setGlobalPropsRef: (props: { [key: string]: any }) => void;
  isDrag: Ref<boolean>;
  dragStart: () => void;
  dragMoveEnd: () => void;
  dispose: () => void;
};

export const useStructure = (_id?: string): StructureStoreType => {
  const structureStore = inject<StructureStoreType>('structureStore');

  if (structureStore) return structureStore;

  let _structure: Ref<StructureItem | undefined> = ref<StructureItem | undefined>();
  let _structureMap = new Map<string, Ref<StructureItem | undefined>>();
  let _structureStyleMap = new Map<string, Ref<StyleType>>();
  let _structurePropsMap = new Map<string, Ref<{ [key: string]: any }>>();
  let globalPropsRef = ref<{ [key: string]: any }>({});
  let selectStructure: Ref<StructureItem | undefined> = ref<StructureItem | undefined>();
  let hoverStructure: Ref<StructureItem | undefined> = ref<StructureItem | undefined>();
  let selectParentStructure = ref<Array<string>>([]);
  let event = mitt<{ updateSelectRect: void; dragMoveEnd: StructureItem | undefined }>();

  const id = _id || inject<string>('structureId') || 'default';

  if (!cacheMap[id]) {
    cacheMap[id] = {
      structure: _structure,
      structureMap: _structureMap,
      structureStyleMap: _structureStyleMap,
      structurePropsMap: _structurePropsMap,
      globalPropsRef: globalPropsRef,
      selectStructure: selectStructure,
      hoverStructure: hoverStructure,
      selectParentStructure: selectParentStructure,
      event,
    };
  } else {
    _structure = cacheMap[id].structure;
    _structureMap = cacheMap[id].structureMap;
    _structureStyleMap = cacheMap[id].structureStyleMap;
    _structurePropsMap = cacheMap[id].structurePropsMap;
    globalPropsRef = cacheMap[id].globalPropsRef;
    selectStructure = cacheMap[id].selectStructure;
    hoverStructure = cacheMap[id].hoverStructure;
    selectParentStructure = cacheMap[id].selectParentStructure;
    event = cacheMap[id].event;
  }

  const findStructureFromDom = (dom: HTMLElement): string | undefined => {
    if (!dom) return;

    const uuid = dom.getAttribute('data-uuid');
    if (!uuid) return findStructureFromDom(dom.parentElement as HTMLElement);

    return _structureMap.get(uuid) && uuid;
  };

  // 获取父级链路上的所有uuid
  const getParentUuids = (uuid?: string): string[] => {
    if (!uuid) return [];

    const structure = _structureMap.get(uuid);
    if (!structure) return [];

    if (structure.value?.ignore) return getParentUuids(structure.value.parentUuid);

    return [...getParentUuids(structure.value?.parentUuid), uuid];
  };

  const createStyleRef = (uuid: string) => {
    const structure = _structureMap.get(uuid);
    const styleRef = ref<StyleType>(_structureMap.get(uuid)?.value?.style || {});

    watch(styleRef, (style) => {
      if (!structure?.value) return;
      structure.value.style = style;
    });

    return styleRef;
  };

  const createPropsRef = (uuid: string) => {
    const structure = _structureMap.get(uuid);
    const propsRef = ref(structure?.value?.props || {});

    watch(propsRef, (props) => {
      if (!structure?.value) return;
      structure.value.props = props;
    });

    return propsRef;
  };

  const setStructure = (structure?: StructureItem) => {
    if (!structure) return;

    setStructureUuid(structure, _structureMap);
    setParentUuid(structure);

    _structure.value = structure;

    _structureMap.forEach((_value, key) => {
      _structureStyleMap.set(key, createStyleRef(key));
      _structurePropsMap.set(key, createPropsRef(key));
    });
  };

  const getStyleRef = (uuid?: string) => {
    if (!uuid) return;
    let styleRef = _structureStyleMap.get(uuid);
    if (!styleRef) {
      styleRef = createStyleRef(uuid);
      _structureStyleMap.set(uuid, styleRef);
    }
    return styleRef;
  };

  const getPropsRef = (uuid?: string) => {
    if (!uuid) return;
    let propsRef = _structurePropsMap.get(uuid);
    if (!propsRef) {
      propsRef = createPropsRef(uuid);
      _structurePropsMap.set(uuid, propsRef);
    }
    return propsRef;
  };

  const getGlobalPropsRef = () => {
    return globalPropsRef;
  };

  const setGlobalPropsRef = (props: { [key: string]: any }) => {
    globalPropsRef.value = props;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Alt') isAlt.value = true;
    if (event.key === 'Meta') isAlt.value = true;
    if (event.key === 'Control') isCtrl.value = true;
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Alt') isAlt.value = false;
    if (event.key === 'Meta') isAlt.value = false;
    if (event.key === 'Control') isCtrl.value = false;
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', () => {
      isAlt.value = false;
      isCtrl.value = false;
    });
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  });

  const getMousePointStructure = (event: MouseEvent): Ref<StructureItem | undefined> | undefined => {
    let result: Ref<StructureItem | undefined> | undefined;
    // 最近的一个包含data-uuid属性的元素
    const selectUuid = findStructureFromDom(event.target as HTMLElement);
    const oldParentUuids = getParentUuids(selectStructure.value?.uuid);
    const parentUuids = getParentUuids(selectUuid);
    selectParentStructure.value = parentUuids;
    const firstUuid = parentUuids[0];
    const lastUuid = parentUuids[parentUuids.length - 1];
    if (isAlt.value) {
      return _structureMap.get(lastUuid);
    }
    if (!selectStructure.value) {
      return _structureMap.get(firstUuid);
    }
    if (!parentUuids.includes(selectStructure.value?.uuid || '')) {
      if (parentUuids.length >= oldParentUuids.length) {
        const nextUuidIndex = parentUuids.findIndex((uuid) => !oldParentUuids.includes(uuid));
        if (nextUuidIndex === -1) return _structureMap.get(firstUuid);
        result = _structureMap.get(parentUuids[nextUuidIndex]);
      } else {
        const nextUuidIndex = oldParentUuids.findIndex((uuid) => !parentUuids.includes(uuid));
        if (nextUuidIndex === -1) {
          const lastUuid = parentUuids[parentUuids.length - 1];
          result = _structureMap.get(lastUuid);
        } else {
          if (nextUuidIndex === parentUuids.length) {
            const nextUuid = parentUuids[nextUuidIndex - 1];
            result = _structureMap.get(nextUuid);
          } else {
            const nextUuid = parentUuids[nextUuidIndex];
            result = _structureMap.get(nextUuid);
          }
        }
      }
    } else {
      const nextUuid = parentUuids[parentUuids.indexOf(selectStructure.value?.uuid || '') + 1];
      if (!nextUuid) return selectStructure;
      result = _structureMap.get(nextUuid);
    }

    return result;
  };

  const handleSelectStructure = (event: MouseEvent) => {
    const structure = getMousePointStructure(event);
    selectStructure.value = structure?.value;

    handleHoverStructure(event);
  };

  const handleHoverStructure = (event: MouseEvent) => {
    const structure = getMousePointStructure(event);
    hoverStructure.value = structure?.value;
  };

  const findUuidFromId = (id: string) => {
    let result: string | undefined;
    _structureMap.forEach(({ value }) => {
      if (value && value.id === id) {
        result = value.uuid;
      }
    });
    return result;
  };

  const addStructure = (structure: StructureItem, parentUuid: string, index?: number) => {
    if (!structure.uuid) {
      structure.uuid = v5(JSON.stringify(structure), v5.URL);
    }

    if (!_structureMap.has(structure.uuid)) _structureMap.set(structure.uuid, ref(structure));
    if (!_structureStyleMap.has(structure.uuid)) _structureStyleMap.set(structure.uuid, createStyleRef(structure.uuid));
    if (!_structurePropsMap.has(structure.uuid)) _structurePropsMap.set(structure.uuid, createPropsRef(structure.uuid));

    if (parentUuid) {
      structure.parentUuid = parentUuid;
      const parent = _structureMap.get(parentUuid);
      if (parent && parent.value) {
        if (!parent.value.children) parent.value.children = [];
        if (typeof index !== 'undefined') parent.value.children.splice(index, 0, structure);
        else parent.value.children.push(structure);
      }
    }

    return structure;
  };

  const removeStructure = (uuid: string) => {
    const structure = _structureMap.get(uuid);
    if (!structure) return;

    if (structure.value?.parentUuid) {
      const parent = _structureMap.get(structure.value.parentUuid);
      if (parent && parent.value) {
        parent.value.children = parent.value.children?.filter((child) => child.uuid !== uuid);
      }
    }

    _structureMap.delete(uuid);
    _structureStyleMap.delete(uuid);
    _structurePropsMap.delete(uuid);
  };

  const updateStructure = (uuid: string, structure: StructureItem) => {
    const oldStructure = _structureMap.get(uuid)?.value;
    if (!oldStructure) return;

    if (structure.label) {
      oldStructure.label = structure.label;
    }
    if (structure.type === 'vue' && structure.component) {
      (oldStructure as VueStructureItem).component = structure.component;
    }
    if (structure.userData) {
      oldStructure.userData = structure.userData;
    }
    if (structure.id) {
      oldStructure.id = structure.id;
    }
    if (structure.type) {
      oldStructure.type = structure.type;
    }
    if (structure.style) {
      if (!_structureStyleMap.has(uuid)) _structureStyleMap.set(uuid, createStyleRef(uuid));
      const styleRef = _structureStyleMap.get(uuid);
      if (styleRef) styleRef.value = structure.style;
    }
    if (structure.props) {
      if (!_structurePropsMap.has(uuid)) _structurePropsMap.set(uuid, createPropsRef(uuid));
      const propsRef = _structurePropsMap.get(uuid);
      if (propsRef) propsRef.value = structure.props;
    }
    if (structure.children) {
      oldStructure.children = structure.children;
    }
  };

  const findStructure = (uuid: string) => {
    return _structureMap.get(uuid);
  };

  const dragStart = () => {
    isDrag.value = true;
  };

  const dragMoveEnd = () => {
    isDrag.value = false;
  };

  const dispose = () => {
    delete cacheMap[id];

    _structureMap.clear();
    _structureStyleMap.clear();
    _structurePropsMap.clear();
    globalPropsRef.value = {};
    selectStructure.value = undefined;
    hoverStructure.value = undefined;
    selectParentStructure.value = [];

    event.all.clear();

    _structure.value = undefined;

    isAlt.value = false;
    isCtrl.value = false;
    isDrag.value = false;

    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };

  return {
    isAlt,
    isCtrl,

    event,

    addStructure,
    removeStructure,
    updateStructure,
    findStructure,
    findUuidFromId,

    getStyleRef,
    getPropsRef,

    structure: _structure,
    setStructure,
    selectStructure,
    hoverStructure,
    handleSelectStructure,
    handleHoverStructure,

    getGlobalPropsRef,
    setGlobalPropsRef,

    isDrag,
    dragStart,
    dragMoveEnd,

    dispose,
  };
};
