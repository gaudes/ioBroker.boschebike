//#region Imports
import axios from "axios";
import {
	AxiosInstance,
	AxiosResponse,
	AxiosError,
} from "axios";
import * as Cookies from "cookie";
//#endregion

//#region Variables
// Bosch eBike Connect URLs
const becBaseUrl = "https://www.ebike-connect.com/ebikeconnect/api/";
const becURLLogin = "portal/login/public";
const becURLCheck = "api_version"
// Global variables
let becAuthCookie = false;
const bec: AxiosInstance = axios.create({
	baseURL: becBaseUrl
})
//#endregion

//#region Interface
enum ResultCategory{
	Connection = "Connection"
}
export interface result{
	state: boolean;
	text: string;
	category: ResultCategory;
	isError: boolean;
}
//#endregion

async function becConnectionCheck(): Promise<result> {
	return await (bec.get(becURLCheck,{headers:{ "Protect-From": "CSRF" }})
		.then((_response: AxiosResponse) => {
			becAuthCookie = true;
			return {state: true, text: "Connected", category: ResultCategory.Connection, isError: false } ;
		})
		.catch ((error: AxiosError ) => {
			becAuthCookie = false;
			return {state: false, text: `${JSON.stringify(error)}`, category: ResultCategory.Connection, isError: true };
		}));
}

async function becConnectionLogin(user_name: string, user_password: string): Promise<result>{
	return await (bec.post(becURLLogin ,{"username":user_name, "password":user_password, "rememberme": false} )
		.then((response: AxiosResponse) => {
			if (response.data["user"]["email"] === user_name){
				const becCookie: any = Cookies.parse(response.headers["set-cookie"][0] );
				bec.defaults.headers.Cookie = `JSESSIONID=${becCookie.JSESSIONID}`;
				bec.defaults.headers["DNT"] = 1;
				becAuthCookie = true;
				return{state: true, text: "Login to Bosch eBike Connect successfull", category: ResultCategory.Connection, isError: false} ;
			} else{
				return{state: false, text: JSON.stringify(response.data), category: ResultCategory.Connection, isError: true} ;
			}
		})
		.catch ((error) => {
			// return {state: false, text: error.response?.statusText}
			if (error.response!.status === 403){
				return {state: false, text: "Wrong username or password for Bosch eBike Connect", category: ResultCategory.Connection, isError: false}
			} else {
				return {state: false, text: `Login: ${error}`, category: ResultCategory.Connection, isError: true};
			}
		}));
}

export async function becConnection(user_name: string, user_password: string): Promise<result>{
	if (becAuthCookie === true){
		const becConnectionState = await becConnectionCheck();
		if ( becConnectionState.state === true){
			return becConnectionState;
		} else{
			becAuthCookie = false;
			return await becConnectionLogin(user_name, user_password);
		}
	} else{
		return await becConnectionLogin(user_name, user_password);
	}
}
