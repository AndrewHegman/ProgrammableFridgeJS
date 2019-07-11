import React, { Component } from "react";

import LCDEmulator from "./LCDEmulator/LCDEmulator";
import ControlButtons from "./ControlButtons/ControlButtonContainer";
import io from "socket.io-client";

class ProgrammableFridgeEmulator extends Component {
	constructor(props) {
		super(props);

		this.state = {
			screen: 3,
			currentTemperature: 0,
			targetTemperature: 0
		};

		this.socket = io.connect("http://localhost:3030", {
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000
		});
	}

	componentDidMount = async () => {
		this.socket.on("connect", (data) => {
			this.socket.emit("join", "emulator");
		});

		this.socket.on("currentTemperature", (data) => {
			this.setState({ currentTemperature: data });
		});

		this.socket.on("targetTemperature", (data) => {
			this.setState({ targetTemperature: data });
		});

		this.socket.on("updateScreen", (data) => {
			this.setState({ screen: data });
		});

		this.socket.on("disconnect", (data) => {
			this.setState({
				screen: 3
			});
		});
	};

	changeTargetTemperature = (change) => {
		this.socket.emit("changeTargetTemperature", {
			data: this.state.targetTemperature + change
		});
		this.setState((prevState) => ({
			targetTemperature: prevState.targetTemperature + change
		}));
	};

	buttonPressed = (button) => {
		// Regardless of current screen, handle middle button press
		if (button === "middle") {
			this.socket.emit("changeScreen", {
				data: this.state.screen === 1 ? 0 : 1
			});

			this.setState((prevState) => ({
				screen: prevState.screen === 1 ? 0 : 1
			}));
		}

		// Only handle left/right button press if on screen 1
		else if (this.state.screen === 1) {
			if (button === "left") {
				this.changeTargetTemperature(-0.5);
			} else if (button === "right") {
				this.changeTargetTemperature(0.5);
			}
		}
	};

	render() {
		return (
			<>
				<LCDEmulator
					screen={this.state.screen}
					currentTemperature={this.state.currentTemperature}
					targetTemperature={this.state.targetTemperature}
				/>
				<ControlButtons buttonPressed={this.buttonPressed} />
			</>
		);
	}
}

export default ProgrammableFridgeEmulator;
