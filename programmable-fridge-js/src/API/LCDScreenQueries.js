import axios from "axios";

axios.defaults.baseURL = "localhost:3030";
axios.defaults.withCredentials = true;

export const getCurrentScreen = async () => {
	try {
		return await axios.get("/screen");
	} catch (error) {
		return error;
	}
};

export const setCurrentScreen = async () => {
	try {
		return await axios.put("/screen");
	} catch (error) {
		return error;
	}
};
