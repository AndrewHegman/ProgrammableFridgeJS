import React, { Component } from "react";

class LCDCharacterDot extends Component {
	render() {
		return (
			<div
				style={{
					background: "black",
					width: "100%",
					height: "100%",
					visibility: this.props.state
				}}
			/>
		);
	}
}

export default LCDCharacterDot;
