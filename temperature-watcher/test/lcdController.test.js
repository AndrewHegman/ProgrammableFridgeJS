const chai = require("chai");
const assert = chai.assert;
const should = chai.should();
const expect = chai.expect;

const server = require("http").createServer();
const LcdController = require("../lcdController");

const lcdController = new LcdController();
let io = null;
let lcdControllerSocket = null;

console.log("LCD Controller testing");

describe("Connect to server", () => {
	before(function() {
		io = require("socket.io")(server);
		server.listen(3030);
	});

	it("socket should be able to connect", (done) => {
		const connectionCallback = (done) => {
			done();
		};
		io.on("connect", (socket) => {
			lcdControllerSocket = socket;
			connectionCallback(done);
			io.off("connect", connectionCallback);
		});
	});
});

describe("Button presses", () => {
	it("Screen ID should be 0", () => {
		assert.strictEqual(lcdController.getScreenId(), 0);
	});

	it("Screen ID should be 1 if middle button is pressed", (done) => {
		const callback = () => {
			assert.strictEqual(lcdController.getScreenId(), 1);
			done();
			lcdControllerSocket.off("screenUpdate", callback);
		};
		io.emit("buttonPressed", { button: 1 });
		lcdControllerSocket.on("screenUpdate", callback);
	});

	it("Screen ID should be 0 if middle button is pressed", (done) => {
		const callback = () => {
			assert.strictEqual(lcdController.getScreenId(), 0);
			done();
			lcdControllerSocket.off("screenUpdate", callback);
		};

		io.emit("buttonPressed", { button: 1 });
		lcdControllerSocket.on("screenUpdate", callback);
	});
	after(() => {
		io.close();
		server.close();
	});
});
