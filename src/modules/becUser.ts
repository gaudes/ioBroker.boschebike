export class becLocation{
	latitude: number;
	longitude: number

	constructor(){
		this.latitude = 0;
		this.longitude = 0;
	}
}

export class becAddress {
	street: string;
	number: string;
	city: string;
	state: string;
	country: string;
	countrycode: string;
	zip: string;
	location: becLocation;

	constructor(){
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

export class becUser {
	userid: number;
	email: string;
	namefirst: string;
	namelast: string;
	addresshome: becAddress;
	addresswork: becAddress;
	birthday: number|null;
	gender: string;
	height: number;
	weight: number;
	isValid: boolean;

	constructor(json: string){
		this.isValid = false;
		this.addresshome = new becAddress();
		this.addresswork = new becAddress();
		const jsonObj = JSON.parse(json);
		this.userid = parseInt(jsonObj?.user?.user_id) || 0;
		this.email = jsonObj?.user?.email || "";
		this.namefirst = jsonObj?.user?.first_name || "";
		this.namelast = jsonObj?.user?.last_name || "";
		this.birthday = Date.parse(jsonObj?.user?.date_of_birth) || null;
		this.gender = jsonObj?.user?.gender || "";
		this.height = parseInt(jsonObj?.user?.height) || 0;
		this.weight = parseInt(jsonObj?.user?.weight) || 0;
		this.addresshome.street = jsonObj?.user?.home_address?.street || "";
		this.addresshome.number = jsonObj?.user?.home_address?.number || "";
		this.addresshome.city = jsonObj?.user?.home_address?.city || "";
		this.addresshome.state = jsonObj?.user?.home_address?.state || "";
		this.addresshome.country = jsonObj?.user?.home_address?.country || "";
		this.addresshome.countrycode = jsonObj?.user?.home_address?.country_code || "";
		this.addresshome.zip = jsonObj?.user?.home_address?.zip || "";
		this.addresshome.location.latitude = jsonObj?.user?.home_address?.location?.latitude || 0;
		this.addresshome.location.longitude = jsonObj?.user?.home_address?.location?.longitude || 0;
		this.addresswork.street = jsonObj?.user?.work_address?.street || "";
		this.addresswork.number = jsonObj?.user?.work_address?.number || "";
		this.addresswork.city = jsonObj?.user?.work_address?.city || "";
		this.addresswork.state = jsonObj?.user?.work_address?.state || "";
		this.addresswork.country = jsonObj?.user?.work_address?.country || "";
		this.addresswork.countrycode = jsonObj?.user?.work_address?.country_code || "";
		this.addresswork.zip = jsonObj?.user?.work_address?.zip || "";
		this.addresswork.location.latitude = jsonObj?.user?.work_address?.location?.latitude || 0;
		this.addresswork.location.longitude = jsonObj?.user?.work_address?.location?.longitude || 0;
		this.isValid = true;
	}
}
