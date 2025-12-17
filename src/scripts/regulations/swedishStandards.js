export const SWEDISH_REGULATIONS = {
    maxVoltage: 400, // Maximum voltage in volts
    maxCurrent: 63, // Maximum current in amps
    minCableSize: {
        copper: {
            singlePhase: 1.5, // Minimum cable size for single-phase in mm²
            threePhase: 2.5 // Minimum cable size for three-phase in mm²
        },
        aluminum: {
            singlePhase: 2.5, // Minimum cable size for single-phase in mm²
            threePhase: 4 // Minimum cable size for three-phase in mm²
        }
    },
    voltDropPercentage: 5, // Maximum allowable voltage drop percentage
    installationTypes: {
        residential: {
            description: "Residential installations including homes and apartments.",
            requirements: "Follow standard regulations for residential wiring."
        },
        commercial: {
            description: "Commercial installations including offices and shops.",
            requirements: "Adhere to stricter regulations for commercial wiring."
        }
    }
};

export function validateCableSize(cableSize, type) {
    const minSize = type === 'copper' ? SWEDISH_REGULATIONS.minCableSize.copper : SWEDISH_REGULATIONS.minCableSize.aluminum;
    return cableSize >= minSize.singlePhase; // Simplified validation for single-phase
}

export function calculateVoltageDrop(current, distance, cableSize) {
    const resistancePerMeter = cableSize === 1.5 ? 12.1 : cableSize === 2.5 ? 7.41 : 4.61; // Example values in ohms/km
    const voltageDrop = (current * distance * resistancePerMeter) / 1000; // Voltage drop in volts
    return voltageDrop;
}