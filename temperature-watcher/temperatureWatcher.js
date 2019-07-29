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

		this.socket = io.connect("http://localhost:3030", { reconnection: false });

		this.socket.on("disconnect", () => {
			this.socket.close();
			this.stopReadTemperature();
		});

		this.socket.on("id", (data) => {
			this.id = data;
		});

		this.socket.on("currentStatus", (data) => {
			if (data.target !== this._targetTemperature) {
				this.setTargetTemperature(data.target);
			}
		});

		this.socket.on("buttonPressed", (button) => {
			if (button === "left") this.setTargetTemperature(this._targetTemperature - 0.5);
			else if (button === "right") this.setTargetTemperature(this._targetTemperature + 0.5);
		});

		this._startReadTemperature(pollRate);
	}

	/**
	 * Used for testing only
	 */
	_setCurrentTemperature(temperature) {
		if (this._debug) {
			this._oldCurrentTemperature = this._currentTemperature;
			this._currentTemperature = temperature;
			if (this._oldCurrentTemperature !== this._currentTemperature) {
				this.sendUpdateStatus();
			}
		}
	}

	_forceConnectToServer() {
		this.socket = io.connect("http://localhost:3030");
		this._startReadTemperature(1000);
	}

	_setUpperTemperatureThreshold(temperature) {
		this._upperTemperatureThreshold = temperature;
	}

	_setLowerTemperatureThreshold(temperature) {
		this._lowerTemperatureThreshold = temperature;
	}

	_startReadTemperature(pollRate) {
		this.readTemperatureInterval = setInterval(() => {
			this.readCurrentTemperature();
		}, pollRate);
	}

	_stopReadTemperature() {
		clearInterval(this.readTemperatureInterval);
	}

	setTargetTemperature(temperature) {
		this._targetTemperature = temperature;
		this._lowerTemperatureThreshold = this._targetTemperature - 1.0;
		this._upperTemperatureThreshold = this._targetTemperature + 1.0;

		this.sendUpdateStatus();
	}

	sendUpdateStatus() {
		console.log("Sending update");
		this.socket.emit("updateTemperature");
	}

	getId() {
		return this.id;
	}

	getTargetTemperature() {
		return this._targetTemperature;
	}

	getUpperTargetTemperature() {
		return this._upperTemperatureThreshold;
	}

	getLowerTargetTemperature() {
		return this._lowerTemperatureThreshold;
	}

	readCurrentTemperature() {
		/**
		 * TODO: setup method to read temperature sensor
		 */
		if (this.socket !== null) {
			this._oldCurrentTemperature = this._currentTemperature;
			this._currentTemperature =
				this._currentTemperature > 72
					? this._currentTemperature - 1
					: this._currentTemperature + 1;

			if (this._oldCurrentTemperature !== this._currentTemperature) {
				this.sendUpdateStatus();
			}
		}
	}

	getCurrentTemperature() {
		return this._currentTemperature;
	}
}

module.exports = TemperatureWatcher;
