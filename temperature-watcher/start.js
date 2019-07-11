const TemperatureWatcher = require("./temperatureWatcher");

const temperatureWatcher = new TemperatureWatcher(35.0, 1000);
temperatureWatcher.start();
