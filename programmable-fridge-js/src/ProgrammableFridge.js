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
			screen: attemptingToConnect
		};
		this.buttonPressedTimeout = null;
		this.buttonPressedInterval = null;

		this.socket = io.connect("http://localhost:3030");
	}

	componentDidMount = async () => {
		this.socket.on("currentStatus", (data) => {
			if (data.hasOwnProperty("screen")) this.setState({ screen: data.screen });
			this.setState((prevState) => ({
				screen: data.hasOwnProperty("screen") ? data.screen : prevState.screen
			}));
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
		if (button !== 1) {
			this.buttonPressedTimeout = setTimeout(() => {
				this.buttonPressedInterval = setInterval(
					() => this.socket.emit("buttonPressed", button),
					100
				);
			}, 500);
		}
	};

	buttonReleased = (button) => {
		if (this.buttonPressedTimeout !== null) clearTimeout(this.buttonPressedTimeout);
		if (this.buttonPressedInterval !== null) clearInterval(this.buttonPressedInterval);
	};

	render() {
		return (
			<>
				<LCDEmulator text={this.state.screen} />
				<ControlButtons
					buttonPressed={this.buttonPressed}
					buttonReleased={this.buttonReleased}
				/>
			</>
		);
	}
}

export default ProgrammableFridgeEmulator;
