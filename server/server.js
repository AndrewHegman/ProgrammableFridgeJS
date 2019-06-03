const hapi = require("hapi");
const Boom = require("boom");

const provision = async () => {
	const options = {
		port: process.env.REACT_APP_SERVER_PORT,
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
				return await getCurrentTemperature();
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
				return await getTargetTemperature();
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
				return await getTargetTemperature();
			} catch (e) {
				throw Boom.internal("Error setting target temperature");
			}
		}
	});

	server.route({
		method: "GET",
		path: "/{param*}",
		handler: {
			directory: {
				path: "../build/",
				redirectToSlash: true,
				index: true
			}
		}
	});

	try {
		await server.start();
	} catch (e) {
		console.error(e);
	}

	console.log("Server running at:", server.info.uri);
};

provision();
