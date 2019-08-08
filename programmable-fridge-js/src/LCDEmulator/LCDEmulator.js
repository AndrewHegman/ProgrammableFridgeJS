import React, { Component } from "react";

import LCDCharacter from "../Common/LCDCharacter";
import { characterDisplayMap } from "../Common/CharacterDisplayMap";

class LCDEmulator extends Component {
	render() {
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
				{this.props.text.map((line) =>
					line.map((char, index) => (
						<LCDCharacter key={index} character={characterDisplayMap[char]} />
					))
				)}
			</div>
		);
	}
}

export default LCDEmulator;
