export class becStatsMonth{
	month: number;
	distance_meter: number;
	distance_kilometer: number;
	avgspeed: number;
	calories: number;
	elevation: number;

	constructor(){
		this.month = 0;
		this.distance_meter = 0;
		this.distance_kilometer = 0;
		this.avgspeed = 0;
		this.calories = 0;
		this.elevation = 0;
	}
}

export class becStats{
	total_distance_meter: number;
	total_distance_kilometer: number;
	total_elevation: number;
	best_month: number;
	best_year: number;
	best_monthdistance_meter: number;
	best_monthdistance_kilometer: number;
	month_current: becStatsMonth;
	month_last: becStatsMonth;
	isValid: boolean;

	constructor(json: string){
		this.isValid = false;
		const jsonObj = JSON.parse(json);
		this.total_distance_meter = jsonObj?.total_statistics?.distance || 0;
		this.total_distance_kilometer = Math.round((jsonObj?.total_statistics?.distance || 0) / 1000);
		this.total_elevation = jsonObj?.total_statistics?.elevation_gain || 0;
		this.best_month = jsonObj?.best_month || 0;
		this.best_year = jsonObj?.best_year || 0;
		this.best_monthdistance_meter = jsonObj?.best_month_distance || 0;
		this.best_monthdistance_kilometer = Math.round((jsonObj?.best_month_distance || 0) / 1000);
		this.month_current = new becStatsMonth();
		this.month_current.month = jsonObj?.current_month?.month || 0;
		this.month_current.distance_meter = jsonObj?.current_month?.distance || 0;
		this.month_current.distance_kilometer = Math.round((jsonObj?.current_month?.distance || 0) / 1000);
		this.month_current.avgspeed = (jsonObj?.current_month?.average_speed || 0).toFixed(2);
		this.month_current.calories = jsonObj?.current_month?.calories_burned || 0;
		this.month_current.elevation = jsonObj?.current_month?.elevation_gain || 0;
		this.month_last = new becStatsMonth();
		this.month_last.month = jsonObj?.current_month?.month || 0;
		this.month_last.distance_meter = jsonObj?.current_month?.distance || 0;
		this.month_last.distance_kilometer = Math.round((jsonObj?.current_month?.distance || 0) / 1000);
		this.month_last.avgspeed = (jsonObj?.current_month?.average_speed || 0).toFixed(2);
		this.month_last.calories = jsonObj?.current_month?.calories_burned || 0;
		this.month_last.elevation = jsonObj?.current_month?.elevation_gain || 0;
		this.isValid = true;
	}
}