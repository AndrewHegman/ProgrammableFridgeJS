class TemperatureWatcher {
	constructor(targetTemperature, compressorTimeoutValue) {
		this._currentTemperature = 0;
		this._targetTemperature = targetTemperature;

		this._upperTemperatureThreshold = this._targetTemperature + 1.0;
		this._lowerTemperatureThreshold = this._targetTemperature - 1.0;

		this._compressorStatus = false;
		this._compressorCanBeTurnedOn = true;
		this._compressorTimeoutValue = compressorTimeoutValue;
		this._compressorTimeout = null;

		this.watcherLoop = null;

		this._SAFE_turnCompressorOn = () => {
			if (this._compressorCanBeTurnedOn) this._compressorStatus = true;
		};

		this._UNSAFE_turnCompressorOn = () => {
			this._compressorStatus = true;
		};

		this.turnCompressorOn = this._SAFE_turnCompressorOn;

		// Start timer to be able to turn compressor on
		this.turnCompressorOff();
	}

	/**
	 * Used for testing
	 */
	_setCurrentTemperature(temperature) {
		this._currentTemperature = temperature;
	}

	_setUpperTemperatureThreshold(temperature) {
		this._upperTemperatureThreshold = temperature;
	}

	_setLowerTemperatureThreshold(temperature) {
		this._lowerTemperatureThreshold = temperature;
	}

	_UNSAFE_forceCompressorOn() {
		this._compressorStatus = true;
	}

	_UNSAFE_clearCompressorTimeout() {
		clearTimeout(this._compressorTimeout);
	}

	_UNSAFE_disableCompressorTimeout() {
		this.turnCompressorOn = this._UNSAFE_turnCompressorOn;
	}

	setTargetTemperature(temperature) {
		this._targetTemperature = temperature;
		this._lowerTemperatureThreshold = this._targetTemperature - 1.0;
		this._upperTemperatureThreshold = this._targetTemperature + 1.0;
	}

	getTargetTemperature() {
		return this._targetTemperature;
	}

	getCurrentTemperature() {
		/**
		 * TODO: setup method to read temperature sensor
		 */

		return 72.0;
	}

	getCompressorStatus() {
		return this._compressorStatus;
	}

	turnCompressorOff() {
		this._compressorStatus = false;

		//Compressor cannot be immediately turned back on (it will be damaged)
		this._compressorCanBeTurnedOn = false;
		this._compressorTimeout = setTimeout(() => {
			this._compressorCanBeTurnedOn = true;
		}, this._compressorTimeoutValue);
	}

	turnCompressorOn() {
		if (this._compressorCanBeTurnedOn) this._compressorStatus = true;
	}

	start(timeInterval) {
		this.watcherLoop = setInterval(() => {
			this.getCurrentTemperature();
			if (this._currentTemperature > this._upperTemperatureThreshold)
				this.turnCompressorOn();
			else if (this._currentTemperature < this._lowerTemperatureThreshold)
				this.turnCompressorOff();
		}, timeInterval);
	}

	stop() {
		clearInterval(this.watcherLoop);
	}
}

module.exports = { TemperatureWatcher };
