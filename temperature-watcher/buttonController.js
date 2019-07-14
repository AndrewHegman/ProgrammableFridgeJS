require("dotenv").config();
const io = require("socket.io-client");
const Gpio = require("onoff").Gpio;

class ButtonController {
	constructor() {
		this.id = null;

		this.socket = io.connect("http://192.168.1.109:3030");
		this.leftButton = new Gpio(2, "in", "rising", { debounceTimeout: 10 });
		this.middleButton = new Gpio(3, "in", "rising", { debounceTimeout: 10 });
		this.rightButton = new Gpio(4, "in", "rising", { debounceTimeout: 10 });

		this.socket.on("id", (data) => {
			this.id = data;
		});

		this.leftButton.watch((err, value) => {
			if (err) {
				this.cleanup(err);
			}
			console.log(value);
			this.socket.emit("buttonPressed", "left");
		});

		this.middleButton.watch((err, value) => {
			if (err) {
				this.cleanup(err);
			}
			this.socket.emit("buttonPressed", "middle");
		});

		this.rightButton.watch((err, value) => {
			if (err) {
				this.cleanup(err);
			}
			this.socket.emit("buttonPressed", "right");
		});

		process.on("SIGINT", () => {
			this.cleanup();
		});

		console.log("Ready");
	}

	cleanup(err = null) {
		this.leftButton.unexport();
		this.middleButton.unexport();
		this.rightButton.unexport();

		if (err) console.error(err);

		process.exit(err ? 1 : 0);
	}

	getId() {
		return this.id;
	}
}

if (process.env.environment === "windows") {
	module.exports = ButtonController;
} else if (process.env.environment === "raspberrypi") {
	buttonController = new ButtonController();
}
