import React, { Component } from "react";

import ControlButton from "./ControlButton";

class ControlButtonContainer extends Component {
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
				<ControlButton
					handleClick={() => this.props.buttonPressed(0)}
					handleRelease={() => this.props.buttonReleased(0)}
				/>
				<ControlButton
					handleClick={() => this.props.buttonPressed(1)}
					handleRelease={() => this.props.buttonReleased(1)}
				/>
				<ControlButton
					handleClick={() => this.props.buttonPressed(2)}
					handleRelease={() => this.props.buttonReleased(2)}
				/>
			</div>
		);
	}
}

export default ControlButtonContainer;
