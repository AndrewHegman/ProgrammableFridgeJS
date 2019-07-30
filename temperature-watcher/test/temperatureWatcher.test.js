// const TempWatcher = require("../temperatureWatcher");
// const server = require("http").createServer();
// const assert = require("assert");

// // const compressorTimeoutValue = 1000;
// // const unsafe = compressorTimeoutValue < 180000;

// const tempWatcher = new TempWatcher(35.0, 1000, true);
// const io = require("socket.io")(server),
// 	monitorio = require("monitor.io");
// io.use(monitorio({ port: 8000 }));

// let testSuite = 1;

// /**
//  * Test ability for temperature watcher to connect to server
//  */
// describe("Connect to server", () => {
// 	before(() => {
// 		testSuite = 1;
// 		tempWatcher._forceConnectToServer();
// 	});
// 	beforeEach(() => {
// 		server.listen(3030);
// 	});

// 	io.on("connect", (socket) => {
// 		it("should be connected", (done) => {
// 			if (testSuite === 1) {
// 				socket.disconnect(true);
// 				done();
// 			}
// 		});
// 	});

// 	// it("should emit 'updateTemperature'", (done) => {
// 	// 	tempWatcher._forceConnectToServer();
// 	// 	tempWatcher._setCurrentTemperature(72);

// 	// 	io.on("connect", (socket) => {
// 	// 		console.log("Connected");
// 	// 		socket.on("updateTemperature", () => done());
// 	// 	});
// 	// });

// 	afterEach(() => {
// 		server.close();
// 	});
// });

// describe("Communication", () => {
// 	before(() => {
// 		testSuite = 2;
// 		tempWatcher._forceConnectToServer();
// 	});

// 	beforeEach(() => {
// 		server.listen(3030);
// 	});

// 	it("should emit 'updateTemperature'", (done) => {
// 		io.on("connect", (socket) => {
// 			if (testSuite === 2) {
// 				socket.on("updateTemperature", () => {
// 					done();
// 				});
// 			}
// 		});
// 	});

// 	afterEach(() => {
// 		server.close();
// 	});
// });
/**
 * Test if temperature watcher sends out messages appropriately
 */
// describe("Communication", () => {
// 	before(() => {
// 		server.listen(3030);
// 		tempWatcher._setCurrentTemperature(72);
// 	});

// 	// it("should be connected", (done) => {
// 	// 	io.on("connect", (socket) => {
// 	// 		done();
// 	// 	});
// 	// });

// 	it("should emit 'updateTemperature'", (done) => {
// 		io.on("connect", (socket) => {
// 			console.log("Connected");
// 			socket.on("updateTemperature", () => done());
// 		});
// 	});

// 	after(() => {
// 		server.close();
// 	});
// });
/**
 * // Give client their ID
			socket.emit("id", socket.id);
			socket.use((packet) => {
				expect(packet).not.toBe("updateTemperature");
			});
 */

/**
 * Test suite that may potentially be UNSAFE. Tests the
 * timeout protection in the TemperatureWatcher class.
 */
// describe(`${unsafe ? "UNSAFE (timer)" : "Timer"} compressor testing`, () => {
// 	let tempWatcher = new temp.TemperatureWatcher(31.5, compressorTimeoutValue);

// 	test("Compressor starts OFF", () => {
// 		expect(tempWatcher.getCompressorStatus()).toBe(false);
// 	});

// 	test("Compressor cannot be immediately turned ON", () => {
// 		tempWatcher.turnCompressorOn();
// 		expect(tempWatcher.getCompressorStatus()).toBe(false);
// 	});

// 	test("Compressor can be turned on after timeout", (done) => {
// 		setTimeout(() => {
// 			tempWatcher.turnCompressorOn();
// 			expect(tempWatcher.getCompressorStatus()).toBe(true);
// 			done();
// 		}, compressorTimeoutValue);
// 	});
// });

// /**
//  * Test suite that may potentially be UNSAFE. Tests the
//  * temperature functionality of the compressor logic.
//  */
// describe(`${unsafe ? "UNSAFE (temp)" : "Temp"} compressor testing`, () => {
// 	let tempWatcher = new temp.TemperatureWatcher(31.5, compressorTimeoutValue);

// 	beforeAll(() => {
// 		tempWatcher._UNSAFE_disableCompressorTimeout();
// 		tempWatcher.start(100);
// 	});

// 	setTimeout(() => {
// 		console.log("Status: ", tempWatcher.getCompressorStatus());
// 		tempWatcher.stop();
// 	}, 100);

// 	test("Compressor turns ON when temperature is too high", (done) => {
// 		tempWatcher._setCurrentTemperature(50.0);
// 		setTimeout(() => {
// 			expect(tempWatcher.getCompressorStatus()).toBe(true);
// 			done();
// 		}, 150);
// 	});

// 	test("Compressor turns OFF when temperature is too low", (done) => {
// 		tempWatcher._setCurrentTemperature(20.0);
// 		setTimeout(() => {
// 			expect(tempWatcher.getCompressorStatus()).toBe(false);
// 			done();
// 		}, 150);
// 	});

// 	test("Compressor does not change state when temperature is in range (OFF)", (done) => {
// 		const currentStatus = tempWatcher.getCompressorStatus();
// 		tempWatcher._setCurrentTemperature(30.5);
// 		setTimeout(() => {
// 			expect(tempWatcher.getCompressorStatus()).toBe(currentStatus);
// 			done();
// 		}, 150);
// 	});

// 	test("Compressor turns ON when temperature is too high", (done) => {
// 		tempWatcher._setCurrentTemperature(34.0);
// 		setTimeout(() => {
// 			expect(tempWatcher.getCompressorStatus()).toBe(true);
// 			done();
// 		}, 150);
// 	});

// 	test("Compressor does not change state when temperature is in range (OFF)", (done) => {
// 		const currentStatus = tempWatcher.getCompressorStatus();
// 		tempWatcher._setCurrentTemperature(30.5);
// 		setTimeout(() => {
// 			expect(tempWatcher.getCompressorStatus()).toBe(currentStatus);
// 			done();
// 		}, 150);
// 	});
// });
