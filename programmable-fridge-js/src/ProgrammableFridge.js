import React, { Component } from "react";

import LCDEmulator from "./LCDEmulator/LCDEmulator";
import ControlButtons from "./ControlButtons/ControlButtonContainer";
import io from "socket.io-client";

const attemptingToConnect = [
	["A", "t", "t", "e", "m", "p", "t", "i", "n", "g", " ", "t", "o", " ", "c", "o"],
	["n", "n", "e", "c", "t", ".", ".", ".", " ", " ", " ", " ", " ", " ", " ", " "]
];

class ProgrammableFridgeEmulator extends Component {
	constructor(props) {
		super(props);

		this.state = {
			screen: attemptingToConnect,
			currentTemperature: 0,
			targetTemperature: 0
		};

		this.socket = io.connect("http://192.168.1.111:3030");
	}

	componentDidMount = async () => {
		this.socket.on("currentStatus", (data) => {
			this.setState({
				screen: data.screen,
				currentTemperature: data.current,
				targetTemperature: data.target
			});
		});

		this.socket.on("disconnect", (data) => {
			this.setState({
				screen: attemptingToConnect
			});
		});
	};

	changeTargetTemperature = (change) => {
		this.setState((prevState) => ({
			targetTemperature: prevState.targetTemperature + change
		}));
	};

	buttonPressed = (button) => {
		this.socket.emit("buttonPressed", button);
	};

	render() {
		return (
			<>
				<LCDEmulator
					text={this.state.screen}
					currentTemperature={this.state.currentTemperature}
					targetTemperature={this.state.targetTemperature}
				/>
				<ControlButtons buttonPressed={this.buttonPressed} />
			</>
		);
	}
}

export default ProgrammableFridgeEmulator;
