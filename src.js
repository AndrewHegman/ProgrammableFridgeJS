const getElapsedTimeMs = () => {
    const time = new Date();
    console.log(time.getTime());
}

const getCurrentTemperatureF = () => {
    return parseInt(document.getElementById("current-temperature").value);
}

const getTargetTemperature = () => {
    return parseInt(document.getElementById("target-temperature").value);
}

const compressorOn = () => {
    console.log("compressor On");
}

const compressorOff = () => {
    console.log("compressor Off");
}

const updateDisplay = (currentTemperature, targetTemperature) => {
    const firstLine = "Current: " + JSON.stringify(currentTemperature) + "F";
    const secondLine = "Target: " + JSON.stringify(targetTemperature) + "F";

    [...firstLine].forEach((letter, index) => {
        document.getElementById(`0x${index}`).innerHTML = letter;
    });

    [...secondLine].forEach((letter, index) => {
        document.getElementById(`1x${index}`).innerHTML = letter;
    });
}

const upperTemperatureLimit = 100;
const lowerTemperatureLimit = 90; 

const main = () => {
    var documentReady = false;


    setInterval(() => {
        if(documentReady){
            const targetTemperature = getTargetTemperature();
            if(getCurrentTemperatureF() > (targetTemperature + 1.0)){
                compressorOn();
            } else if(getCurrentTemperatureF() < (targetTemperature - 1.0)){
                compressorOff();
            }
        }
    }, 5000);

    setInterval(() => {
        if(documentReady){
            updateDisplay(25.0, 30.0);

        }
        // console.log("But this will run faster still");
    }, 1000);
    
    document.onreadystatechange = function() {
        if(document.readyState === "complete"){
            documentReady = true;
            document.getElementById("button1").onclick = () => {
                console.log("button1 pressed!");
            }
            document.getElementById("button2").onclick = () => {
                console.log("button2 pressed!");
            }
            document.getElementById("button3").onclick = () => {
                console.log("button3 pressed!");
            }
        }
    }
}

main();