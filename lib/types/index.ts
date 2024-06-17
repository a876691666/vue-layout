import { CSSProperties } from 'vue';

export type StyleType = {
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
  width?: string;
  height?: string;
} & CSSProperties;

export type BaseStructureItem = {
  label?: string;
  userData?: any;
  id?: string;
  uuid?: string;
  parentUuid?: string;
  style?: StyleType;
  props?: Record<string, any>;
  children?: StructureItem[];

  /**
   * 是否可以拖拽顶部
   */
  dragTop?: boolean;

  /**
   * 是否可以拖拽左侧
   */
  dragLeft?: boolean;

  /**
   * 是否可以拖拽右侧
   */
  dragRight?: boolean;

  /**
   * 是否可以拖拽底部
   */
  dragBottom?: boolean;

  /**
   * 是否是叶子节点
   */
  positionLeaf?: boolean;

  /**
   * 是否占满父容器
   */
  full?: boolean;

  /**
   * 交互时忽略
   */
  ignore?: boolean;

  /**
   * 是否隐藏
   */
  hidden?: boolean;

  /**
   * 是否横向占满
   */
  fullw?: boolean;

  /**
   * 是否纵向占满
   */
  fullh?: boolean;

  /**
   * 是否使用全局属性
   */
  noGlobalProps?: boolean;

  /**
   * 显示拖拽边框
   */
  showDrag?: boolean;
};

export type PositionStructureItem = {
  type: 'position';
} & BaseStructureItem;

export type BlockStructureItem = {
  type: 'block';
} & BaseStructureItem;

export type VueStructureItem = {
  type: 'vue';
  component: string;
} & BaseStructureItem;

export type FlexStructureItem = {
  type: 'flex';
  direction?: 'row' | 'column';
} & BaseStructureItem;

export type StructureItem = BlockStructureItem | FlexStructureItem | PositionStructureItem | VueStructureItem;
