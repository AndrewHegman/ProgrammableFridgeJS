require("dotenv").config();
const server = require("http").createServer();

// const TempWatcher = require("./temperatureWatcher");
// const RelayController = require("./relayController");
// const LCDController = require("./lcdController");
// const ButtonController = require("./buttonController");

class ProgrammableFridge {
	constructor() {
		this.io = require("socket.io")(server);
		const monitorio = require("monitor.io");

		this.io.use(monitorio({ port: 8000 }));

		this.io.on("connect", (socket) => {
			// Give client their ID
			socket.emit("id", socket.id);

			// Handle button pressed event
			socket.on("buttonPressed", (button) => {
				this.io.emit("buttonPressed", { button });
			});

			// Alert that screen has changed
			socket.on("screenUpdate", (data) => {
				this.io.emit("currentStatus", data);
			});

			// Alert that current/target temperature has changed
			socket.on("updateTemperature", (data) => {
				this.io.emit("currentStatus", data);
			});
		});

		process.on("SIGINT", (socket) => {
			process.exit();
			// this.cleanup();
		});

		server.listen(3030);
	}
}

// let programmableFridge = new ProgrammableFridge();
module.exports = ProgrammableFridge;
