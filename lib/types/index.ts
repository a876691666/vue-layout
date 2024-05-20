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
  style?: StyleType;
};

export type PositionStructureItem = {
  type: 'position';
  id: string;
  style?: StyleType;
  children?: PositionLeafStructureItem[];
};

export type PositionLeafStructureItem = {
  type: 'position-leaf';
  id?: string;
  style?: StyleType;
  children?: StructureItem[];
};

export type BlockStructureItem = {
  type: 'block';
  full?: boolean;
  id: string;
  style?: StyleType;
  children?: StructureItem[];
};

export type FlexStructureItem = {
  type: 'flex';
  direction?: 'row' | 'column';
  id: string;
  style?: StyleType;
  children?: StructureItem[];
};

export type StructureItem = LeafStructureItem | BlockStructureItem | FlexStructureItem | PositionStructureItem | PositionLeafStructureItem;

export type StructureProps = {
  style?: StyleType;
  structure?: StructureItem;
};
