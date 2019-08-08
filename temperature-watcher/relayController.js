const io = require("socket.io-client");

module.exports = (useHardware) => {
	class RelayController {
		constructor(relayTimeoutValue) {
			this.socket = io.connect("http://192.168.1.111:3030");
			this._relayStatus = false;
			this._relayCanBeTurnedOn = false;
			this._relayShouldTurnOn = false;
			this._relayTimeoutValue = relayTimeoutValue;
			this._relayTimeout = null;

			this._useHardware = useHardware;

			if (this._useHardware) {
				const Gpio = require("onoff").Gpio;
				this.relayPin = new Gpio(17, "low");
			}
			// this._SAFE_turnRelayOn = () => {
			// 	if (this._relayCanBeTurnedOn) this._relayStatus = true;
			// };

			// this._UNSAFE_turnRelayOn = () => {
			// 	this._relayStatus = true;
			// };

			// this.turnRelayOn = this._SAFE_turnRelayOn;

			// Start timer to be able to turn relay on
			this.off();

			this.socket.on("currentStatus", (data) => {
				if (data.current < data.lowerTarget && this._relayStatus) this.off();
				else if (data.current > data.upperTarget && !this._relayStatus) this.on();
			});

			process.on("SIGINT", () => {
				this.cleanup();
			});

			console.log("Relay ready");
		}

		// _UNSAFE_forceRelayOn() {
		// 	this._relayStatus = true;
		// }

		_UNSAFE_clearRelayTimeout() {
			clearTimeout(this._relayTimeout);
		}

		// _UNSAFE_disableRelayTimeout() {
		// 	this.turnRelayOn = this._UNSAFE_turnRelayOn;
		// }

		getStatus() {
			return this._relayStatus;
		}

		off() {
			this._relayStatus = false;
			if (this._useHardware) {
				this.relayPin.write(0, (err) => {
					if (err) this.cleanup(err);
				});
			}

			//Relay cannot be immediately turned back on (it will be damaged)
			this._relayCanBeTurnedOn = false;
			this._relayTimeout = setTimeout(() => {
				this._relayCanBeTurnedOn = true;
				if (this._relayShouldTurnOn) {
					if (this._useHardware) this.turnRelayOn();
					this._relayShouldTurnOn = false;
				}
			}, this._relayTimeoutValue);
		}
		/**
		 * Attempts to turn on relay. If timeout hasn't expired, makes promise
		 * to turn on relay when possible (not an actual javascript promise...)
		 */
		on() {
			if (this._relayCanBeTurnedOn) {
				if (this._useHardware) this.relayPin.write(1);
				this._relayStatus = true;
			} else this._relayShouldTurnOn = true;
		}

		cleanup(err = null) {
			if (this._useHardware) this.relayPin.unexport();

			if (err) console.error(err);

			process.exit(err ? 1 : 0);
		}
	}
	return RelayController;
};
