require("dotenv").config();
const server = require("http").createServer();

class Supervisor {
	constructor() {
		this.io = require("socket.io")(server);

		this.io.on("connect", (socket) => {
			// Give client their ID
			socket.emit("id", socket.id);

			// Request that all connected clients send updated status
			socket.broadcast.emit("newClientConnected");

			// Handle button pressed event
			socket.on("buttonPressed", (button) => {
				socket.broadcast.emit("buttonPressed", { button });
			});

			// Alert that screen has changed
			socket.on("screenUpdate", (data) => {
				socket.broadcast.emit("currentStatus", data);
			});

			// Alert that current/target temperature has changed
			socket.on("updateTemperature", (data) => {
				socket.broadcast.emit("currentStatus", data);
			});
		});

		process.on("SIGINT", (socket) => {
			process.exit();
			// this.cleanup();
		});

		server.listen(3030);
	}
}

module.exports = Supervisor;
