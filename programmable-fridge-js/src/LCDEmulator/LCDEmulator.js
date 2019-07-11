import React, { Component } from "react";

import LCDCharacter from "../Common/LCDCharacter";
import { characterDisplayMap } from "../Common/CharacterDisplayMap";

class LCDEmulator extends Component {
	formatTextForScreen = (string) => {
		/**TODO: Make more intelligent--i.e. cut string at a space */

		let top = string;
		let bott = "";
		if (string.length > 16) {
			top = string.substr(0, 16);
			bott = string.substr(16, 16);
		}
		return [top.padEnd(16, " ").split(""), bott.padEnd(16, " ").split("")];
	};

	render() {
		let text = [];
		if (this.props.screen === 0) {
			text = [
				`Current: ${this.props.currentTemperature}F`.padEnd(16, " ").split(""),
				`Target: ${this.props.targetTemperature}F`.padEnd(16, " ").split("")
			];
		} else if (this.props.screen === 1) {
			text = [
				`Target: ${this.props.targetTemperature}F`.padEnd(16, " ").split(""),
				` X     X      X `.padEnd(16, " ").split("")
			];
		} else if (this.props.screen === 2) {
			text = this.formatTextForScreen("ERROR: Unable to connect");
		} else if (this.props.screen === 3) {
			text = this.formatTextForScreen("Attempting to connect...");
		}
		return (
			<div
				style={{
					width: "496px",
					height: "100px",
					border: "20px solid black",
					background: "green",
					display: "grid",
					gridTemplateColumns: "repeat(16, auto)",
					gridTemplateRows: "repeat(2, auto)",
					gridGap: "5px",
					padding: "5px",
					margin: "8px"
				}}
			>
				{text.map((line) =>
					line.map((char, index) => (
						<LCDCharacter key={index} character={characterDisplayMap[char]} />
					))
				)}
			</div>
		);
	}
}

export default LCDEmulator;
