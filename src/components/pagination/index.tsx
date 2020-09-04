import React, {
  useMemo, useState, CSSProperties, useEffect
} from "react";
import { Button } from '../button'
import { PageUl } from './style'
import {Icon }from "./../icon"
import { color } from "../shared/styles";

function calculateMove(current: number, state: number[], totalPage: number): number[] | null {
  let mid = Math.floor(state.length / 2);
  let arr;
  let minus = current - state[mid];
  if (minus === 0) {
    arr = null;
  } else if (minus > 0) {
    let tmp = state[state.length - 1];
    if (tmp + minus < totalPage) {
      arr = state.map((v) => v + minus);
    } else {
      if (tmp === totalPage) {
        arr = null;
      } else {
        arr = state.map((v) => v + totalPage - tmp);
      }
    }
  } else {
    //负数
    if (state[0] + minus > 1) {
      arr = state.map((v) => v + minus);
    } else {
      //边缘，看最大能减几
      if (state[0] === 1) {
        arr = null;
      } else {
        arr = state.map((v) => v - state[0] + 1);
      }
    }
  }
  return arr;
}

export function Pagination(props: PaginationProps) {
  const pageSize = 10;
  const defaultCurrent = 1;
  const barMaxSize = 5;
  const total = 1000;
  const [current, setCurrent] = useState(defaultCurrent);
  const [state, setState] = useState<Array<number>>([]);
  const { callback } = props
  const totalPage = useMemo(() => {
    let number = Math.ceil(total / pageSize);
    if (number > barMaxSize) {
      let statetmp = new Array(barMaxSize).fill(1).map((x, y) => y + 1);
      setState(statetmp);
    } else {
      let statetmp = new Array(number).fill(1).map((x, y) => y + 1);
      setState(statetmp);
    }
    return number;
  }, [pageSize, total]);
  useEffect(() => {
    if (callback) callback(current)
  }, [callback, current])
  console.log('totalPage is ', totalPage);
  return (
    <PageUl>
      <li>
        <Button
          appearance="primaryOutline"
          disabled={current === 1 ? true : false}
          onClick={() => {
            if (state.length > 0) {
              if (state[0] > 1) {
                let statetmp = state.map((x) => x - 1);
                setState(statetmp);
                setCurrent(current - 1);
                let arr = calculateMove(
                  current - 1,
                  statetmp,
                  totalPage
                );
                if (arr) {
                  setState(arr);
                }
              } else if (current !== state[0]) {
                setCurrent(current - 1);
                let arr = calculateMove(
                  current - 1,
                  state,
                  totalPage
                );
                if (arr) {
                  setState(arr);
                }
              }
            }
          }}
        >
          <Icon icon="arrowleft" color={color.primary}></Icon>
        </Button>
      </li>
      {state.map((x, i) => {
        return (
          <li key={i}>
            <Button
              appearance={
                current === x ? "primary" : "primaryOutline"
              }
              onClick={() => {
                setCurrent(x);
              }}
            >
              {x}
            </Button>
          </li>
        );
      })}
      <li>
        <Button
          appearance="primaryOutline"
          disabled={current === totalPage ? true : false}
          onClick={() => {
            if (state.length > 0) {
              if (state[barMaxSize! - 1] < totalPage) {
                let statetmp = state.map((x) => x + 1);
                setState(statetmp);
                setCurrent(current + 1);
                let arr = calculateMove(
                  current + 1,
                  statetmp,
                  totalPage
                );
                if (arr) {
                  setState(arr);
                }
              } else {
                if (current !== totalPage) {
                  setCurrent(current + 1);
                  let arr = calculateMove(
                    current + 1,
                    state,
                    totalPage
                  );
                  if (arr) {
                    setState(arr);
                  }
                }
              }
            }
          }}
          
        >
          <Icon icon="arrowright" color={color.primary}></Icon>
        </Button>
      </li>
    </PageUl>
  );
}

export type PaginationProps = {
  /** 每页显示多少条*/
  pageSize?: number;
  /** 默认显示第几页 */
  defaultCurrent?: number;
  /** 总共条数*/
  total: number;
  /** 分页条目最大显示长度 */
  barMaxSize?: number;
  /** 回调页数 */
  callback?: (v: number) => void;
  /** 外层style*/
  style?: CSSProperties;
  /**外层类名 */
  classnames?: string;
};
Pagination.defaultProps = {
  pageSize: 10,
  defaultCurrent: 11,
  barMaxSize: 5,
  total: 1000,
};