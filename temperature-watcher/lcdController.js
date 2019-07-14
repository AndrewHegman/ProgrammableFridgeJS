const io = require("socket.io-client");

class LCDController {
	constructor() {
		this.socket = io.connect("http://localhost:3030");

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

		if (this.oldText !== this.text) {
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
}

module.exports = LCDController;
