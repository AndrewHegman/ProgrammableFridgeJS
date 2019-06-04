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

		this.socket = io.connect("http://localhost:3030");
	}

	componentDidMount = async () => {
		this.socket.on("connected", (data) => {
			console.log(data);
		});

		this.socket.on("currentStatus", (data) => {
			this.setState({
				screen: data.screen,
				currentTemperature: data.currentTemperature,
				targetTemperature: data.targetTemperature
			});
		});

		this.socket.on("updateCurrentTemperature", (data) => {
			this.setState({ currentTemperature: data.data });
		});

		this.socket.on("updateTargetTemperature", (data) => {
			this.setState({ targetTemperature: data.data });
		});

		this.socket.on("updateScreen", (data) => {
			this.setState({ screen: data.data });
		});

		this.socket.emit("getCurrentStatus");
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
				this.socket.emit("changeTargetTemperature", {
					data: this.state.targetTemperature - 0.5
				});
				this.setState((prevState) => ({
					targetTemperature: prevState.targetTemperature - 0.5
				}));
			} else if (button === "right") {
				this.socket.emit("changeTargetTemperature", {
					data: this.state.targetTemperature + 0.5
				});
				this.setState((prevState) => ({
					targetTemperature: prevState.targetTemperature + 0.5
				}));
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
