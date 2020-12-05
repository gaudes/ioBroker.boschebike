"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.becBike = exports.becDriveUnit = exports.becUI = exports.becBattery = void 0;
class becBattery {
    constructor() {
        this.sw_version = "";
        this.hw_version = "";
        this.name = "";
        this.type = "";
        this.serial = "";
        this.partnumber = "";
    }
}
exports.becBattery = becBattery;
class becUI {
    constructor() {
        this.sw_version = "";
        this.name = "";
        this.serial = "";
        this.partnumber = "";
        this.lastsync = null;
        this.uploaduntil = null;
    }
}
exports.becUI = becUI;
class becDriveUnit {
    constructor() {
        this.name = "";
        this.sw_version = "";
        this.hw_version = "";
        this.serial = "";
        this.partnumber = "";
        this.lockservice = 0;
    }
}
exports.becDriveUnit = becDriveUnit;
class becBike {
    constructor(json) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        this.isValid = false;
        this.UIs = null;
        this.Batteries = null;
        this.DriveUnit = new becDriveUnit();
        const jsonObj = JSON.parse(json);
        this.name = ((_a = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.drive_unit) === null || _a === void 0 ? void 0 : _a.device_name) || "";
        this.manufacturer = ((_b = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.drive_unit) === null || _b === void 0 ? void 0 : _b.bike_manufacturer_name) || "";
        this.DriveUnit.name = ((_c = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.drive_unit) === null || _c === void 0 ? void 0 : _c.product_line_name) || "";
        this.DriveUnit.sw_version = ((_d = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.drive_unit) === null || _d === void 0 ? void 0 : _d.software_version) || "";
        this.DriveUnit.hw_version = ((_e = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.drive_unit) === null || _e === void 0 ? void 0 : _e.hardware_version) || "";
        this.DriveUnit.serial = ((_f = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.drive_unit) === null || _f === void 0 ? void 0 : _f.serial) || "";
        this.DriveUnit.partnumber = ((_g = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.drive_unit) === null || _g === void 0 ? void 0 : _g.part_number) || "";
        this.DriveUnit.lockservice = ((_h = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.drive_unit) === null || _h === void 0 ? void 0 : _h.lock_service_enabled) || 0;
        (_j = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.buis) === null || _j === void 0 ? void 0 : _j.forEach((element) => {
            var _a;
            const currBUI = new becUI();
            currBUI.name = element.device_name || "";
            currBUI.sw_version = element.software_version || "";
            currBUI.serial = element.serial || "";
            currBUI.partnumber = element.part_number || "";
            currBUI.lastsync = parseInt(element.last_synced) || null;
            currBUI.uploaduntil = parseInt(element.activities_uploaded_until) || null;
            if (Array.isArray(this.UIs)) {
                (_a = this.UIs) === null || _a === void 0 ? void 0 : _a.push(currBUI);
            }
            else {
                this.UIs = Array(currBUI);
            }
        });
        (_k = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.batteries) === null || _k === void 0 ? void 0 : _k.forEach((element) => {
            var _a;
            const CurrBatt = new becBattery();
            CurrBatt.name = element.device_name || "";
            CurrBatt.sw_version = element.software_version || "";
            CurrBatt.hw_version = element.hardware_version || "";
            CurrBatt.serial = element.serial || "";
            CurrBatt.partnumber = element.part_number || "";
            CurrBatt.type = element.type || "";
            if (Array.isArray(this.Batteries)) {
                (_a = this.Batteries) === null || _a === void 0 ? void 0 : _a.push(CurrBatt);
            }
            else {
                this.Batteries = Array(CurrBatt);
            }
        });
        this.isValid = true;
    }
}
exports.becBike = becBike;
//# sourceMappingURL=becBikes.js.map