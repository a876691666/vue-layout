export type StyleType = {
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
  width?: string;
  height?: string;
};

export type LeafStructureItem = {
  type: 'leaf';
  id: string;
  uuid?: string;
  parentUuid?: string;
  style?: StyleType;
};

export type PositionStructureItem = {
  type: 'position';
  id: string;
  uuid?: string;
  style?: StyleType;
  parentUuid?: string;
  children?: PositionLeafStructureItem[];
};

export type PositionLeafStructureItem = {
  type: 'position-leaf';
  id?: string;
  uuid?: string;
  style?: StyleType;
  parentUuid?: string;
  children?: StructureItem[];
};

export type BlockStructureItem = {
  type: 'block';
  full?: boolean;
  id: string;
  uuid?: string;
  style?: StyleType;
  parentUuid?: string;
  children?: StructureItem[];
};

export type FlexStructureItem = {
  type: 'flex';
  direction?: 'row' | 'column';
  id: string;
  uuid?: string;
  style?: StyleType;
  parentUuid?: string;
  children?: StructureItem[];
};

export type StructureItem = LeafStructureItem | BlockStructureItem | FlexStructureItem | PositionStructureItem | PositionLeafStructureItem;

export type StructureProps = {
  style?: StyleType;
  structure?: StructureItem;
};
