export function validateNumber(value) {
    const number = parseFloat(value);
    return !isNaN(number) && number >= 0;
}

export function validateVoltage(value) {
    return validateNumber(value) && value <= 400; // Assuming a max voltage of 400V for standard installations
}

export function validateAmperage(value) {
    return validateNumber(value) && value <= 1000; // Assuming a max amperage of 1000A for standard installations
}

export function validateCableSize(size) {
    const validSizes = ['1.5', '2.5', '4', '6', '10', '16', '25', '35', '50', '70', '95', '120', '150', '185', '240'];
    return validSizes.includes(size);
}

export function validateInput(input, type) {
    switch (type) {
        case 'voltage':
            return validateVoltage(input);
        case 'amperage':
            return validateAmperage(input);
        case 'cableSize':
            return validateCableSize(input);
        default:
            return false;
    }
}