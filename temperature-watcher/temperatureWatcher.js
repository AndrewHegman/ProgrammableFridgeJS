const io = require("socket.io-client");

class TemperatureWatcher {
	constructor(targetTemperature, pollRate, debug) {
		/* Enables debug-only methods */
		this._debug = debug;

		this._currentTemperature = 0;
		this._oldCurrentTemperature = 0; // Used to check if temperature has changed
		this._targetTemperature = targetTemperature;

		this._upperTemperatureThreshold = this._targetTemperature + 1.0;
		this._lowerTemperatureThreshold = this._targetTemperature - 1.0;

		this.watcherLoop = null;
		this.id = null;

		this.socket = io.connect("http://localhost:3030");

		this.socket.on("id", (data) => {
			this.id = data;
		});

		this.socket.on("currentStatus", (data) => {
			if (data.target !== this._targetTemperature) {
				this.setTargetTemperature(data.target);
			}
		});

		this.socket.on("buttonPressed", (button) => {
			if (button === "left")
				this.setTargetTemperature(this._targetTemperature - 0.5);
			else if (button === "right")
				this.setTargetTemperature(this._targetTemperature + 0.5);
		});
		setInterval(() => {
			this.readCurrentTemperature();
		}, pollRate);
	}

	/**
	 * Used for testing only
	 */
	_setCurrentTemperature(temperature) {
		if (this._debug) this._currentTemperature = temperature;
	}

	_setUpperTemperatureThreshold(temperature) {
		this._upperTemperatureThreshold = temperature;
	}

	_setLowerTemperatureThreshold(temperature) {
		this._lowerTemperatureThreshold = temperature;
	}

	setTargetTemperature(temperature) {
		this._targetTemperature = temperature;
		this._lowerTemperatureThreshold = this._targetTemperature - 1.0;
		this._upperTemperatureThreshold = this._targetTemperature + 1.0;

		this.sendUpdateTarget();
	}

	sendUpdateTarget() {
		this.socket.emit("targetTemperature");
	}

	sendUpdateCurrent() {
		this.socket.emit("currentTemperature");
	}

	getId() {
		return this.id;
	}

	getTargetTemperature() {
		return this._targetTemperature;
	}

	readCurrentTemperature() {
		/**
		 * TODO: setup method to read temperature sensor
		 */

		this._oldCurrentTemperature = this._currentTemperature;
		this._currentTemperature =
			this._currentTemperature > 72
				? this._currentTemperature - 1
				: this._currentTemperature + 1;

		if (this._oldCurrentTemperature !== this._currentTemperature) {
			this.sendUpdateCurrent();
		}
	}

	getCurrentTemperature() {
		return this._currentTemperature;
	}
}

module.exports = TemperatureWatcher;
