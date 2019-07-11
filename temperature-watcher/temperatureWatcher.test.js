const temp = require("./temperatureWatcher");

const compressorTimeoutValue = 1000;
const unsafe = compressorTimeoutValue < 180000;

/**
 * Test suite designed to test basic functionality of turning
 * compressor on/off. HIGHLY RECOMENDED that compressor is DISCONNECTED
 * as it will be toggled on and off which can be very damaging
 */
describe("UNSAFE (forced) compressor testing", () => {
	let tempWatcher = new temp.TemperatureWatcher();

	test("Turn compressor ON", () => {
		tempWatcher._UNSAFE_forceCompressorOn();
		expect(tempWatcher.getCompressorStatus()).toBe(true);
	});

	test("Turn compressor OFF", () => {
		tempWatcher.turnCompressorOff();
		expect(tempWatcher.getCompressorStatus()).toBe(false);
	});

	afterAll(() => {
		/**
		 * Garbage collection to go here...
		 * Oh wait, this isn't C++ lol
		 */
	});
});

/**
 * Test suite that may potentially be UNSAFE. Tests the
 * timeout protection in the TemperatureWatcher class.
 */
describe(`${unsafe ? "UNSAFE (timer)" : "Timer"} compressor testing`, () => {
	let tempWatcher = new temp.TemperatureWatcher(31.5, compressorTimeoutValue);

	test("Compressor starts OFF", () => {
		expect(tempWatcher.getCompressorStatus()).toBe(false);
	});

	test("Compressor cannot be immediately turned ON", () => {
		tempWatcher.turnCompressorOn();
		expect(tempWatcher.getCompressorStatus()).toBe(false);
	});

	test("Compressor can be turned on after timeout", (done) => {
		setTimeout(() => {
			tempWatcher.turnCompressorOn();
			expect(tempWatcher.getCompressorStatus()).toBe(true);
			done();
		}, compressorTimeoutValue);
	});
});

/**
 * Test suite that may potentially be UNSAFE. Tests the
 * temperature functionality of the compressor logic.
 */
describe(`${unsafe ? "UNSAFE (temp)" : "Temp"} compressor testing`, () => {
	let tempWatcher = new temp.TemperatureWatcher(31.5, compressorTimeoutValue);

	beforeAll(() => {
		tempWatcher._UNSAFE_disableCompressorTimeout();
		tempWatcher.start(100);
	});

	setTimeout(() => {
		console.log("Status: ", tempWatcher.getCompressorStatus());
		tempWatcher.stop();
	}, 100);

	test("Compressor turns ON when temperature is too high", (done) => {
		tempWatcher._setCurrentTemperature(50.0);
		setTimeout(() => {
			expect(tempWatcher.getCompressorStatus()).toBe(true);
			done();
		}, 150);
	});

	test("Compressor turns OFF when temperature is too low", (done) => {
		tempWatcher._setCurrentTemperature(20.0);
		setTimeout(() => {
			expect(tempWatcher.getCompressorStatus()).toBe(false);
			done();
		}, 150);
	});

	test("Compressor does not change state when temperature is in range (OFF)", (done) => {
		const currentStatus = tempWatcher.getCompressorStatus();
		tempWatcher._setCurrentTemperature(30.5);
		setTimeout(() => {
			expect(tempWatcher.getCompressorStatus()).toBe(currentStatus);
			done();
		}, 150);
	});

	test("Compressor turns ON when temperature is too high", (done) => {
		tempWatcher._setCurrentTemperature(34.0);
		setTimeout(() => {
			expect(tempWatcher.getCompressorStatus()).toBe(true);
			done();
		}, 150);
	});

	test("Compressor does not change state when temperature is in range (OFF)", (done) => {
		const currentStatus = tempWatcher.getCompressorStatus();
		tempWatcher._setCurrentTemperature(30.5);
		setTimeout(() => {
			expect(tempWatcher.getCompressorStatus()).toBe(currentStatus);
			done();
		}, 150);
	});
});
