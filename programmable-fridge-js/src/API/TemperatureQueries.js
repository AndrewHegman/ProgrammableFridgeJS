import axios from "axios";

axios.defaults.baseURL = "http://localhost:3030";
axios.defaults.withCredentials = true;

export const getCurrentTemperature = async () => {
	try {
		return await axios.get("/currenttemperature");
	} catch (error) {
		return error;
	}
};

export const getTargetTemperature = async () => {
	try {
		return await axios.get("/targettemperature");
	} catch (error) {
		return error;
	}
};

export const setTargetTemperature = async () => {
	try {
		return await axios.put("/targettemperature");
	} catch (error) {
		return error;
	}
};
