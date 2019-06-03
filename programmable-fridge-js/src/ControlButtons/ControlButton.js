import React, { Component } from "react";

class ControlButton extends Component {
	render() {
		return (
			<div
				style={{
					background: "darkgrey",
					width: "25px",
					height: "25px",
					margin: "0 auto"
				}}
				onClick={this.props.handleClick}
			/>
		);
	}
}

export default ControlButton;
