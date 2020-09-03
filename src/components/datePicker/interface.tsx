export interface DateItem {
	day: number; //天
	isonMonth: boolean; //当月
	isonDay: boolean; //当日
	origin: Date;
}
export type modeType = 'date' | 'month' | 'year'
export type calDataType = [number, number, number];
