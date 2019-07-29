require("dotenv").config();
const io = require("socket.io-client");
const server = require("http").createServer();

const TempWatcher = require("./temperatureWatcher");
const RelayController = require("./relayController");
const LCDController = require("./lcdController");
const ButtonController = require("./buttonController");

class ProgrammableFridge {
	constructor() {
		this.tempWatcher = new TempWatcher(35.0, 1000, false);
		this.relay = new RelayController(1000);
		this.lcd = new LCDController();
		this.buttons = new ButtonController();

		this.io = require("socket.io")(server);

		this.io.on("connect", (socket) => {
			// Give client their ID
			socket.emit("id", socket.id);

			// Handle button pressed event
			socket.on("buttonPressed", (button) => {
				if (button === "middle") this.io.to(this.lcd.getId()).emit("buttonPressed", button);
				else this.io.to(this.tempWatcher.getId()).emit("buttonPressed", button);
			});

			socket.on("screenUpdate", () => {
				this.sendCurrentStatus(socket);
			});

			// Alert that current/target temperature has changed, so send update
			socket.on("updateTemperature", () => {
				this.sendCurrentStatus(socket);
			});
		});

		process.on("SIGINT", (socket) => {
			process.exit();
			// this.cleanup();
		});

		server.listen(3030);
	}

	sendCurrentStatus(socket) {
		socket.broadcast.emit("currentStatus", {
			screen: this.lcd.getScreen(),
			target: this.tempWatcher.getTargetTemperature(),
			lowerTarget: this.tempWatcher.getLowerTargetTemperature(),
			upperTarget: this.tempWatcher.getUpperTargetTemperature(),
			current: this.tempWatcher.getCurrentTemperature(),
			relay: this.relay.getStatus()
		});
	}

	// cleanup(err = null) {
	// 	this.sendCurrentStatus()
	// }
}

let programmableFridge = new ProgrammableFridge();
