const ProgrammableFridge = require("../programmableFridge");
const io = require("socket.io-client");
const chai = require("chai");
const assert = chai.assert;
const should = chai.should();
const expect = chai.expect;

const testScreen = [
	`Current: 50F`.padEnd(16, " ").split(""),
	`Target: 30F`.padEnd(16, " ").split("")
];

const testTemperature = {
	current: 50,
	target: 35
};

const programmableFridge = new ProgrammableFridge(true);

describe("Connect to server", () => {
	let socket = null;

	before(function() {
		socket = io.connect("http://localhost:3030");
	});

	it("socket should be able to connect", (done) => {
		socket.on("connect", () => done());
	});
	after(() => {
		socket.close();
	});
});

describe("Communication", () => {
	let socket = null;
	before(function() {
		socket = io.connect("http://localhost:3030");
	});

	it('should emit "currentStatus" when "screenUpdate" is received', (done) => {
		socket.emit("screenUpdate", {
			screen: testScreen
		});

		socket.on("currentStatus", (data) => {
			expect(data.screen).to.eql(testScreen);
			done();
			socket.off("currentStatus");
		});
	});

	it('should emit "currentStatus" when "updateTemperature" is received', (done) => {
		socket.emit("updateTemperature", testTemperature);

		socket.on("currentStatus", (data) => {
			expect(data.current).to.eql(testTemperature.current);
			done();
			socket.off("currentStatus");
		});
	});

	it('should emit "buttonPressed" when "buttonPressed" is received', (done) => {
		socket.emit("buttonPressed", "left");

		socket.on("buttonPressed", (data) => {
			expect(data.button).to.eql("left");
			done();
			socket.off("buttonPressed");
		});
	});

	after(() => {
		socket.close();
	});
});
