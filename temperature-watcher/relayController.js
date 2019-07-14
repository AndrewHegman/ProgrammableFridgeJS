class RelayController {
	constructor(compressorTimeoutValue) {
		this._compressorStatus = false;
		this._compressorCanBeTurnedOn = true;
		this._compressorShouldTurnOn = false;
		this._compressorTimeoutValue = compressorTimeoutValue;
		this._compressorTimeout = null;

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

	_UNSAFE_forceCompressorOn() {
		this._compressorStatus = true;
	}

	_UNSAFE_clearCompressorTimeout() {
		clearTimeout(this._compressorTimeout);
	}

	_UNSAFE_disableCompressorTimeout() {
		this.turnCompressorOn = this._UNSAFE_turnCompressorOn;
	}

	getStatus() {
		return this._compressorStatus;
	}

	turnCompressorOff() {
		this._compressorStatus = false;

		//Compressor cannot be immediately turned back on (it will be damaged)
		this._compressorCanBeTurnedOn = false;
		this._compressorTimeout = setTimeout(() => {
			this._compressorCanBeTurnedOn = true;
			if (this._compressorShouldTurnOn) {
				this.turnCompressorOn();
				this._compressorShouldTurnOn = false;
			}
		}, this._compressorTimeoutValue);
	}
	/**
	 * Attempts to turn on relay. If timeout hasn't expired, makes promise
	 * to turn on compressor when possible (not an actual javascript promise...)
	 */
	turnCompressorOn() {
		if (this._compressorCanBeTurnedOn) this._compressorStatus = true;
		else this._compressorShouldTurnOn = true;
	}
}

module.exports = RelayController;
