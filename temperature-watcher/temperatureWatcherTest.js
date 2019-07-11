const temp = require("./temperatureWatcher");

const delay = async (time) => {
	return await setTimeout(() => {}, time);
};

const tempWatcher = new temp.TemperatureWatcher(31.5, 1000);

// tempWatcher.turnCompressorOn();
// console.log("Compressor status: ", tempWatcher.compressorStatus ? "on" : "off");
// tempWatcher.turnCompressorOff();
// console.log("Compressor status: ", tempWatcher.compressorStatus ? "on" : "off");
// tempWatcher.turnCompressorOn();
// console.log("Compressor status: ", tempWatcher.compressorStatus ? "on" : "off");

tempWatcher._UNSAFE_disableCompressorTimeout();
tempWatcher.start(50);
tempWatcher._setCurrentTemperature(50);
setTimeout(() => {
	console.log("Status: ", tempWatcher.getCompressorStatus());
	tempWatcher.stop();
}, 100);
