export class becBattery{
	sw_version: string;
	hw_version: string;
	name: string;
	type: string;
	serial: string;
	partnumber: string;

	constructor(){
		this.sw_version = "";
		this.hw_version = "";
		this.name = "";
		this.type = "";
		this.serial = "";
		this.partnumber = "";
	}
}

export class becUI{
	sw_version: string;
	name: string;
	serial: string;
	partnumber: string;
	lastsync: number|null;
	uploaduntil: number|null;

	constructor(){
		this.sw_version = "";
		this.name = "";
		this.serial = "";
		this.partnumber = "";
		this.lastsync = null;
		this.uploaduntil = null;
	}
}

export class becDriveUnit{
	name: string;
	sw_version: string;
	hw_version: string;
	serial: string;
	partnumber: string;
	lockservice: number;

	constructor(){
		this.name = "";
		this.sw_version = "";
		this.hw_version = "";
		this.serial = "";
		this.partnumber = "";
		this.lockservice = 0;
	}
}

export class becBike{
	name: string;
	manufacturer: string;
	DriveUnit: becDriveUnit;
	UIs: Array<becUI>|null;
	Batteries: Array<becBattery>|null;
	isValid: boolean;

	constructor(json: string){
		this.isValid = false;
		this.UIs = null;
		this.Batteries = null;
		this.DriveUnit = new becDriveUnit();
		const jsonObj = JSON.parse(json);
		this.name = jsonObj?.drive_unit?.device_name || "";
		this.manufacturer = jsonObj?.drive_unit?.bike_manufacturer_name || "";
		this.DriveUnit.name = jsonObj?.drive_unit?.product_line_name || "";
		this.DriveUnit.sw_version = jsonObj?.drive_unit?.software_version || "";
		this.DriveUnit.hw_version = jsonObj?.drive_unit?.hardware_version || "";
		this.DriveUnit.serial = jsonObj?.drive_unit?.serial || "";
		this.DriveUnit.partnumber = jsonObj?.drive_unit?.part_number || "";
		this.DriveUnit.lockservice = jsonObj?.drive_unit?.lock_service_enabled || 0;
		jsonObj?.buis?.forEach((element: {[key: string]: string|number|Date  })  => {
			const currBUI = new becUI();
			currBUI.name = element.device_name as string || "";
			currBUI.sw_version = element.software_version as string || "";
			currBUI.serial = element.serial as string || "";
			currBUI.partnumber = element.part_number as string || "";
			currBUI.lastsync = parseInt(element.last_synced as string) || null;
			currBUI.uploaduntil = parseInt(element.activities_uploaded_until as string) || null;
			if (Array.isArray(this.UIs)){
				this.UIs?.push(currBUI);
			}else{
				this.UIs = Array(currBUI);
			}
		});
		jsonObj?.batteries?.forEach((element: {[key: string]: string  }) => {
			const CurrBatt = new becBattery();
			CurrBatt.name = element.device_name || "";
			CurrBatt.sw_version = element.software_version || "";
			CurrBatt.hw_version = element.hardware_version || "";
			CurrBatt.serial = element.serial || "";
			CurrBatt.partnumber = element.part_number || "";
			CurrBatt.type = element.type || "";
			if (Array.isArray(this.Batteries)){
				this.Batteries?.push(CurrBatt);
			}else{
				this.Batteries = Array(CurrBatt);
			}
		});
		this.isValid = true;
	}
}
