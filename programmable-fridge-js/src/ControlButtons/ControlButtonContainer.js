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
				<ControlButton handleClick={() => this.props.buttonPressed("left")} />
				<ControlButton handleClick={() => this.props.buttonPressed("middle")} />
				<ControlButton handleClick={() => this.props.buttonPressed("right")} />
			</div>
		);
	}
}

export default ControlButtonContainer;
