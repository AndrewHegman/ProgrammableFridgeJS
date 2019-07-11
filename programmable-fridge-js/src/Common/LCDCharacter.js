import React, { Component } from "react";
import LCDCharacterDot from "./LCDCharacterDot";

class LCDCharacter extends Component {
	render() {
		return (
			<div
				style={{
					background: "darkgreen",

					/* subtract the space between boxes, then divide space evenly */
					width: "calc((496px - 75px) / 16)",

					height: "calc((100px - 5px) / 2)",

					textAlign: "center",

					display: "grid",
					gridTemplateColumns: "repeat(5, auto)",
					gridTemplateRows: "repeat(8, auto)"
				}}
			>
				{this.props.character.map((row, rowIdx) =>
					row.map((dot, colIdx) => (
						<LCDCharacterDot
							key={rowIdx * 16 + colIdx}
							state={this.props.character[rowIdx][colIdx] ? "visible" : "hidden"}
						/>
					))
				)}
			</div>
		);
	}
}

export default LCDCharacter;
