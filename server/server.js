const hapi = require("hapi");
const Boom = require("boom");

const provision = async () => {
	const options = {
		// port: process.env.REACT_APP_SERVER_PORT,
		port: 3030,
		address: "0.0.0.0",
		routes: {
			cors: {
				origin: ["*"],
				credentials: true
			},
			timeout: {
				socket: false
			}
		}
	};

	const server = new hapi.Server(options);

	await server.register({
		plugin: require("@hapi/inert")
	});

	server.route({
		method: "GET",
		path: "/temperature/current",
		handler: async (request) => {
			try {
				// return await getCurrentTemperature();
				return 72;
			} catch (e) {
				throw Boom.internal("Error getting current temperature");
			}
		}
	});

	server.route({
		method: "GET",
		path: "/temperature/target",
		handler: async (request) => {
			try {
				// return await getTargetTemperature();
				return 32;
			} catch (e) {
				throw Boom.internal("Error getting target temperature");
			}
		}
	});

	server.route({
		method: "PUT",
		path: "/temperature/current",
		handler: async (request) => {
			try {
				return await setCurrentTemperature();
			} catch (e) {
				throw Boom.internal("Error setting current temperature");
			}
		}
	});

	server.route({
		method: "PUT",
		path: "/temperature/target",
		handler: async (request) => {
			try {
				return await setTargetTemperature();
			} catch (e) {
				throw Boom.internal("Error setting target temperature");
			}
		}
	});

	server.route({
		method: "GET",
		path: "/screen",
		handler: async (request) => {
			return 0;
		}
	});

	server.route({
		method: "GET",
		path: "/",
		handler: (request) => {
			return "Hapi";
		}
	});

	const io = require("socket.io")(server.listener);
	let tempWatcherConnected = false;
	let emulatorConnected = false;

	io.on("connect", (socket) => {
		socket.on("join", (room) => {
			socket.join(room);
		});

		socket.on("currentStatus", data => {
			console.log(data);
			if (data.sendToRoom) {
				socket.to(data.room).emit(data.name, data.payload);
			}
		});

		// socket.on("currentTemperature-emulator", (data) => {
		// 	socket.to("")
		// }
	});

	try {
		await server.start();
	} catch (e) {
		console.error(e);
	}

	console.log("Server running at:", server.info.uri);
};

provision();
