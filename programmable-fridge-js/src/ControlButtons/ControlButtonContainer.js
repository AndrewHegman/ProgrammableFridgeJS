import React, { Component } from "react";

import ControlButton from "./ControlButton";
import { getCurrentScreen, setCurrentScreen } from "../API/LCDScreenQueries";

class ControlButtonContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	leftButtonPressed = async () => {
		const currentScreen = await getCurrentScreen();
		if (currentScreen === 0) {
			return;
		} else if (currentScreen === 1) {
		}
	};

	render() {
		return (
			<div
				style={{
					display: "grid",
					gridGap: "25px",
					width: "496px",
					gridTemplateColumns: "repeat(3, auto)",
					marginTop: "25px",
					textAlign: "center"
				}}
			>
				<ControlButton handleClick={this.leftButtonPressed} />
				<ControlButton handleClick={this.middleButtonPressed} />
				<ControlButton handleClick={this.rightButtonPressed} />
			</div>
		);
	}
}

export default ControlButtonContainer;
