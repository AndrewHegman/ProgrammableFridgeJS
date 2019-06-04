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
		path: "/currenttemperature",
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
		path: "/targettemperature",
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
		path: "/currenttemperature",
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
		path: "/targettemperature",
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

	io.on("connection", (socket) => {
		socket.on("getCurrentStatus", () => {
			io.emit("getCurrentStatus");
		});

		socket.on("currentStatus", (data) => io.emit("currentStatus", data));

		socket.emit("updateScreen", { data: 0 });

		socket.on("currentTemperatureChanged", (data) => {
			// io.emit("currentTemperatureChanged", data);
			io.emit("updateCurrentTemperature", data);
		});

		socket.on("targetTemperatureChanged", (data) =>
			io.emit("updateTargetTemperature", data)
		);

		socket.on("changeScreen", (data) => {
			io.emit("changeScreen", data);
		});

		socket.on("changeTargetTemperature", (data) =>
			io.emit("changeTargetTemperature", data)
		);
	});

	try {
		await server.start();
	} catch (e) {
		console.error(e);
	}

	console.log("Server running at:", server.info.uri);
};

provision();
