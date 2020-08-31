
import styled from "styled-components";
interface itemProps {
  value: string;
  level?: number;
  expand?: boolean;
  visible?: boolean;
  parent?: itemProps;
  children?: Array<itemProps>;
  key?: string;
}
interface itemPropsRequired
  extends Omit<Required<itemProps>, "children" | "parent"> {
  children?: itemPropsRequired[];
  parent: itemPropsRequired;
}
interface TreeItemType {
	level: number;
	itemkey: string;
	highlight: DragHighlight;
}
interface DragHighlight {
	drag: boolean;
	itemkey: string;
}
const originPadding = 24; //原始间距
export const TreeItem = styled.div<TreeItemType>`
	padding-left: ${(props) => originPadding * props.level}px;
	padding-top: 2px;
	padding-bottom: 2px;
	display: flex;
	align-items: center;
	position: relative;
	overflow: hidden;
	${(props) => {
		if (props.highlight.drag && props.highlight.itemkey === props.itemkey) {
			return "border: 1px dashed #53c94fa8;";
		} else {
			return "";
		}
	}}
`;

export const TreeIcon = styled.span<{ g: itemPropsRequired }>`
	& > svg {
		transition: linear 0.2s;
		height: 10px;
		margin-bottom: 5px;
		${(props) => {
    if (props.g.children && props.g.children.length !== 0) {
      if (props.g.children[0] && props.g.children[0]["visible"]) {
        return "display:inline-block;transform: rotate(-90deg);";
      } else {
        return "display:inline-block;";
      }
    } else {
      return "opacity:0";
    }
  }};
	}
`;
interface DragControlData {
  drag: boolean;
  x: number;
  itemkey: string;
}
type TreeGragType = { gkey: string } & DragControlData;
const levelSpace = 20; //同级生效间距

export const TreeGrag = styled.div<TreeGragType>`
	position: absolute;
	width: 100%;
	height: 90%;
	${(props) => {
    switch (props.x) {
      case 1:
        return `margin-left:${-levelSpace}px ;`;
      case 2:
        return "";
      case 3:
        return `margin-left:${levelSpace}px  ;`;
      default:
        return "";
    }
  }};
	${(props) => {
    if (props.itemkey === props.gkey) {
      return "background: #00000030;";
    }
  }}
`;