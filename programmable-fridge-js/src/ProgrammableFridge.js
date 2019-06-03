import React, { Component } from "react";

import LCDEmulator from "./LCDEmulator/LCDEmulator";
import ControlButtons from "./ControlButtons/ControlButtonContainer";

import { getCurrentScreen, setCurrentScreen } from "./API/LCDScreenQueries";
import {
	getCurrentTemperature,
	getTargetTemperature
} from "./API/TemperatureQueries";

class ProgrammableFridge extends Component {
	constructor(props) {
		super(props);

		this.state = {
			screen: 0,
			currentTemperature: 0,
			targetTemperature: 0
		};
	}

	componentDidMount = async () => {
		let screen = null;
		let currentTemperature = null;
		let targetTemperature = null;

		try {
			screen = await getCurrentScreen();
		} catch (error) {
			screen = 2;
			console.error(error);
		}

		screen = 2;

		try {
			currentTemperature = await getCurrentTemperature();
		} catch (error) {
			currentTemperature = 0.0;
			console.error(error);
		}

		try {
			targetTemperature = await getTargetTemperature();
		} catch (error) {
			targetTemperature = 0.0;
			console.error(error);
		}

		this.setState({
			screen,
			currentTemperature,
			targetTemperature
		});
	};

	render() {
		return (
			<>
				<LCDEmulator
					screen={this.state.screen}
					currentTemperature={this.state.currentTemperature}
					targetTemperature={this.state.targetTemperature}
				/>
				<ControlButtons screen={this.state.screen} />
			</>
		);
	}
}

export default ProgrammableFridge;
