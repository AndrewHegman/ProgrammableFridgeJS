import React, { Component } from "react";
import LCDEmulator from "./LCDEmulator";
import {
	getCurrentTemperature,
	getTargetTemperature,
	setTargetTemperature
} from "../API/TemperatureQueries";

class LCDEmulatorConatiner extends Component {
	render() {
		return <LCDEmulator {...this.props} />;
	}
}

export default LCDEmulatorConatiner;
