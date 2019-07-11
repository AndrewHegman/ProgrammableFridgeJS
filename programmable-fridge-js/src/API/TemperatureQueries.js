import axios from "axios";

axios.defaults.baseURL = "http://localhost:3030";
axios.defaults.withCredentials = true;

export const getCurrentTemperature = async () => {
	try {
		return await axios.get("/temperature/current");
	} catch (error) {
		return error;
	}
};

export const getTargetTemperature = async () => {
	try {
		return await axios.get("/temperature/target");
	} catch (error) {
		return error;
	}
};

export const setTargetTemperature = async () => {
	try {
		return await axios.put("/temperature/target");
	} catch (error) {
		return error;
	}
};
