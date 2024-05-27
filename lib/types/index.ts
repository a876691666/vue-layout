export type StyleType = {
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
  width?: string;
  height?: string;
};

export type BaseStructureItem = {
  label?: string;
  userData?: any;
  id?: string;
  uuid?: string;
  parentUuid?: string;
  style?: StyleType;
  props?: Record<string, any>;
  children?: StructureItem[];
  positionLeaf?: boolean;
};

export type LeafStructureItem = {
  type: 'leaf';
} & BaseStructureItem;

export type PositionStructureItem = {
  type: 'position';
} & BaseStructureItem;

export type BlockStructureItem = {
  type: 'block';
  full?: boolean;
} & BaseStructureItem;

export type VueStructureItem = {
  type: 'vue';
  component: string;
} & BaseStructureItem;

export type FlexStructureItem = {
  type: 'flex';
  direction?: 'row' | 'column';
} & BaseStructureItem;

export type StructureItem = LeafStructureItem | BlockStructureItem | FlexStructureItem | PositionStructureItem | VueStructureItem;
