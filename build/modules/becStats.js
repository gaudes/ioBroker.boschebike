"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.becStats = exports.becStatsMonth = void 0;
class becStatsMonth {
    constructor() {
        this.month = 0;
        this.distance_meter = 0;
        this.distance_kilometer = 0;
        this.avgspeed = 0;
        this.calories = 0;
        this.elevation = 0;
    }
}
exports.becStatsMonth = becStatsMonth;
class becStats {
    constructor(json) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        this.isValid = false;
        const jsonObj = JSON.parse(json);
        this.total_distance_meter = ((_a = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.total_statistics) === null || _a === void 0 ? void 0 : _a.distance) || 0;
        this.total_distance_kilometer = Math.round((((_b = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.total_statistics) === null || _b === void 0 ? void 0 : _b.distance) || 0) / 1000);
        this.total_elevation = ((_c = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.total_statistics) === null || _c === void 0 ? void 0 : _c.elevation_gain) || 0;
        this.best_month = (jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.best_month) || 0;
        this.best_year = (jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.best_year) || 0;
        this.best_monthdistance_meter = (jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.best_month_distance) || 0;
        this.best_monthdistance_kilometer = Math.round(((jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.best_month_distance) || 0) / 1000);
        this.month_current = new becStatsMonth();
        this.month_current.month = ((_d = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.current_month) === null || _d === void 0 ? void 0 : _d.month) || 0;
        this.month_current.distance_meter = ((_e = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.current_month) === null || _e === void 0 ? void 0 : _e.distance) || 0;
        this.month_current.distance_kilometer = Math.round((((_f = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.current_month) === null || _f === void 0 ? void 0 : _f.distance) || 0) / 1000);
        this.month_current.avgspeed = (((_g = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.current_month) === null || _g === void 0 ? void 0 : _g.average_speed) || 0).toFixed(2);
        this.month_current.calories = ((_h = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.current_month) === null || _h === void 0 ? void 0 : _h.calories_burned) || 0;
        this.month_current.elevation = ((_j = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.current_month) === null || _j === void 0 ? void 0 : _j.elevation_gain) || 0;
        this.month_last = new becStatsMonth();
        this.month_last.month = ((_k = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.current_month) === null || _k === void 0 ? void 0 : _k.month) || 0;
        this.month_last.distance_meter = ((_l = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.current_month) === null || _l === void 0 ? void 0 : _l.distance) || 0;
        this.month_last.distance_kilometer = Math.round((((_m = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.current_month) === null || _m === void 0 ? void 0 : _m.distance) || 0) / 1000);
        this.month_last.avgspeed = (((_o = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.current_month) === null || _o === void 0 ? void 0 : _o.average_speed) || 0).toFixed(2);
        this.month_last.calories = ((_p = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.current_month) === null || _p === void 0 ? void 0 : _p.calories_burned) || 0;
        this.month_last.elevation = ((_q = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.current_month) === null || _q === void 0 ? void 0 : _q.elevation_gain) || 0;
        this.isValid = true;
    }
}
exports.becStats = becStats;
//# sourceMappingURL=becStats.js.map