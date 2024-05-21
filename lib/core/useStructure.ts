import { ref } from 'vue';
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

const _structureMap = new Map<string, StructureItem>();
const _structure = ref();
const selectStructure = ref<StructureItem | null>(null);
const selectParentStructure = ref<Array<string>>([]);

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

export const useStructure = () => {
  const setStructure = (structure?: StructureItem) => {
    if (!structure) return;

    setStructureUuid(structure, _structureMap);
    setParentUuid(structure);

    _structure.value = structure;
  };

  const handleSelectStructure = (event: MouseEvent) => {
    // 最近的一个包含data-uuid属性的元素
    const selectUuid = findStructure(event.target as HTMLElement);
    const oldParentUuids = selectParentStructure.value;
    const parentUuids = getParentUuids(selectUuid);
    selectParentStructure.value = parentUuids;
    const firstUuid = parentUuids[0];
    if (!selectStructure.value) {
      selectStructure.value = _structureMap.get(firstUuid) || null;
      return;
    }
    if (!parentUuids.includes(selectStructure.value?.uuid || '')) {
      if (parentUuids.length >= oldParentUuids.length) {
        const nextUuidIndex = parentUuids.findIndex((uuid) => !oldParentUuids.includes(uuid));
        if (nextUuidIndex === -1) return;
        selectStructure.value = _structureMap.get(parentUuids[nextUuidIndex]) || null;
      } else {
        const nextUuidIndex = oldParentUuids.findIndex((uuid) => !parentUuids.includes(uuid));
        if (nextUuidIndex === -1) {
          const lastUuid = parentUuids[parentUuids.length - 1];
          selectStructure.value = _structureMap.get(lastUuid) || null;
        } else {
          if (nextUuidIndex === parentUuids.length) {
            const nextUuid = parentUuids[nextUuidIndex - 1];
            selectStructure.value = _structureMap.get(nextUuid) || null;
          } else {
            const nextUuid = parentUuids[nextUuidIndex];
            selectStructure.value = _structureMap.get(nextUuid) || null;
          }
        }
      }
    } else {
      const nextUuid = parentUuids[parentUuids.indexOf(selectStructure.value.uuid || '') + 1];
      if (!nextUuid) return;
      selectStructure.value = _structureMap.get(nextUuid) || null;
    }
  };

  return {
    structure: _structure,
    selectStructure,
    handleSelectStructure,
    setStructure,
  };
};
