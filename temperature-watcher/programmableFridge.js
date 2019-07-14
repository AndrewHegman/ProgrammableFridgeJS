const io = require("socket.io-client");
const server = require("http").createServer();

const TempWatcher = require("./temperatureWatcher");
const RelayController = require("./relayController");
const LCDController = require("./lcdController");

class ProgrammableFridge {
	constructor() {
		this.tempWatcher = new TempWatcher(35.0, 1000, false);
		this.relay = new RelayController();
		this.lcd = new LCDController();

		this.io = require("socket.io")(server);

		this.io.on("connect", (socket) => {
			// Give client their ID
			socket.emit("id", socket.id);

			// Handle button pressed event
			socket.on("buttonPressed", (button) => {
				if (button === "middle")
					this.io.to(this.lcd.getId()).emit("buttonPressed", button);
				else
					this.io
						.to(this.tempWatcher.getId())
						.emit("buttonPressed", button);
			});

			socket.on("screenUpdate", () => {
				this.sendCurrentStatus(socket);
			});

			// Alert that current temperature has changed, so send update
			socket.on("currentTemperature", () => {
				this.sendCurrentStatus(socket);
			});

			// Alert that target temperature has changed, so send update
			socket.on("targetTemperature", () => {
				this.sendCurrentStatus(socket);
			});
		});

		server.listen(3030);
	}

	sendCurrentStatus(socket) {
		socket.broadcast.emit("currentStatus", {
			screen: this.lcd.getScreen(),
			target: this.tempWatcher.getTargetTemperature(),
			current: this.tempWatcher.getCurrentTemperature(),
			relay: this.relay.getStatus()
		});
	}
}

let programmableFridge = new ProgrammableFridge();
