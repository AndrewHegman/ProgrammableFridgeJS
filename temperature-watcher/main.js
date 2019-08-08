require("dotenv").config();

const useHardware = !!parseInt(process.env.USE_HARDWARE);

const ButtonController = require("./buttonController")(useHardware);
const LcdController = require("./lcdController")(useHardware);
const RelayController = require("./relayController")(useHardware);
const TemperatureWatcher = require("./temperatureWatcher")(useHardware);
const Supervisor = require("./supervisor");

const lcd = new LcdController();
const buttons = new ButtonController();
const relay = new RelayController();
const temp = new TemperatureWatcher(35, 1000);
const supervisor = new Supervisor();
