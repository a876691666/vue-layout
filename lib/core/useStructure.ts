import { Ref, onMounted, onUnmounted, ref, watch } from 'vue';
import { StructureItem, StyleType } from '../types';
import { v5 } from 'uuid';

// 递归设置结构的uuid
const setStructureUuid = (structure: StructureItem, structureMap: Map<string, StructureItem>) => {
  if (!structure.uuid) {
    structure.uuid = v5(JSON.stringify(structure), v5.URL);
  }
  structureMap.set(structure.uuid, structure);
  if (structure.type !== 'leaf' && structure.children) {
    structure.children.forEach((child) => {
      setStructureUuid(child, structureMap);
    });
  }
};

// 递归设置parentUuid
const setParentUuid = (structure: StructureItem, parentUuid?: string) => {
  structure.parentUuid = parentUuid;
  if (structure.type !== 'leaf' && structure.children) {
    structure.children.forEach((child) => {
      setParentUuid(child, structure.uuid);
    });
  }
};

const cacheMap: Record<
  string,
  {
    structure: Ref<StructureItem | undefined>;
    structureMap: Map<string, StructureItem>;
    structureStyleMap: Map<string, Ref<StyleType>>;
    structurePropsMap: Map<string, any>;
    selectStructure: Ref<StructureItem | undefined>;
    hoverStructure: Ref<StructureItem | undefined>;
    selectParentStructure: Ref<string[]>;
  }
> = {};

const isAlt = ref(false);

export const useStructure = (_id?: string) => {
  let _structure: Ref<StructureItem | undefined> = ref<StructureItem | undefined>();
  let _structureMap = new Map<string, StructureItem>();
  let _structureStyleMap = new Map<string, Ref<StyleType>>();
  let _structurePropsMap = new Map<string, Ref<{ [key: string]: any }>>();
  let selectStructure: Ref<StructureItem | undefined> = ref<StructureItem | undefined>();
  let hoverStructure: Ref<StructureItem | undefined> = ref<StructureItem | undefined>();
  let selectParentStructure = ref<Array<string>>([]);

  const id = _id || 'default';

  if (!cacheMap[id]) {
    cacheMap[id] = {
      structure: _structure,
      structureMap: _structureMap,
      structureStyleMap: _structureStyleMap,
      structurePropsMap: _structurePropsMap,
      selectStructure: selectStructure,
      hoverStructure: hoverStructure,
      selectParentStructure: selectParentStructure,
    };
  } else {
    _structure = cacheMap[id].structure;
    _structureMap = cacheMap[id].structureMap;
    _structureStyleMap = cacheMap[id].structureStyleMap;
    _structurePropsMap = cacheMap[id].structurePropsMap;
    selectStructure = cacheMap[id].selectStructure;
    hoverStructure = cacheMap[id].hoverStructure;
    selectParentStructure = cacheMap[id].selectParentStructure;
  }

  const findStructure = (dom: HTMLElement): string | undefined => {
    if (!dom) return;

    const uuid = dom.getAttribute('data-uuid');
    if (!uuid) return findStructure(dom.parentElement as HTMLElement);

    return _structureMap.get(uuid) && uuid;
  };

  // 获取父级链路上的所有uuid
  const getParentUuids = (uuid?: string): string[] => {
    if (!uuid) return [];

    const structure = _structureMap.get(uuid);
    if (!structure) return [];

    return [...getParentUuids(structure.parentUuid), uuid];
  };

  const createStyleRef = (uuid: string) => {
    const styleRef = ref<StyleType>(_structureMap.get(uuid)?.style || {});

    watch(styleRef, (style) => {
      if (!_structureMap.get(uuid)) return;
      _structureMap.get(uuid)!.style = style;
    });

    return styleRef;
  };

  const createPropsRef = (uuid: string) => {
    const propsRef = ref(_structureMap.get(uuid)?.props || {});

    watch(propsRef, (props) => {
      if (!_structureMap.get(uuid)) return;
      _structureMap.get(uuid)!.props = props;
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

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Alt') {
      isAlt.value = true;
    }
    if (event.key === 'Meta') {
      isAlt.value = true;
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Alt') {
      isAlt.value = false;
    }
    if (event.key === 'Meta') {
      isAlt.value = false;
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  });

  const getMousePointStructure = (event: MouseEvent): StructureItem | undefined => {
    let result: StructureItem | undefined;
    // 最近的一个包含data-uuid属性的元素
    const selectUuid = findStructure(event.target as HTMLElement);
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
      if (!nextUuid) return selectStructure.value;
      result = _structureMap.get(nextUuid);
    }

    return result;
  };

  const handleSelectStructure = (event: MouseEvent) => {
    const structure = getMousePointStructure(event);
    selectStructure.value = structure;

    handleHoverStructure(event);
  };

  const handleHoverStructure = (event: MouseEvent) => {
    const structure = getMousePointStructure(event);
    hoverStructure.value = structure;
  };

  const findUuidFromId = (id: string) => {
    let result: string | undefined;
    _structureMap.forEach((value) => {
      if (value.id === id) {
        result = value.uuid;
      }
    });
    return result;
  };

  const addStructure = (structure: StructureItem, parentUuid: string) => {
    if (!structure.uuid) {
      structure.uuid = v5(JSON.stringify(structure), v5.URL);
    }

    if (!_structureMap.has(structure.uuid)) _structureMap.set(structure.uuid, structure);
    if (!_structureStyleMap.has(structure.uuid)) _structureStyleMap.set(structure.uuid, createStyleRef(structure.uuid));
    if (!_structurePropsMap.has(structure.uuid)) _structurePropsMap.set(structure.uuid, createPropsRef(structure.uuid));

    if (parentUuid) {
      structure.parentUuid = parentUuid;
      const parent = _structureMap.get(parentUuid);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(structure);
      }
    }

    return structure;
  };

  const removeStructure = (uuid: string) => {
    const structure = _structureMap.get(uuid);
    if (!structure) return;

    if (structure.parentUuid) {
      const parent = _structureMap.get(structure.parentUuid);
      if (parent) {
        parent.children = parent.children?.filter((child) => child.uuid !== uuid);
      }
    }

    _structureMap.delete(uuid);
    _structureStyleMap.delete(uuid);
    _structurePropsMap.delete(uuid);
  };

  const updateStructure = (uuid: string, structure: StructureItem) => {
    const oldStructure = _structureMap.get(uuid);
    if (!oldStructure) return;

    if (structure.label) {
      oldStructure.label = structure.label;
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

  return {
    addStructure,
    removeStructure,
    updateStructure,
    getStyleRef,
    getPropsRef,
    findUuidFromId,
    structure: _structure,
    selectStructure,
    hoverStructure,
    handleSelectStructure,
    handleHoverStructure,
    setStructure,
  };
};
