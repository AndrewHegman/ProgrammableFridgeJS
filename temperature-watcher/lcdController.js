require("dotenv").config();

const io = require("socket.io-client");

const areScreensEqual = (screen1, screen2) => {
	// Mock XOR operator checking if one screen is null but the other isn't
	if (screen1 ? !screen2 : screen2) return false;

	if (screen1.length !== screen2.length) return false;

	let equal = true;
	screen1.forEach((line, lidx) => {
		// Check for equal lengths
		if (line.length !== screen2[lidx].length) equal = false;

		// Check for equal chars
		line.forEach(
			(char, cidx) => (equal = char !== screen2[lidx][cidx] ? false : equal)
		);
	});

	return equal;
};

class LCDController {
	constructor() {
		this.socket = io.connect("http://localhost:3030");
		this.lcd = null;
		this.lcdReady = false;

		if (process.env.environment === "raspberrypi") {
			const Lcd = require("lcd");

			this.lcd = new Lcd({
				rs: 5,
				e: 11,
				data: [6, 13, 19, 26],
				cols: 16,
				rows: 2
			});

			this.lcd.on("ready", () => {
				this.lcd.noAutoscroll();
				this.lcdReady = true;
			});
		}

		this.currentTemperature = null;
		this.targetTemperature = null;
		this.screen = 3; // Attempting to connect screen
		this.text = null;
		this.oldText = null;

		this.socket.on("connect", (data) => {
			this.screen = 0;
			this.setScreen();
		});

		this.socket.on("disconnect", (data) => {
			this.screen = 3;
			this.setScreen();
		});

		this.socket.on("id", (data) => {
			console.log("Got ID: ", data);
			this.id = data;
		});

		// We only care if the center button was pressed in this case
		this.socket.on("buttonPressed", (button) => {
			if (button === "middle") {
				if (this.screen === 0) {
					this.screen = 1;
					this.setScreen();
				} else if (this.screen === 1) {
					this.screen = 0;
					this.setScreen();
				}
			}
		});

		this.socket.on("currentStatus", (data) => {
			this.currentTemperature = data.current;
			this.targetTemperature = data.target;
			this.setScreen();
		});

		this.setScreen();

		console.log("Ready");
	}

	formatTextForScreen(string) {
		/**TODO: Make more intelligent--i.e. cut string at a space */

		let top = string;
		let bott = "";
		if (string.length > 16) {
			top = string.substr(0, 16);
			bott = string.substr(16, 16);
		}
		return [top.padEnd(16, " ").split(""), bott.padEnd(16, " ").split("")];
	}

	setScreen(text = null) {
		this.oldText = this.text;

		// Ignore what was passed in
		if (text === null) {
			if (this.screen === 0) {
				this.text = [
					`Current: ${this.currentTemperature}F`.padEnd(16, " ").split(""),
					`Target: ${this.targetTemperature}F`.padEnd(16, " ").split("")
				];
			} else if (this.screen === 1) {
				this.text = [
					`Target: ${this.targetTemperature}F`.padEnd(16, " ").split(""),
					` X     X      X `.padEnd(16, " ").split("")
				];
			} else if (this.screen === 2) {
				this.text = this.formatTextForScreen("ERROR: Unable to connect");
			} else if (this.screen === 3) {
				this.text = this.formatTextForScreen("Attempting to connect...");
			}
		} else {
			this.text = formatTextForScreen(text);
		}

		if (!areScreensEqual(this.text, this.oldText)) {
			if (process.env.environment === "raspberrypi" && this.lcdReady) {
				this.lcd.setCursor(0, 0);
				this.lcd.print(this.text[0].join(""), (err) => {
					if (err) {
						this.cleanup(err);
					}

					this.lcd.setCursor(0, 1);
					this.lcd.print(this.text[1].join(""), (err) => {
						if (err) {
							this.cleanup(err);
						}
					});
				});
			}
			this.socket.emit("screenUpdate");
		}
	}

	getScreenId() {
		return this.screen;
	}

	getScreen() {
		return this.text;
	}

	getId() {
		return this.id;
	}

	cleanup(err = null) {
		if (this.lcd !== null) this.lcd.close();

		if (err) console.error(err);

		process.exit(err ? 1 : 0);
	}
}

module.exports = LCDController;
