function calculateKW(volts, amps) {
    return (volts * amps) / 1000;
}

function calculateAmps(kW, volts) {
    return (kW * 1000) / volts;
}

function calculateVolts(kW, amps) {
    return (kW * 1000) / amps;
}

export { calculateKW, calculateAmps, calculateVolts };