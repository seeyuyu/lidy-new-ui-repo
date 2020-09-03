import React, {
	useEffect, useState, useRef, RefObject, useMemo, CSSProperties
} from "react";
import { color } from "../shared/styles";
import { useStateAnimation } from "../modal"
import { Button } from './../button'
import { Icon } from "./../icon"
import {
	CalendarWrapper, CalendarDateRow, CalendarHeadItem, CalendarDate,
	CalendarHeadWrapper, IconWrapper, BtnDiv, Bwrapper, MonthItem, MonthWrapper,
	CalendarIcon, DatePickerWrapper
} from "./style"
import { DateItem, modeType, calDataType } from './interface'
export function useClickOutside(
	ref: RefObject<HTMLElement>,
	handler: Function
) {
	useEffect(() => {
		const listener = (event: MouseEvent) => {
			if (!ref.current || ref.current.contains(event.target as Node)) {
				return;
			}
			handler(event);
		};
		window.addEventListener("click", listener);
		return () => window.removeEventListener("click", listener);
	}, [ref, handler]);
}

const isCurrentMonth = function (
	current: Date,
	year: number,
	month: number
): boolean {
	return current.getFullYear() === year && current.getMonth() === month;
};
const isCurrentDay = function (current: Date, day: number, onMonth: boolean) {
	return current.getDate() === day && onMonth;
};
const getStartYear = function (calData: calDataType) {
	return calData[0] - calData[0] % 10
}

const getDateData = function (year: number, month: number, day: number) {
	const firstDay = new Date(year, month, 1);
	let weekDay = firstDay.getDay(); //周日，0，周六 6
	weekDay = weekDay === 0 ? 7 : weekDay;
	let start = firstDay.getTime() - weekDay * 60 * 60 * 24 * 1000;
	let arr: DateItem[] = [];
	for (let i = 0; i < 42; i++) {
		let current = new Date(start + i * 60 * 60 * 24 * 1000);
		let onMonth = isCurrentMonth(current, year, month);
		arr.push({
			day: current.getDate(),
			isonMonth: onMonth,
			isonDay: isCurrentDay(current, day, onMonth),
			origin: current,
		});
	}
	let k = -1;
	return Array.from({ length: 6 }, () => {
		k++;
		return arr.slice(k * 7, (k + 1) * 7);
	});
};


const btnStyle = {
	padding: "0px",
	background: color.lightest,
};
const MonthData = new Array(12).fill(1).map((_x, y) => y + 1);


const validateDate = (value: string) => {
	let reg = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
	if (reg.exec(value)) {
		return true;
	} else {
		return false;
	}
};
const changeCalData = function (
	sign: number,
	calData: calDataType
): calDataType {
	const oldDate = new Date(calData[0], calData[1]);
	const newDate = oldDate.setMonth(oldDate.getMonth() + sign);
	return getYearMonthDay(newDate);
};

const changeCalYear = function (sign: number, calData: calDataType) {
	const oldDate = new Date(calData[0], calData[1]);
	const newDate = oldDate.setFullYear(oldDate.getFullYear() + sign);
	return getYearMonthDay(newDate);
};

const getYearMonthDay = function (date: number): calDataType {
	let tmp = new Date(date);
	return [tmp.getFullYear(), tmp.getMonth(), tmp.getDate()];
};
const generateDate = (calData: calDataType) => {
	return `${calData[0]}-${calData[1] + 1}-${calData[2]}`
}


export function DatePicker(props: DatePickerProps) {
	const { initDate, callback, delay = 100, style, classname } = props

	const [calData, setCalData] = useState<calDataType>(() => [
		new Date().getFullYear(),
		new Date().getMonth(),
		new Date().getDate()
	]);
	const [state, setState] = useState(() => {
		if (initDate && validateDate(initDate)) {
			return initDate;
		} else {
			return generateDate(calData);
		}
	});
	useEffect(() => {
		if (callback) callback(state);
	}, [callback, state]);
	const handleBlur = () => {
		if (state !== generateDate(calData)) {
			//如果相等，说明是calData赋值上去的
			let res = validateDate(state); //验证格式
			if (!res) {
				//错误用原来的
				setState(generateDate(calData));
			} else {
				//否则计算新值
				let p = state.split("-");
				let newDate = new Date(
					parseInt(p[0]),
					parseInt(p[1]) - 1,
					parseInt(p[2])
				);
				const newCal: calDataType = [
					newDate.getFullYear(),
					newDate.getMonth(),
					newDate.getDate(),
				];
				setCalData(newCal);
				setState(generateDate(newCal));
			}
		}
	};
	const [mode, setMode] = useState<modeType>('date')
	const [show, setShow] = useState(false);
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setState(e.target.value);
	};
	const handleClick = () => {
		console.log(mode)
		setShow(true);
	};
	const modeMonth = (
		<MonthWrapper
			style={{ display: mode === "month" ? "flex" : "none" }}
		>
			{MonthData.map((v, i) => {
				return (
					<MonthItem
						key={i}
						onClick={() => {
							//获取当前月，与点击相减得差
							let diff = v - calData[1] - 1;
							let res = changeCalData(diff, calData);
							setCalData(res);
							setMode("date");
						}}
					>
						{v}月
					</MonthItem>
				);
			})}
		</MonthWrapper>
	);
	const ref = useRef<HTMLDivElement>(null);
	const startYear = getStartYear(calData);
	const yearMap = new Array(12).fill(1).map((_x, y) => startYear + y - 1);
	const modeYear = (
		<MonthWrapper
			style={{ display: mode === "year" ? "flex" : "none" }}
		>
			{yearMap.map((v, i) => (
				<MonthItem
					toGrey={i === 0 || i === 11}
					key={i}
					onClick={() => {
						//获取选择的年与差值
						let diff = v - calData[0];
						let res = changeCalYear(diff, calData);
						setCalData(res);
						setMode("month");
					}}
				>
					{v}
				</MonthItem>
			))}
		</MonthWrapper>
	);

	const [st, setst, unmount] = useStateAnimation(setShow, 200);
	useClickOutside(ref, () => setst(false));

	const dayData = useMemo(() => {
		const arr = getDateData(2020, 8, 1); //传的8实际是9
		return arr;
	}, []);
	const modeDay = (
		<table style={{ display: mode === "date" ? "flex" : "none", flexDirection: "column" }}>
			<thead>
				<tr>
					<CalendarHeadItem>日</CalendarHeadItem>
					<CalendarHeadItem>一</CalendarHeadItem>
					<CalendarHeadItem>二</CalendarHeadItem>
					<CalendarHeadItem>三</CalendarHeadItem>
					<CalendarHeadItem>四</CalendarHeadItem>
					<CalendarHeadItem>五</CalendarHeadItem>
					<CalendarHeadItem>六</CalendarHeadItem>
				</tr>
			</thead>
			<tbody>
				{dayData.map((v, index) => (
					<CalendarDateRow key={index}>
						{v.map((k, i) => (
							<CalendarDate
								isonDay={k.isonDay}
								isonMonth={k.isonMonth}
								key={i}
								onClick={() => {
									const origin = k.origin;
									const newCal: calDataType = [
										origin.getFullYear(),
										origin.getMonth(),
										origin.getDate(),
									];
									setCalData(newCal);
									setState(generateDate(newCal));
									setst(false);
								}}
							>
								{k.day}
							</CalendarDate>
						))}
					</CalendarDateRow>
				))}
			</tbody>
		</table>
	);

	const render = useMemo(() => {
		const handleLeft = () => {
			let res: calDataType;
			if (mode === "date") {
				res = changeCalData(-1, calData);
			} else if (mode === "month") {
				res = changeCalYear(-1, calData);
			} else {
				res = changeCalYear(-10, calData);
			}
			setCalData(res);
		};
		const handleRight = () => {
			let res: calDataType;
			if (mode === "date") {
				res = changeCalData(1, calData);
			} else if (mode === "month") {
				res = changeCalYear(1, calData);
			} else {
				res = changeCalYear(10, calData);
			}
			setCalData(res);
		};
		if (!show) {
			unmount();
			return null;
		} else {
			return (
				<CalendarWrapper visible={st} delay={delay}>
					<CalendarHeadWrapper>
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								width: "240px",
							}}
						>
							<BtnDiv style={{ marginLeft: "20px" }}>
								<Button
									size="small"
									style={btnStyle}
									onClick={() => handleLeft()}
								>
									<IconWrapper>
										<Icon icon="arrowleft"></Icon>
									</IconWrapper>
								</Button>
							</BtnDiv>
							<BtnDiv style={{ flex: 1 }}>
								<span>
									<Bwrapper
										style={{
											display:
												mode === "year"
													? "inline-block"
													: "none",
										}}
									>{`${startYear}-${startYear +
										9}`}</Bwrapper>

									<Bwrapper
										onClick={() => {
											setMode("year");
										}}
										style={{
											display:
												mode === "month" ||
													mode === "date"
													? "inline-block"
													: "none",
										}}
									>{`${calData[0]}年`}</Bwrapper>

									<Bwrapper
										onClick={() => {
											setMode("month");
										}}
										style={{
											display:
												mode === "date"
													? "inline-block"
													: "none",
										}}
									>{`${calData[1] + 1}月`}</Bwrapper>
								</span>
							</BtnDiv>
							<BtnDiv style={{ marginRight: "20px" }}>
								<Button
									size="small"
									style={btnStyle}
									onClick={() => handleRight()}
								>
									<IconWrapper>
										<Icon icon="arrowright"></Icon>
									</IconWrapper>
								</Button>
							</BtnDiv>
						</div>

						<div
							style={{
								width: "240px",
								display: "flex",
								justifyContent: "center",
							}}
						>
							{modeDay}
							{modeMonth}
							{modeYear}
						</div>
					</CalendarHeadWrapper>
				</CalendarWrapper>
			);
		}
	}, [show, mode, calData, unmount, st, delay, startYear, modeDay, modeMonth, modeYear]);



	return (
		<DatePickerWrapper ref={ref} onClick={handleClick}>
			<input
				aria-label="date picker"
				onBlur={handleBlur}
				value={state}
				onChange={handleChange}
				style={{ border: "none", boxShadow: "none", outline: "none" }}
			></input>
			<CalendarIcon>
				<Icon icon="calendar"></Icon>
			</CalendarIcon>
			{render}
		</DatePickerWrapper>
	);
}

export type DatePickerProps = {
	/** 日期选择的回调 */
	callback?: (v: string) => void;
	/**  动画速度 */
	delay?: number;
	/** 初始值*/
	initDate?: string;
	/** 外层样式*/
	style?: CSSProperties;
	/** 外层类名 */
	classname?: string;
};