import { Ref, ref } from 'vue';
import { StructureItem } from '../types';
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
    structure: Ref<StructureItem>;
    structureMap: Map<string, StructureItem>;
    selectStructure: Ref<StructureItem | null>;
    hoverStructure: Ref<StructureItem | null>;
    selectParentStructure: Ref<string[]>;
  }
> = {};

export const useStructure = (id: string) => {
  let _structureMap = new Map<string, StructureItem>();
  let _structure = ref();
  let selectStructure = ref<StructureItem | null>(null);
  let hoverStructure = ref<StructureItem | null>(null);
  let selectParentStructure = ref<Array<string>>([]);

  if (!cacheMap[id]) {
    cacheMap[id] = {
      structure: _structure,
      structureMap: _structureMap,
      selectStructure: selectStructure,
      hoverStructure: hoverStructure,
      selectParentStructure: selectParentStructure,
    };
  } else {
    _structure = cacheMap[id].structure;
    _structureMap = cacheMap[id].structureMap;
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

  const setStructure = (structure?: StructureItem) => {
    if (!structure) return;

    setStructureUuid(structure, _structureMap);
    setParentUuid(structure);

    _structure.value = structure;
  };

  const getMousePointStructure = (event: MouseEvent): StructureItem | null => {
    let result: StructureItem | null = null;
    // 最近的一个包含data-uuid属性的元素
    const selectUuid = findStructure(event.target as HTMLElement);
    const oldParentUuids = selectParentStructure.value;
    const parentUuids = getParentUuids(selectUuid);
    selectParentStructure.value = parentUuids;
    const firstUuid = parentUuids[0];
    if (!selectStructure.value) {
      return _structureMap.get(firstUuid) || null;
    }
    if (!parentUuids.includes(selectStructure.value?.uuid || '')) {
      if (parentUuids.length >= oldParentUuids.length) {
        const nextUuidIndex = parentUuids.findIndex((uuid) => !oldParentUuids.includes(uuid));
        if (nextUuidIndex === -1) return null;
        result = _structureMap.get(parentUuids[nextUuidIndex]) || null;
      } else {
        const nextUuidIndex = oldParentUuids.findIndex((uuid) => !parentUuids.includes(uuid));
        if (nextUuidIndex === -1) {
          const lastUuid = parentUuids[parentUuids.length - 1];
          result = _structureMap.get(lastUuid) || null;
        } else {
          if (nextUuidIndex === parentUuids.length) {
            const nextUuid = parentUuids[nextUuidIndex - 1];
            result = _structureMap.get(nextUuid) || null;
          } else {
            const nextUuid = parentUuids[nextUuidIndex];
            result = _structureMap.get(nextUuid) || null;
          }
        }
      }
    } else {
      const nextUuid = parentUuids[parentUuids.indexOf(selectStructure.value?.uuid || '') + 1];
      if (!nextUuid) return result;
      result = _structureMap.get(nextUuid) || null;
    }

    return result;
  };

  const handleSelectStructure = (event: MouseEvent) => {
    const structure = getMousePointStructure(event);
    selectStructure.value = structure;
  };

  const handleHoverStructure = (event: MouseEvent) => {
    const structure = getMousePointStructure(event);
    hoverStructure.value = structure;
  };

  return {
    structure: _structure,
    selectStructure,
    hoverStructure,
    handleSelectStructure,
    handleHoverStructure,
    setStructure,
  };
};
