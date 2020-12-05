"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.becUser = exports.becAddress = exports.becLocation = void 0;
class becLocation {
    constructor() {
        this.latitude = 0;
        this.longitude = 0;
    }
}
exports.becLocation = becLocation;
class becAddress {
    constructor() {
        this.street = "";
        this.number = "";
        this.city = "";
        this.state = "";
        this.country = "";
        this.countrycode = "";
        this.zip = "";
        this.location = new becLocation();
    }
}
exports.becAddress = becAddress;
class becUser {
    constructor(json) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23;
        this.isValid = false;
        this.addresshome = new becAddress();
        this.addresswork = new becAddress();
        const jsonObj = JSON.parse(json);
        this.userid = parseInt((_a = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _a === void 0 ? void 0 : _a.user_id) || 0;
        this.email = ((_b = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _b === void 0 ? void 0 : _b.email) || "";
        this.namefirst = ((_c = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _c === void 0 ? void 0 : _c.first_name) || "";
        this.namelast = ((_d = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _d === void 0 ? void 0 : _d.last_name) || "";
        this.birthday = Date.parse((_e = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _e === void 0 ? void 0 : _e.date_of_birth) || null;
        this.gender = ((_f = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _f === void 0 ? void 0 : _f.gender) || "";
        this.height = parseInt((_g = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _g === void 0 ? void 0 : _g.height) || 0;
        this.weight = parseInt((_h = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _h === void 0 ? void 0 : _h.weight) || 0;
        this.addresshome.street = ((_k = (_j = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _j === void 0 ? void 0 : _j.home_address) === null || _k === void 0 ? void 0 : _k.street) || "";
        this.addresshome.number = ((_m = (_l = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _l === void 0 ? void 0 : _l.home_address) === null || _m === void 0 ? void 0 : _m.number) || "";
        this.addresshome.city = ((_p = (_o = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _o === void 0 ? void 0 : _o.home_address) === null || _p === void 0 ? void 0 : _p.city) || "";
        this.addresshome.state = ((_r = (_q = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _q === void 0 ? void 0 : _q.home_address) === null || _r === void 0 ? void 0 : _r.state) || "";
        this.addresshome.country = ((_t = (_s = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _s === void 0 ? void 0 : _s.home_address) === null || _t === void 0 ? void 0 : _t.country) || "";
        this.addresshome.countrycode = ((_v = (_u = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _u === void 0 ? void 0 : _u.home_address) === null || _v === void 0 ? void 0 : _v.country_code) || "";
        this.addresshome.zip = ((_x = (_w = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _w === void 0 ? void 0 : _w.home_address) === null || _x === void 0 ? void 0 : _x.zip) || "";
        this.addresshome.location.latitude = ((_0 = (_z = (_y = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _y === void 0 ? void 0 : _y.home_address) === null || _z === void 0 ? void 0 : _z.location) === null || _0 === void 0 ? void 0 : _0.latitude) || 0;
        this.addresshome.location.longitude = ((_3 = (_2 = (_1 = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _1 === void 0 ? void 0 : _1.home_address) === null || _2 === void 0 ? void 0 : _2.location) === null || _3 === void 0 ? void 0 : _3.longitude) || 0;
        this.addresswork.street = ((_5 = (_4 = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _4 === void 0 ? void 0 : _4.work_address) === null || _5 === void 0 ? void 0 : _5.street) || "";
        this.addresswork.number = ((_7 = (_6 = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _6 === void 0 ? void 0 : _6.work_address) === null || _7 === void 0 ? void 0 : _7.number) || "";
        this.addresswork.city = ((_9 = (_8 = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _8 === void 0 ? void 0 : _8.work_address) === null || _9 === void 0 ? void 0 : _9.city) || "";
        this.addresswork.state = ((_11 = (_10 = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _10 === void 0 ? void 0 : _10.work_address) === null || _11 === void 0 ? void 0 : _11.state) || "";
        this.addresswork.country = ((_13 = (_12 = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _12 === void 0 ? void 0 : _12.work_address) === null || _13 === void 0 ? void 0 : _13.country) || "";
        this.addresswork.countrycode = ((_15 = (_14 = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _14 === void 0 ? void 0 : _14.work_address) === null || _15 === void 0 ? void 0 : _15.country_code) || "";
        this.addresswork.zip = ((_17 = (_16 = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _16 === void 0 ? void 0 : _16.work_address) === null || _17 === void 0 ? void 0 : _17.zip) || "";
        this.addresswork.location.latitude = ((_20 = (_19 = (_18 = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _18 === void 0 ? void 0 : _18.work_address) === null || _19 === void 0 ? void 0 : _19.location) === null || _20 === void 0 ? void 0 : _20.latitude) || 0;
        this.addresswork.location.longitude = ((_23 = (_22 = (_21 = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.user) === null || _21 === void 0 ? void 0 : _21.work_address) === null || _22 === void 0 ? void 0 : _22.location) === null || _23 === void 0 ? void 0 : _23.longitude) || 0;
        this.isValid = true;
    }
}
exports.becUser = becUser;
//# sourceMappingURL=becUser.js.map