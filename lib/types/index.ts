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
  children?: StructureItem[];
};

export type LeafStructureItem = {
  type: 'leaf';
} & BaseStructureItem;

export type PositionStructureItem = {
  type: 'position';
  children?: PositionLeafStructureItem[];
} & BaseStructureItem;

export type PositionLeafStructureItem = {
  type: 'position-leaf';
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

export type StructureItem =
  | LeafStructureItem
  | BlockStructureItem
  | FlexStructureItem
  | PositionStructureItem
  | PositionLeafStructureItem
  | VueStructureItem;
