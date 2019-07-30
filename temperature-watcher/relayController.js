const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, `${process.env.ENVIRONMENT}.env`) });

const io = require("socket.io-client");
if (process.env.USE_HARDWARE === "true") {
	const Gpio = require("onoff").Gpio;
}

class RelayController {
	constructor(relayTimeoutValue) {
		this.socket = io.connect("http://192.168.1.111:3030");
		this._relayStatus = false;
		this._relayCanBeTurnedOn = false;
		this._relayShouldTurnOn = false;
		this._relayTimeoutValue = relayTimeoutValue;
		this._relayTimeout = null;
		if (process.env.USE_HARDWARE === "true") {
			console.log("Why are you here...");
			this.relayPin = new Gpio(17, "low");
		}

		this._SAFE_turnRelayOn = () => {
			if (this._relayCanBeTurnedOn && process.env.USE_HARDWARE === "true")
				this._relayStatus = true;
		};

		this._UNSAFE_turnRelayOn = () => {
			this._relayStatus = true;
		};

		this.turnRelayOn = this._SAFE_turnRelayOn;

		// Start timer to be able to turn relay on
		this.off();

		this.socket.on("currentStatus", (data) => {
			console.log("Relay current status");
			if (data.current < data.lowerTarget && this._relayStatus) this.off();
			else if (data.current > data.upperTarget && !this._relayStatus) this.on();
		});

		process.on("SIGINT", () => {
			this.cleanup();
		});

		console.log("Relay ready");
	}

	_UNSAFE_forceRelayOn() {
		this._relayStatus = true;
	}

	_UNSAFE_clearRelayTimeout() {
		clearTimeout(this._relayTimeout);
	}

	_UNSAFE_disableRelayTimeout() {
		this.turnRelayOn = this._UNSAFE_turnRelayOn;
	}

	getStatus() {
		return this._relayStatus;
	}

	off() {
		this._relayStatus = false;
		if (process.env.USE_HARDWARE === "true") {
			this.relayPin.write(0, (err) => {
				if (err) this.cleanup();
			});
		}

		//Relay cannot be immediately turned back on (it will be damaged)
		this._relayCanBeTurnedOn = false;
		this._relayTimeout = setTimeout(() => {
			this._relayCanBeTurnedOn = true;
			console.log("Relay can now be turned on");
			if (this._relayShouldTurnOn) {
				this.turnRelayOn();
				this._relayShouldTurnOn = false;
			}
		}, this._relayTimeoutValue);
	}
	/**
	 * Attempts to turn on relay. If timeout hasn't expired, makes promise
	 * to turn on relay when possible (not an actual javascript promise...)
	 */
	on() {
		console.log("On called");
		console.log(this._relayCanBeTurnedOn);
		if (this._relayCanBeTurnedOn) {
			this._relayStatus = true;
			this.relayPin.write(1);
		} else this._relayShouldTurnOn = true;
	}

	cleanup(err = null) {
		this.relayPin.unexport();

		if (err) console.error(err);

		process.exit(err ? 1 : 0);
	}
}

module.exports = RelayController;
