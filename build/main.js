"use strict";
/*
 * Created with @iobroker/create-adapter v1.31.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//#region Imports, Variables and Global
const utils = __importStar(require("@iobroker/adapter-core"));
const axios_1 = __importDefault(require("axios"));
const Cookies = __importStar(require("cookie"));
const becUser = __importStar(require("./modules/becUser"));
const becBikes = __importStar(require("./modules/becBikes"));
const becStats = __importStar(require("./modules/becStats"));
const iobObjectHelper = __importStar(require("iobroker-object-helper"));
const SentryObj = __importStar(require("@sentry/types"));
const MsgErrUnknown = "Unknown Error";
const MsgErrUserInfo = "Received unknown response for User Information by Bosch eBike Connect";
const MsgErrLogin = "Wrong username or password for Bosch eBike Connect";
const MsgErrConnection = "Connection to Bosch eBike Connect failed, probably no internet connection";
const MsgErrBoschSide = "Invalid status return of Bosch eBike Connect, proable site down or failed";
const MsgInfoLogin = "Login to Bosch eBike Connect successfull";
let Sentry = null;
//#endregion
class Boschebike extends utils.Adapter {
    //#region Basic Adapter Functions
    constructor(options = {}) {
        super({
            ...options,
            name: "boschebike",
        });
        //#endregion
        //#region Timer and Action
        this.tUpdateTimeout = null;
        //#endregion
        //#region Bosch eBike Connect Functions
        //#region Variables
        // Bosch eBike Connect URLs
        this.becBaseUrl = "https://www.ebike-connect.com/ebikeconnect/api/";
        this.becURLLogin = "portal/login/public";
        this.becURLCheck = "api_version";
        this.becURLUserInfo = "user/full";
        this.becURLBikeInfo = "portal/devices/my_ebikes";
        this.becURLStatData = "portal/statistics/box";
        // Connection State for internal use
        this.becConnectionState = false;
        // Axios instance with options
        this.bec = axios_1.default.create({
            baseURL: this.becBaseUrl
        });
        this.on("ready", this.onReady.bind(this));
        this.on("unload", this.onUnload.bind(this));
    }
    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        try {
            // Init Sentry
            if (this.supportsFeature && this.supportsFeature("PLUGINS")) {
                const sentryInstance = this.getPluginInstance("sentry");
                if (sentryInstance) {
                    Sentry = sentryInstance.getSentryObject();
                }
            }
            // Reset the connection indicator during startup
            this.setState("info.connection", false, true);
            // Starting Timer action
            this.updateTimer();
        }
        catch (err) {
            this.ReportingError(err, MsgErrUnknown, "onReady");
        }
    }
    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    onUnload(callback) {
        try {
            clearTimeout(this.tUpdateTimeout);
            callback();
        }
        catch (e) {
            callback();
        }
    }
    updateTimer() {
        this.ReportingInfo("Debug", "Adapter", "Timer occured");
        try {
            this.tUpdateTimeout && clearTimeout(this.tUpdateTimeout);
        }
        catch (err) {
            this.ReportingError(err, MsgErrUnknown, "updateTime", "Clear Timer");
        }
        try {
            this.updateBEC();
        }
        catch (err) {
            this.ReportingError(err, MsgErrUnknown, "updateTime", "Call Timer Action");
        }
        try {
            this.tUpdateTimeout = setTimeout(() => {
                this.updateTimer();
            }, (this.config.update_interval * 1 * 1000));
            //TODO: FIX INTERVAL * 60 * 1000 ^^
        }
        catch (err) {
            this.ReportingError(err, MsgErrUnknown, "updateTime", "Set Timer");
        }
    }
    async updateBEC() {
        try {
            if (await this.becConnection() === true) {
                this.ReportingInfo("Debug", "Connection", "Still connected");
                if (this.config.info_user)
                    await this.becGetUserInfo();
                if (this.config.info_ebike)
                    await this.becGetBikeInfo();
                await this.becGetStatsInfo();
                this.ReportingInfo("Info", "Adapter", "Bosch eBike information updated");
            }
        }
        catch (err) {
            this.ReportingError(err, MsgErrUnknown, "updateBEC");
        }
    }
    //#endregion
    /**
     * Receives Information about user from Bosch eBike Connect
     */
    async becGetUserInfo() {
        var _a;
        try {
            if (await this.becConnection() === true) {
                this.ReportingInfo("Debug", "UserInfo", "Starting becGetUserInfo");
                const becResult = await (this.bec.get(this.becURLUserInfo));
                if (becResult.data["user"]["email"] === this.config.user_name) {
                    this.ReportingInfo("Debug", "UserInfo", "UserInfo received", { JSON: becResult.data });
                    const iobResult = Array(iobObjectHelper.buildObject(this, { id: "user", name: "user", objectType: "template", template: "channel" }));
                    iobResult.push(iobObjectHelper.buildObject(this, { id: "info", name: "Information", objectType: "template", template: "channel" }));
                    iobResult.push(iobObjectHelper.buildObject(this, { id: "info.json_user", name: "json_user", value: JSON.stringify(becResult.data), objectType: "template", template: "json" }));
                    const becUserInfo = new becUser.becUser(JSON.stringify(becResult.data));
                    if (becUserInfo.isValid === false) {
                        this.ReportingError(null, MsgErrUserInfo, "becGetUserInfo", "", becResult.data);
                    }
                    else {
                        // Basic informations
                        iobResult.push(iobObjectHelper.buildObject(this, { id: "user.id", name: "userid", value: becUserInfo.userid, objectType: "state", role: "value", description: "Numeric User-ID" }));
                        iobResult.push(iobObjectHelper.buildObject(this, { id: "user.namefirst", name: "namefirst", value: becUserInfo.namefirst, objectType: "state", role: "text", description: "First Name" }));
                        iobResult.push(iobObjectHelper.buildObject(this, { id: "user.namelast", name: "namelast", value: becUserInfo.namelast, objectType: "state", role: "text", description: "Last Name" }));
                        if (becUserInfo.birthday !== null) {
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "user.birthday", name: "birthday", value: ((_a = becUserInfo.birthday) === null || _a === void 0 ? void 0 : _a.toString()) || "", objectType: "state", role: "date", description: "Birthday" }));
                        }
                        iobResult.push(iobObjectHelper.buildObject(this, { id: "user.gender", name: "gender", value: becUserInfo.gender, objectType: "state", role: "state", description: "Gender" }));
                        iobResult.push(iobObjectHelper.buildObject(this, { id: "user.height", name: "height", value: becUserInfo.height, objectType: "state", role: "value", description: "Height" }));
                        iobResult.push(iobObjectHelper.buildObject(this, { id: "user.weight", name: "weight", value: becUserInfo.weight, objectType: "state", role: "value.health.weight", description: "weight" }));
                        // Home address
                        if (becUserInfo.addresshome.street !== "") {
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "user.homeaddress", name: "homeaddress", objectType: "template", template: "folder" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "user.homeaddress.street", name: "street", value: becUserInfo.addresshome.street, objectType: "state", role: "text", description: "Street" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "user.homeaddress.number", name: "number", value: becUserInfo.addresshome.number, objectType: "state", role: "text", description: "Number" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "user.homeaddress.city", name: "city", value: becUserInfo.addresshome.city, objectType: "state", role: "text", description: "City" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "user.homeaddress.state", name: "state", value: becUserInfo.addresshome.state, objectType: "state", role: "text", description: "State" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "user.homeaddress.country", name: "country", value: becUserInfo.addresshome.country, objectType: "state", role: "text", description: "Country" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "user.homeaddress.countrycode", name: "countrycode", value: becUserInfo.addresshome.countrycode, objectType: "state", role: "text", description: "Country Code" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "user.homeaddress.zip", name: "zip", value: becUserInfo.addresshome.zip, objectType: "state", role: "text", description: "Zip" }));
                            if (becUserInfo.addresshome.location.latitude !== 0 && becUserInfo.addresshome.location.longitude !== 0) {
                                iobResult.push(iobObjectHelper.buildObject(this, { id: "user.homeaddress.latitude", name: "latitude", value: becUserInfo.addresshome.location.latitude, objectType: "state", role: "value.gps.latitude", description: "Latitude" }));
                                iobResult.push(iobObjectHelper.buildObject(this, { id: "user.homeaddress.longitude", name: "longitude", value: becUserInfo.addresshome.location.longitude, objectType: "state", role: "value.gps.longitude", description: "Longitude" }));
                            }
                        }
                        // Work address
                        if (becUserInfo.addresswork.street !== "") {
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "user.workaddress", name: "homeaddress", objectType: "template", template: "folder" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "user.workaddress.street", name: "street", value: becUserInfo.addresswork.street, objectType: "state", role: "text", description: "Street" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "user.workaddress.number", name: "number", value: becUserInfo.addresswork.number, objectType: "state", role: "text", description: "Number" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "user.workaddress.city", name: "city", value: becUserInfo.addresswork.city, objectType: "state", role: "text", description: "City" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "user.workaddress.state", name: "state", value: becUserInfo.addresswork.state, objectType: "state", role: "text", description: "State" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "user.workaddress.country", name: "country", value: becUserInfo.addresswork.country, objectType: "state", role: "text", description: "Country" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "user.workaddress.countrycode", name: "countrycode", value: becUserInfo.addresswork.countrycode, objectType: "state", role: "text", description: "Country Code" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "user.workaddress.zip", name: "zip", value: becUserInfo.addresswork.zip, objectType: "state", role: "text", description: "Zip" }));
                            if (becUserInfo.addresshome.location.latitude !== 0 && becUserInfo.addresswork.location.longitude !== 0) {
                                iobResult.push(iobObjectHelper.buildObject(this, { id: "user.workaddress.latitude", name: "latitude", value: becUserInfo.addresswork.location.latitude, objectType: "state", role: "value.gps.latitude", description: "Latitude" }));
                                iobResult.push(iobObjectHelper.buildObject(this, { id: "user.workaddress.longitude", name: "longitude", value: becUserInfo.addresswork.location.longitude, objectType: "state", role: "value.gps.longitude", description: "Longitude" }));
                            }
                        }
                    }
                    this.ReportingInfo("Debug", "UserInfo", "UserInfo converted", { JSON: iobResult });
                    await iobObjectHelper.syncObjects(this, iobResult, { removeUnused: true, except: /(info.*|bike.*|statistics.*)/ });
                }
            }
        }
        catch (err) {
            this.ReportingError(err, MsgErrUnknown, "becGetUserInfo", "GetUserInfo");
        }
    }
    /**
     * Receives Information about eBike from Bosch eBike Connect
     */
    async becGetBikeInfo() {
        try {
            if (await this.becConnection() === true) {
                this.ReportingInfo("Debug", "UserInfo", "Starting becGetBikeInfo");
                const becResult = await (this.bec.get(this.becURLBikeInfo));
                if (becResult.data["my_ebikes"]) {
                    this.ReportingInfo("Debug", "BikeInfo", "BikeInfo received", { JSON: becResult.data });
                    const iobResult = Array(iobObjectHelper.buildObject(this, { id: "info", name: "Information", objectType: "template", template: "channel" }));
                    iobResult.push(iobObjectHelper.buildObject(this, { id: "info.json_bikes", name: "json_bikes", value: JSON.stringify(becResult.data["my_ebikes"]), objectType: "template", template: "json" }));
                    if (Array.isArray(becResult.data["my_ebikes"])) {
                        let CounterBikes = 0;
                        becResult.data["my_ebikes"].forEach(element => {
                            var _a, _b;
                            const becBikeInfo = new becBikes.becBike(JSON.stringify(element));
                            if (becBikeInfo.isValid === false) {
                                this.ReportingError(null, MsgErrUserInfo, "becGetBikeInfo", "", becResult.data);
                            }
                            else {
                                let CounterBikesOutput = "";
                                if (CounterBikes !== 0) {
                                    CounterBikesOutput = CounterBikes.toString();
                                }
                                iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}`, name: `${becBikeInfo.name}`, objectType: "template", template: "device" }));
                                iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.name`, name: "name", value: becBikeInfo.name, objectType: "state", role: "text", description: "Name" }));
                                iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.manufacturer`, name: "manufacturer", value: becBikeInfo.manufacturer, objectType: "state", role: "text", description: "Manufacturer" }));
                                iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.DriveUnit`, name: "DriveUnit", objectType: "template", template: "channel" }));
                                iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.DriveUnit.name`, name: "name", value: becBikeInfo.DriveUnit.name, objectType: "state", role: "text", description: "Name" }));
                                iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.DriveUnit.hw_version`, name: "hw_version", value: becBikeInfo.DriveUnit.hw_version, objectType: "state", role: "text", description: "Hardware version" }));
                                iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.DriveUnit.sw_version`, name: "sw_version", value: becBikeInfo.DriveUnit.sw_version, objectType: "state", role: "text", description: "Software version" }));
                                iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.DriveUnit.serial`, name: "serial", value: becBikeInfo.DriveUnit.serial, objectType: "state", role: "text", description: "Serial number" }));
                                iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.DriveUnit.partnumber`, name: "partnumber", value: becBikeInfo.DriveUnit.partnumber, objectType: "state", role: "text", description: "Part number" }));
                                iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.DriveUnit.lockservice`, name: "lockservice", value: becBikeInfo.DriveUnit.lockservice.toString(), objectType: "state", role: "value", description: "Lock service enabled" }));
                                let CounterUIs = 0;
                                (_a = becBikeInfo.UIs) === null || _a === void 0 ? void 0 : _a.forEach(element => {
                                    var _a, _b;
                                    let CounterUIsOutput = "";
                                    if (CounterUIs !== 0) {
                                        CounterUIsOutput = CounterBikes.toString();
                                    }
                                    iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.UI${CounterUIsOutput}`, name: element.name, objectType: "template", template: "channel" }));
                                    iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.UI${CounterUIsOutput}.name`, name: "name", value: element.name, objectType: "state", role: "text", description: "Name" }));
                                    iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.UI${CounterUIsOutput}.sw_version`, name: "sw_version", value: element.sw_version, objectType: "state", role: "text", description: "Software version" }));
                                    iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.UI${CounterUIsOutput}.serial`, name: "serial", value: element.serial, objectType: "state", role: "text", description: "Serial number" }));
                                    iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.UI${CounterUIsOutput}.partnumber`, name: "partnumber", value: element.partnumber, objectType: "state", role: "text", description: "Part number" }));
                                    iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.UI${CounterUIsOutput}.lastsync`, name: "lastsync", value: ((_a = element.lastsync) === null || _a === void 0 ? void 0 : _a.toString()) || "", objectType: "state", role: "date", description: "Last sync time" }));
                                    iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.UI${CounterUIsOutput}.uploaduntil`, name: "uploaduntil", value: ((_b = element.uploaduntil) === null || _b === void 0 ? void 0 : _b.toString()) || "", objectType: "state", role: "date", description: "Upload until time" }));
                                    CounterUIs++;
                                });
                                let CounterBatteries = 0;
                                (_b = becBikeInfo.Batteries) === null || _b === void 0 ? void 0 : _b.forEach(element => {
                                    let CounterBatteriesOutput = "";
                                    if (CounterBatteries !== 0) {
                                        CounterBatteriesOutput = CounterBikes.toString();
                                    }
                                    iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.Battery${CounterBatteriesOutput}`, name: element.name, objectType: "template", template: "channel" }));
                                    iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.Battery${CounterBatteriesOutput}.name`, name: "name", value: element.name, objectType: "state", role: "text", description: "Name" }));
                                    iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.Battery${CounterBatteriesOutput}.sw_version`, name: "sw_version", value: element.sw_version, objectType: "state", role: "text", description: "Software version" }));
                                    iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.Battery${CounterBatteriesOutput}.hw_version`, name: "hw_version", value: element.hw_version, objectType: "state", role: "text", description: "Hardware version" }));
                                    iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.Battery${CounterBatteriesOutput}.serial`, name: "serial", value: element.serial, objectType: "state", role: "text", description: "Serial number" }));
                                    iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.Battery${CounterBatteriesOutput}.partnumber`, name: "partnumber", value: element.partnumber, objectType: "state", role: "text", description: "Part number" }));
                                    iobResult.push(iobObjectHelper.buildObject(this, { id: `bike${CounterBikesOutput}.Battery${CounterBatteriesOutput}.type`, name: "type", value: element.partnumber, objectType: "state", role: "text", description: "Type" }));
                                    CounterBatteries++;
                                });
                            }
                            CounterBikes++;
                        });
                    }
                    this.ReportingInfo("Debug", "BikeInfo", "BikeInfo converted", { JSON: iobResult });
                    await iobObjectHelper.syncObjects(this, iobResult, { removeUnused: true, except: /(info.*|user.*|statistics.*)/ });
                }
            }
        }
        catch (err) {
            this.ReportingError(err, MsgErrUnknown, "becGetBikeInfo", "GetBikeInfo");
        }
    }
    /**
     * Receives Statistics Information from Bosch eBike Connect
     */
    async becGetStatsInfo() {
        try {
            if (await this.becConnection() === true) {
                this.ReportingInfo("Debug", "StatsInfo", "Starting becGetStatsInfo");
                const becResult = await (this.bec.get(this.becURLStatData));
                if (becResult.data["total_statistics"]) {
                    this.ReportingInfo("Debug", "StatsInfo", "StatsInfo received", { JSON: becResult.data });
                    const iobResult = Array(iobObjectHelper.buildObject(this, { id: "info", name: "Information", objectType: "template", template: "channel" }));
                    iobResult.push(iobObjectHelper.buildObject(this, { id: "info.json_stats", name: "json_stats", value: JSON.stringify(becResult.data), objectType: "template", template: "json" }));
                    const becStatsInfo = new becStats.becStats(JSON.stringify(becResult.data));
                    if (becStatsInfo.isValid === false) {
                        this.ReportingError(null, MsgErrUserInfo, "becGetStatsInfo", "", becResult.data);
                    }
                    else {
                        iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics", name: "Statistics", objectType: "template", template: "channel" }));
                        const iobObj_total_distance_meter = iobObjectHelper.buildObject(this, { id: "statistics.total_distance_meter", name: "total_distance_meter", value: becStatsInfo.total_distance_meter, objectType: "state", role: "value.distance", description: "Total distance in meters" });
                        iobObj_total_distance_meter.object.common.unit = "m";
                        iobResult.push(iobObj_total_distance_meter);
                        const iobObj_total_distance_kilometer = iobObjectHelper.buildObject(this, { id: "statistics.total_distance_kilometer", name: "total_distance_kilometer", value: becStatsInfo.total_distance_kilometer, objectType: "state", role: "value.distance", description: "Total distance in kilometers" });
                        iobResult.push(iobObj_total_distance_kilometer);
                        iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics.total_elevation", name: "total_elevation", value: becStatsInfo.total_elevation, objectType: "state", role: "value", description: "Total elevation gain" }));
                        iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics.best_month", name: "best_month", value: becStatsInfo.best_month, objectType: "state", role: "value", description: "Best month" }));
                        iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics.best_year", name: "best_year", value: becStatsInfo.best_year, objectType: "state", role: "value", description: "Best year" }));
                        iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics.best_monthdistance_meter", name: "best_monthdistance_meter", value: becStatsInfo.best_monthdistance_meter, objectType: "state", role: "value.distance", description: "Best distance in month in meters" }));
                        iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics.best_monthdistance_kilometer", name: "best_monthdistance_kilometer", value: becStatsInfo.best_monthdistance_kilometer, objectType: "state", role: "value.distance", description: "Best distance in month in kilometers" }));
                        if (becStatsInfo.month_current.month) {
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics.month_current", name: "month_current", objectType: "template", template: "folder" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics.month_current.month", name: "month", value: becStatsInfo.month_current.month, objectType: "state", role: "value", description: "Month" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics.month_current.distance_meter", name: "distance_meter", value: becStatsInfo.month_current.distance_meter, objectType: "state", role: "value.distance", description: "Distance in meters" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics.month_current.distance_kilometer", name: "distance_kilometer", value: becStatsInfo.month_current.distance_kilometer, objectType: "state", role: "value.distance", description: "Distance in kilometers" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics.month_current.elevation", name: "elevation", value: becStatsInfo.month_current.elevation, objectType: "state", role: "value", description: "Elevation gain" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics.month_current.avgspeed", name: "avgspeed", value: becStatsInfo.month_current.avgspeed, objectType: "state", role: "value.speed", description: "Average speed" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics.month_current.calories", name: "calories", value: becStatsInfo.month_current.calories, objectType: "state", role: "value.health.calories", description: "Burned calories" }));
                        }
                        if (becStatsInfo.month_last.month) {
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics.month_last", name: "month_last", objectType: "template", template: "folder" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics.month_last.month", name: "month", value: becStatsInfo.month_last.month, objectType: "state", role: "value", description: "Month" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics.month_last.distance_meter", name: "distance_meter", value: becStatsInfo.month_last.distance_meter, objectType: "state", role: "value.distance", description: "Distance in meters" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics.month_last.distance_kilometer", name: "distance_kilometer", value: becStatsInfo.month_last.distance_kilometer, objectType: "state", role: "value.distance", description: "Distance in kilometers" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics.month_last.elevation", name: "elevation", value: becStatsInfo.month_last.elevation, objectType: "state", role: "value", description: "Elevation gain" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics.month_last.avgspeed", name: "avgspeed", value: becStatsInfo.month_last.avgspeed, objectType: "state", role: "value.speed", description: "Average speed" }));
                            iobResult.push(iobObjectHelper.buildObject(this, { id: "statistics.month_last.calories", name: "calories", value: becStatsInfo.month_last.calories, objectType: "state", role: "value.health.calories", description: "Burned calories" }));
                        }
                    }
                    this.ReportingInfo("Debug", "StatsInfo", "StatsInfo converted", { JSON: iobResult });
                    await iobObjectHelper.syncObjects(this, iobResult, { removeUnused: true, except: /(info.*|user.*|bike.*)/ });
                }
            }
        }
        catch (err) {
            this.ReportingError(err, MsgErrUnknown, "becGetStatsInfo", "GetStatsInfo");
        }
    }
    /**
     * Helper function for Setting internal connection state and Adapter connection state.
     * Changes State only if different from current internal connection state
     * @param {Boolean} State State which should be set
     */
    becSetConnectionState(State) {
        try {
            if (this.becConnectionState !== State) {
                this.setState("info.connection", State, true);
                this.becConnectionState = State;
            }
        }
        catch (err) {
            this.ReportingError(err, MsgErrUnknown, "becSetConnectionState");
        }
    }
    /**
     * Checks current connection to Bosch eBike Connect by a simple query for api version
     */
    async becConnectionCheck() {
        var _a;
        try {
            const becResult = await (this.bec.get(this.becURLCheck));
            if (becResult.status === 200) {
                this.becSetConnectionState(true);
                return true;
            }
            else {
                this.becSetConnectionState(false);
                return false;
            }
        }
        catch (err) {
            if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 403) {
                this.becSetConnectionState(false);
                return false;
            }
            else if (err.code === "EAI_AGAIN" && err.syscall === "getaddrinfo") {
                this.log.error(MsgErrConnection);
                this.becSetConnectionState(false);
                return false;
            }
            else {
                this.ReportingError(err, MsgErrUnknown, "becConnectionCheck");
                this.becSetConnectionState(false);
                return false;
            }
        }
    }
    /**
     * Calls login to Bosch eBike Connect with User and Password. Authentication Cookie is added to further queries.
     */
    async becConnectionLogin() {
        var _a, _b;
        try {
            const becResult = await (this.bec.post(this.becURLLogin, { "username": this.config.user_name, "password": this.config.user_password, "rememberme": false }));
            if (becResult.data["user"]["email"] === this.config.user_name) {
                const becCookie = Cookies.parse(becResult.headers["set-cookie"][0]);
                this.bec.defaults.headers.Cookie = `JSESSIONID=${becCookie.JSESSIONID}`;
                this.bec.defaults.headers["DNT"] = 1;
                this.bec.defaults.headers["Protect-From"] = "CSRF";
                this.becSetConnectionState(true);
                this.ReportingInfo("Debug", "Connection", MsgInfoLogin);
                return true;
            }
            else {
                this.becSetConnectionState(false);
                return false;
            }
        }
        catch (err) {
            if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 403) {
                this.log.error(MsgErrLogin);
                this.becSetConnectionState(false);
                return false;
            }
            else if (((_b = err.response) === null || _b === void 0 ? void 0 : _b.status) >= 500) {
                this.log.error(MsgErrBoschSide);
                this.becSetConnectionState(false);
                return false;
            }
            else if (err.code === "EAI_AGAIN" && err.syscall === "getaddrinfo") {
                this.log.error(MsgErrConnection);
                this.becSetConnectionState(false);
                return false;
            }
            else {
                this.ReportingError(err, MsgErrUnknown, "becConnectionLogin");
                this.becSetConnectionState(false);
                return false;
            }
        }
    }
    /**
     * Overall Connection functions. Tests current connection, otherwise makes a login.
     * @param {String} user_name Username for login, typically email address
     * @param {String} user_password Password for login
     */
    async becConnection() {
        if (this.becConnectionState === true) {
            if (await this.becConnectionCheck() === true) {
                return true;
            }
            else {
                return await this.becConnectionLogin();
            }
        }
        else {
            return await this.becConnectionLogin();
        }
    }
    //#endregion
    //#region Helper Function ReportingError
    /**
     * Function for global error reporting
     * @param {Error} Err Error-Object
     * @param {string} FriendlyError Error message for user
     * @param {string} NameFunction Name of the function where error occured
     * @param {string} NameAction Name of the subfunction where error occured
     * @param {string} Info Contextual information
     * @param {boolean} ReportSentry Report error to sentry, default true
     */
    async ReportingError(Err, FriendlyError, NameFunction, NameAction = "", Info = "", ReportSentry = true) {
        try {
            let sErrMsg = `Error occured: ${FriendlyError} in ${NameFunction}`;
            if (NameAction !== "")
                sErrMsg = sErrMsg + `(${NameAction})`;
            if (Err !== null)
                sErrMsg = sErrMsg + ` [${Err}] [${Info}]`;
            this.log.error(sErrMsg);
        }
        catch (e) {
            this.log.error(`Exception in ErrorReporting [${e}]`);
        }
        // Sentry reporting
        try {
            if (Sentry && this.config.sentry_disable === false && ReportSentry === true) {
                Sentry && Sentry.withScope(scope => {
                    scope.setLevel(SentryObj.Severity.Error);
                    scope.setExtra("NameFunction", NameFunction);
                    scope.setExtra("NameAction", NameAction);
                    if (Info) {
                        scope.setExtra("Info", Info);
                    }
                    //scope.setExtra("Config", this.config);
                    if (Sentry) {
                        Sentry.captureException(Err);
                    }
                });
            }
        }
        catch (e) {
            this.log.error(`Exception in ErrorReporting Sentry [${e}]`);
        }
    }
    //#endregion
    //#region Helper Function ReportingInfo
    /**
     * Function for global information reporting
     * @param {"Info"|"Debug"} Level Level for ioBroker Logging
     * @param {string} Category Category of information
     * @param {string} Message Message
     * @param {{[Key: string]: any}|undefined} Data Contextual data information
     */
    ReportingInfo(Level, Category, Message, Data) {
        let iobMessage = Message;
        if (this.log.level === "debug" || this.log.level === "silly") {
            iobMessage = `[${Category}] ${Message}`;
        }
        switch (Level) {
            case "Debug":
                this.log.debug(iobMessage);
                break;
            default:
                this.log.info(iobMessage);
                break;
        }
        Sentry === null || Sentry === void 0 ? void 0 : Sentry.addBreadcrumb({
            category: Category,
            message: Message,
            level: Level,
            data: Data
        });
    }
}
if (module.parent) {
    // Export the constructor in compact mode
    module.exports = (options) => new Boschebike(options);
}
else {
    // otherwise start the instance directly
    (() => new Boschebike())();
}
//# sourceMappingURL=main.js.map