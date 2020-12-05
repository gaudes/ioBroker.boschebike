"use strict";
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
exports.becConnection = void 0;
//#region Imports
const axios_1 = __importDefault(require("axios"));
const Cookies = __importStar(require("cookie"));
//#endregion
//#region Variables
// Bosch eBike Connect URLs
const becBaseUrl = "https://www.ebike-connect.com/ebikeconnect/api/";
const becURLLogin = "portal/login/public";
const becURLCheck = "api_version";
// Global variables
let becAuthCookie = false;
const bec = axios_1.default.create({
    baseURL: becBaseUrl
});
//#endregion
//#region Interface
var ResultCategory;
(function (ResultCategory) {
    ResultCategory["Connection"] = "Connection";
})(ResultCategory || (ResultCategory = {}));
//#endregion
async function becConnectionCheck() {
    return await (bec.get(becURLCheck, { headers: { "Protect-From": "CSRF" } })
        .then((_response) => {
        becAuthCookie = true;
        return { state: true, text: "Connected", category: ResultCategory.Connection, isError: false };
    })
        .catch((error) => {
        becAuthCookie = false;
        return { state: false, text: `${JSON.stringify(error)}`, category: ResultCategory.Connection, isError: true };
    }));
}
async function becConnectionLogin(user_name, user_password) {
    return await (bec.post(becURLLogin, { "username": user_name, "password": user_password, "rememberme": false })
        .then((response) => {
        if (response.data["user"]["email"] === user_name) {
            const becCookie = Cookies.parse(response.headers["set-cookie"][0]);
            bec.defaults.headers.Cookie = `JSESSIONID=${becCookie.JSESSIONID}`;
            bec.defaults.headers["DNT"] = 1;
            becAuthCookie = true;
            return { state: true, text: "Login to Bosch eBike Connect successfull", category: ResultCategory.Connection, isError: false };
        }
        else {
            return { state: false, text: JSON.stringify(response.data), category: ResultCategory.Connection, isError: true };
        }
    })
        .catch((error) => {
        // return {state: false, text: error.response?.statusText}
        if (error.response.status === 403) {
            return { state: false, text: "Wrong username or password for Bosch eBike Connect", category: ResultCategory.Connection, isError: false };
        }
        else {
            return { state: false, text: `Login: ${error}`, category: ResultCategory.Connection, isError: true };
        }
    }));
}
async function becConnection(user_name, user_password) {
    if (becAuthCookie === true) {
        const becConnectionState = await becConnectionCheck();
        if (becConnectionState.state === true) {
            return becConnectionState;
        }
        else {
            becAuthCookie = false;
            return await becConnectionLogin(user_name, user_password);
        }
    }
    else {
        return await becConnectionLogin(user_name, user_password);
    }
}
exports.becConnection = becConnection;
//# sourceMappingURL=connection.js.map