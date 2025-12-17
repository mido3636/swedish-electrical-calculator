function calculateVoltageDrop(current, distance, cableSize, resistivity) {
    const voltageDrop = (2 * current * distance * resistivity) / cableSize;
    return voltageDrop;
}

function isVoltageDropAcceptable(voltageDrop, supplyVoltage, maxDropPercentage) {
    const maxDrop = (supplyVoltage * maxDropPercentage) / 100;
    return voltageDrop <= maxDrop;
}

export { calculateVoltageDrop, isVoltageDropAcceptable };