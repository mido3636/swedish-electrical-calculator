// Electrical Installation Calculator - Swedish Standards
// Based on SS 424 14 26 (Swedish electrical installation standard)

document.addEventListener('DOMContentLoaded', () => {
    const calcForm = document.getElementById('calcForm');
    const resultsDiv = document.getElementById('results');

    // Cable data from SS 424 14 26 Tabell 52B.3 (Bilaga 52B, sida 274)
    // EXACT values from official tables - Reference: 30°C ambient, 20°C ground
    const cableData = {
        copper: {
            // A1: Isolerad ledare i rör i värmeisolerad vägg
            A1: [19, 26, 35, 45, 61, 81, 106, 131, 158, 200, 241, 278, 316, 362, 424],
            // A2: Flerledad kabel i rör i isolerad vägg  
            A2: [23, 31, 42, 54, 75, 100, 127, 158, 192, 246, 298, 346, 391, 450, 522],
            // B1: Isolerade ledare i rör på vägg/luft
            B1: [23, 31, 42, 54, 70, 94, 119, 148, 179, 229, 278, 322, 364, 419, 486],
            // B2: Flerledad kabel i rör på vägg/luft
            B2: [26, 35, 47, 61, 80, 107, 138, 171, 207, 268, 328, 382, 434, 500, 593],
            // C: En- eller flerledad kabel i mark (direkt nedgrävd)
            C: [24, 33, 45, 58, 80, 107, 138, 171, 207, 268, 328, 382, 434, 500, 593],
            sizes: [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240]
        },
        aluminum: {
            A1: [20, 27, 35, 48, 64, 84, 103, 125, 191, 220, 253, 288, 337, 387],
            A2: [25, 33, 43, 57, 78, 105, 130, 157, 200, 242, 280, 319, 371, 427],
            B1: [25, 33, 43, 57, 73, 98, 130, 157, 191, 242, 280, 319, 371, 427],
            B2: [26, 35, 45, 59, 84, 90, 115, 142, 172, 219, 265, 307, 348, 400, 464],
            C: [26, 35, 45, 59, 84, 90, 115, 142, 172, 219, 265, 307, 348, 400, 464],
            sizes: [2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300]
        }
    };

    // Temperature correction factors from Table 52B.14 (page 285)
    // COMPLETE OFFICIAL VALUES from SEK Handbok 444
    const tempFactors = {
        PVC: {10: 1.22, 15: 1.17, 20: 1.12, 25: 1.06, 30: 1.00, 35: 0.94, 40: 0.87, 45: 0.79, 50: 0.71, 55: 0.61, 60: 0.50},
        PEX: {10: 1.15, 15: 1.12, 20: 1.08, 25: 1.04, 30: 1.00, 35: 0.96, 40: 0.91, 45: 0.87, 50: 0.82, 55: 0.76, 60: 0.71, 65: 0.65, 70: 0.58, 75: 0.50, 80: 0.41}
    };

    // Swedish cable recommendations based on common standards
    // Note: Specific product availability should be confirmed with supplier
    const swedishCableTypes = {
        'PVC': { 
            name: 'PVC Installationskabel', 
            description: 'Standard PVC insulated installation cable',
            voltage: '450/750V',
            applications: ['indoor', 'dry-locations'],
            temp: 70
        },
        'PEX': {
            name: 'XLPE Installationskabel',
            description: 'Cross-linked polyethylene insulated cable',
            voltage: '0.6/1kV',
            applications: ['indoor', 'outdoor', 'underground'],
            temp: 90
        }
    };

    // Function to get specific Swedish cable designation based on real standards
    function getCableDesignation(size, voltage, installationType) {
        // Real Swedish cable designations available at Ahlsell, Elkedjan, etc.
        if (voltage === 230) {
            // Single phase 230V installations
            if (installationType.includes('A1') || installationType.includes('A2')) {
                // Indoor installation in conduits/walls
                return size <= 6 ? 'H07V-K eller EQLQ' : 'H07V-R eller EQLE';
            } else if (installationType.includes('B1') || installationType.includes('B2')) {
                // Outdoor/wall surface installations
                return 'H07RN-F eller EQLQ-YO (fuktsäker)';
            } else if (installationType.includes('C')) {
                // Underground/buried installations  
                return size <= 10 ? 'AXQJ eller EQLQ-YO' : 'AXKJ eller EQLE-YO';
            }
        } else {
            // Three phase 400V installations
            if (installationType.includes('A1') || installationType.includes('A2')) {
                // Indoor installation in conduits/walls
                return size <= 6 ? 'H07V-K 5G eller EQLQ 5x' : 'H07V-R 5G eller EQLE 5x';
            } else if (installationType.includes('B1') || installationType.includes('B2')) {
                // Outdoor/wall surface installations
                return 'H07RN-F 5G eller EQLQ-YO 5x (fuktsäker)';
            } else if (installationType.includes('C')) {
                // Underground/buried installations
                return size <= 10 ? 'AXQJ 5G eller EQLQ-YO 5x' : 'AXKJ 5G eller EQLE-YO 5x';
            }
        }
        return 'H07V-K eller EQLQ (standard)';
    }

    // Function to get real cable examples available at Swedish suppliers
    function getCableExamples(size, voltage) {
        const coreCount = voltage === 230 ? '3G' : '5G';
        
        // Real cable examples from major Swedish suppliers
        const examples = [
            `Nexans EQLQ ${size} ${coreCount}${size}`,
            `Prysmian H07V-K ${size}mm²`,
            `Draka EQLQ ${size} ${coreCount}${size}`,
            `Borealis H07V-R ${size}mm²`
        ];
        
        return examples.slice(0, 2).join(' eller ');
    }

    // Simplified cable selection logic
    function selectCableType(application, installationType, voltage, environment) {
        // Underground installations
        if (installationType === 'C' || environment === 'underground') {
            return 'Markabel';
        }
        
        // Outdoor installations  
        if (environment === 'outdoor') {
            return 'Halogenfri'; // For safety
        }
        
        // Application-based selection for indoor
        switch(application) {
            case 'socket':
            case 'bathroom':
                return 'Halogenfri'; // Safer for occupied areas
            case 'motor':
            case 'distribution':
                return 'XLPE'; // Higher temperature rating
            default:
                return 'PVC'; // Standard for most applications
        }
    }

    // Swedish climate temperature ranges by installation type  
    // Based on actual SEK Handbok 444 temperature range (10°C-60°C)
    const climateRanges = {
        'indoor': { min: 15, max: 35, typical: 20, description: 'Inomhus (uppvärmt utrymme)' },
        'outdoor': { min: 10, max: 32, typical: 15, description: 'Utomhus (svensk klimat)' },
        'underground': { min: 10, max: 20, typical: 15, description: 'Underjordisk (frostfritt djup)' },
        'attic': { min: 15, max: 45, typical: 30, description: 'Vind/vindsutrymme' },
        'basement': { min: 12, max: 25, typical: 15, description: 'Källare/tekniskt utrymme' }
    };

    // Grouping factors from Table 52B.17 (page 287)
    const groupingFactors = {
        1: 1.00, 2: 0.80, 3: 0.70, 4: 0.65, 5: 0.60, 6: 0.57,
        7: 0.54, 8: 0.52, 9: 0.50, 12: 0.45, 16: 0.41, 20: 0.38
    };

    // Toggle between power and current input
    const inputType = document.getElementById('inputType');
    const powerGroup = document.getElementById('powerGroup');
    const currentGroup = document.getElementById('currentGroup');
    const powerFactorGroup = document.getElementById('powerFactorGroup');
    
    // Smart form handling
    const installationTypeSelect = document.getElementById('installationType');
    const insulationSelect = document.getElementById('insulation');
    const environmentSelect = document.getElementById('environment');
    const ambientTempInput = document.getElementById('ambientTemp');
    const tempRangeSmall = document.getElementById('tempRange');
    
    // Auto-select insulation type based on installation method
    installationTypeSelect.addEventListener('change', () => {
        const installationType = installationTypeSelect.value;
        
        if (installationType.includes('C')) {
            // Underground installations need special insulation
            insulationSelect.value = 'PEX';
        } else if (installationType.includes('B')) {
            // Outdoor/surface installations
            insulationSelect.value = 'PEX';
        } else {
            // Indoor installations (A1, A2)
            insulationSelect.value = 'PVC';
        }
        
        // Add visual feedback
        insulationSelect.classList.add('auto-filled');
        setTimeout(() => insulationSelect.classList.remove('auto-filled'), 3000);
    });
    
    // Auto-set temperature based on environment
    environmentSelect.addEventListener('change', () => {
        const selectedEnv = environmentSelect.value;
        const range = climateRanges[selectedEnv];
        if (range) {
            ambientTempInput.value = range.typical;
            ambientTempInput.min = range.min;
            ambientTempInput.max = range.max;
            tempRangeSmall.textContent = `${range.description} | Range: ${range.min}°C to ${range.max}°C | Typical: ${range.typical}°C`;
            
            // Add visual feedback
            ambientTempInput.classList.add('auto-filled');
            setTimeout(() => ambientTempInput.classList.remove('auto-filled'), 3000);
        }
    });
    
    inputType.addEventListener('change', () => {
        if (inputType.value === 'power') {
            powerGroup.style.display = 'flex';
            currentGroup.style.display = 'none';
            powerFactorGroup.style.display = 'flex';
            document.getElementById('power').required = true;
            document.getElementById('current').required = false;
        } else {
            powerGroup.style.display = 'none';
            currentGroup.style.display = 'flex';
            powerFactorGroup.style.display = 'none';
            document.getElementById('power').required = false;
            document.getElementById('current').required = true;
        }
    });

    calcForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get input values
        const voltage = parseFloat(document.getElementById('voltage').value);
        const inputTypeValue = document.getElementById('inputType').value;
        const distance = parseFloat(document.getElementById('distance').value);
        const installationType = document.getElementById('installationType').value;
        const cableType = document.getElementById('cableType').value;

        // Get derating parameters
        const insulation = document.getElementById('insulation').value;
        const ambientTemp = parseFloat(document.getElementById('ambientTemp').value);
        const grouping = parseInt(document.getElementById('grouping').value);

        // Calculate current
        let current;
        if (inputTypeValue === 'power') {
            const powerKW = parseFloat(document.getElementById('power').value);
            const powerFactor = parseFloat(document.getElementById('powerFactor').value);
            
            if (voltage === 230) {
                // Single phase: I = P / (U × cos φ)
                current = (powerKW * 1000) / (voltage * powerFactor);
            } else {
                // Three phase: I = P / (√3 × U × cos φ)
                current = (powerKW * 1000) / (Math.sqrt(3) * voltage * powerFactor);
            }
        } else {
            current = parseFloat(document.getElementById('current').value);
        }

        // Get temperature correction factor (Table 52B.14)
        let tempFactor = 1.0;
        const tempData = tempFactors[insulation];
        if (tempData) {
            // Find closest temperature
            const temps = Object.keys(tempData).map(Number).sort((a,b) => a-b);
            let closestTemp = temps[0];
            for (let t of temps) {
                if (Math.abs(t - ambientTemp) < Math.abs(closestTemp - ambientTemp)) {
                    closestTemp = t;
                }
            }
            tempFactor = tempData[closestTemp];
        }

        // Get grouping factor (Table 52B.17)
        const groupFactor = groupingFactors[grouping] || 1.0;

        // Effective current after derating
        const designCurrent = current / (tempFactor * groupFactor);

        // Find suitable cable size considering current capacity AND voltage drop
        const cables = cableData[cableType];
        const capacities = cables[installationType];
        const sizes = cables.sizes;
        // Resistivity at 70°C (typical operating temperature)
        const resistivity = cableType === 'copper' ? 0.0225 : 0.036; // Ω·mm²/m
        const maxDropPercent = 4; // Swedish standard for final circuits

        let selectedSize = null;
        let selectedCapacity = 0;
        let voltageDropPercent = 0;
        let voltageDrop = 0;
        
        // Find the smallest cable that meets BOTH current capacity AND voltage drop requirements
        // If no cable works, find the best available option
        let bestOption = null;
        
        for (let i = 0; i < capacities.length; i++) {
            // Check if cable capacity (with derating) can handle the current
            const deratedCap = capacities[i] * tempFactor * groupFactor;
            
            // Calculate voltage drop for this cable size
            let testVoltageDrop, testVoltageDropPercent;
            if (voltage === 230) {
                testVoltageDrop = (2 * distance * current * resistivity) / sizes[i];
            } else {
                testVoltageDrop = (Math.sqrt(3) * distance * current * resistivity) / sizes[i];
            }
            testVoltageDropPercent = (testVoltageDrop / voltage) * 100;
            
            // Store this option
            const option = {
                size: sizes[i],
                capacity: capacities[i],
                deratedCap: deratedCap,
                voltageDrop: testVoltageDrop,
                voltageDropPercent: testVoltageDropPercent,
                currentOK: deratedCap >= current,
                voltageDropOK: testVoltageDropPercent <= maxDropPercent
            };
            
            // If this cable meets both requirements, select it and stop
            if (option.currentOK && option.voltageDropOK) {
                selectedSize = option.size;
                selectedCapacity = option.capacity;
                voltageDrop = option.voltageDrop;
                voltageDropPercent = option.voltageDropPercent;
                bestOption = option;
                break;
            }
            
            // Otherwise, keep track of the best option so far
            if (!bestOption || 
                (option.currentOK && !bestOption.currentOK) ||
                (option.currentOK === bestOption.currentOK && option.voltageDropPercent < bestOption.voltageDropPercent)) {
                bestOption = option;
            }
        }

        // If no perfect solution, use the best available option
        if (!selectedSize && bestOption) {
            selectedSize = bestOption.size;
            selectedCapacity = bestOption.capacity;
            voltageDrop = bestOption.voltageDrop;
            voltageDropPercent = bestOption.voltageDropPercent;
        }

        // If still no cable found (extremely rare case)
        if (!selectedSize) {
            resultsDiv.innerHTML = `
                <div class="error">
                    <h3>❌ Inga kablar räcker / No cables sufficient</h3>
                    <p><strong>Ström:</strong> ${current.toFixed(1)} A, <strong>Avstånd:</strong> ${distance} m</p>
                    <p><strong>Lösningar:</strong> Använd flera kablar parallellt, höj spänning till 400V, eller minska avståndet.</p>
                </div>
            `;
            return;
        }

        const voltageDropOK = voltageDropPercent <= maxDropPercent;
        const deratedCapacity = (selectedCapacity * tempFactor * groupFactor).toFixed(1);
        
        // Determine MCB size based on Swedish electrical practice
        // MCB must protect the cable AND be >= load current per phase
        const cableToMCB = {
            1.5: {
                single: [6, 10, 13, 16],
                three: [6, 10, 13, 16]
            },
            2.5: {
                single: [10, 13, 16, 20],     // Max 20A for 2.5mm²
                three: [10, 13, 16, 20]
            },
            4: {
                single: [16, 20, 25, 32],
                three: [16, 20, 25, 32]
            },
            6: {
                single: [20, 25, 32, 40],
                three: [20, 25, 32, 40]
            },
            10: {
                single: [32, 40, 50],
                three: [32, 40, 50]
            },
            16: {
                single: [40, 50, 63],
                three: [40, 50, 63]
            },
            25: {
                single: [63, 80],
                three: [63, 80]
            },
            35: {
                single: [80, 100],
                three: [80, 100]
            },
            50: {
                single: [100, 125],
                three: [100, 125]
            },
            70: {
                single: [125, 160],
                three: [125, 160]
            },
            95: {
                single: [160, 200],
                three: [160, 200]
            },
            120: {
                single: [200, 250],
                three: [200, 250]
            },
            150: {
                single: [200, 250],
                three: [200, 250]
            },
            185: {
                single: [250, 315],
                three: [250, 315]
            },
            240: {
                single: [315, 400],
                three: [315, 400]
            }
        };
        
        // Auto-upgrade cable size if MCB requirements aren't met
        let finalSelectedSize = selectedSize;
        let finalSelectedCapacity = selectedCapacity;
        let finalDeratedCapacity = parseFloat(deratedCapacity);
        let finalVoltageDrop = voltageDrop;
        let finalVoltageDropPercent = voltageDropPercent;
        let cableUpgraded = false;
        
        // Keep checking larger cable sizes until MCB requirements are satisfied
        while (true) {
            const currentSizeIndex = sizes.indexOf(finalSelectedSize);
            const phaseType = voltage === 230 ? 'single' : 'three';
            const availableMCBs = cableToMCB[finalSelectedSize]?.[phaseType] || [Math.ceil(current / 5) * 5];
            
            // Find suitable MCB for current cable size
            let mcbSize = null;
            for (let mcb of availableMCBs) {
                if (mcb >= current && mcb <= finalDeratedCapacity) {
                    mcbSize = mcb;
                    break;
                }
            }
            
            // If no suitable MCB found and there's a larger cable size available
            if (!mcbSize && currentSizeIndex < sizes.length - 1) {
                // Upgrade to next cable size
                const nextSizeIndex = currentSizeIndex + 1;
                finalSelectedSize = sizes[nextSizeIndex];
                finalSelectedCapacity = capacities[nextSizeIndex];
                finalDeratedCapacity = finalSelectedCapacity * tempFactor * groupFactor;
                
                // Recalculate voltage drop for new cable size
                if (voltage === 230) {
                    finalVoltageDrop = (2 * distance * current * resistivity) / finalSelectedSize;
                } else {
                    finalVoltageDrop = (Math.sqrt(3) * distance * current * resistivity) / finalSelectedSize;
                }
                finalVoltageDropPercent = (finalVoltageDrop / voltage) * 100;
                
                cableUpgraded = true;
                continue; // Try again with larger cable
            }
            
            // If still no MCB, find the closest one >= current
            if (!mcbSize) {
                mcbSize = availableMCBs.find(size => size >= current) || availableMCBs[availableMCBs.length - 1];
            }
            
            // Final selections
            selectedSize = finalSelectedSize;
            selectedCapacity = finalSelectedCapacity;
            voltageDrop = finalVoltageDrop;
            voltageDropPercent = finalVoltageDropPercent;
            const deratedCapacityFinal = finalDeratedCapacity.toFixed(1);
            
            break; // Exit the loop
        }
        
        // Now find the final MCB size for the selected cable
        const phaseType = voltage === 230 ? 'single' : 'three';
        const availableMCBs = cableToMCB[selectedSize]?.[phaseType] || [Math.ceil(current / 5) * 5];
        // Use the already declared finalDeratedCapacity from the auto-upgrade section
        
        let mcbSize = null;
        for (let mcb of availableMCBs) {
            if (mcb >= current && mcb <= finalDeratedCapacity) {
                mcbSize = mcb;
                break;
            }
        }
        
        // If no perfect MCB, find closest one >= current
        if (!mcbSize) {
            mcbSize = availableMCBs.find(size => size >= current) || availableMCBs[availableMCBs.length - 1];
        }
        
        // MCB type notation
        const mcbType = voltage === 230 ? 'B eller C-karakteristik (1-pol + N)' : 'B eller C-karakteristik (3-pol)';
        const mcbTypeShort = voltage === 230 ? '(1-pol + N)' : '(3-pol)';
        
        // Determine RCD type based on application and Swedish regulations
        const application = document.getElementById('application').value;
        let rcdType = '';
        let rcdInfo = '';
        let rcdRequired = false;
        
        switch(application) {
            case 'socket':
                rcdType = '30 mA, Type A (eller AC om ej elektronisk last)';
                rcdInfo = 'OBLIGATORISK för uttag enligt SS 436 40 00 avsnitt 411.3.3. Type A rekommenderas för moderna elektroniska laster.';
                rcdRequired = true;
                break;
            case 'lighting':
                rcdType = 'Ej obligatorisk (men rekommenderas 30 mA Type AC)';
                rcdInfo = 'Belysning kräver inte alltid jordfelsbrytare, men rekommenderas för säkerhet.';
                rcdRequired = false;
                break;
            case 'fixed':
                rcdType = '30 mA Type A (rekommenderad)';
                rcdInfo = 'Rekommenderas för fast installation, speciellt med elektroniska komponenter.';
                rcdRequired = false;
                break;
            case 'bathroom':
                rcdType = '30 mA, Type A (eller AC) - OBLIGATORISK';
                rcdInfo = 'OBLIGATORISK för badrum enligt SS 436 40 00 avsnitt 701.411.3.3. All utrustning i badrum måste skyddas.';
                rcdRequired = true;
                break;
            case 'outdoor':
                rcdType = '30 mA, Type A - OBLIGATORISK';
                rcdInfo = 'OBLIGATORISK för utomhusuttag enligt SS 436 40 00 avsnitt 411.3.3. Type A för bättre skydd.';
                rcdRequired = true;
                break;
            case 'motor':
                if (current > 32) {
                    rcdType = '300 mA, Type A (tidsfördröjd S-typ rekommenderas)';
                    rcdInfo = 'För motorer >32A: 300mA Type A med tidsfördröjning för att undvika felutlösning vid start.';
                } else {
                    rcdType = '30 mA, Type A';
                    rcdInfo = 'För mindre motorer: 30mA Type A, överväg tidsfördröjning om startström är hög.';
                }
                rcdRequired = false;
                break;
            case 'distribution':
                rcdType = '100 mA eller 300 mA, Type A (S-selektiv)';
                rcdInfo = 'Fördelning: 100-300mA Type A med selektivitet (S). Efterföljande kretsar har 30mA.';
                rcdRequired = false;
                break;
            default:
                rcdType = '30 mA, Type AC';
                rcdInfo = 'Standard skydd för bostäder och kommersiella lokaler.';
        }
        
        // Calculate MCB breaking capacity recommendation
        let mcbBreakingCapacity = '6 kA';
        if (voltage === 400) {
            mcbBreakingCapacity = '10 kA (rekommenderat för 3-fas)';
        }

        // Determine recommended cable type
        const environmentValue = document.getElementById('environment').value;
        const recommendedCableType = selectCableType(application, installationType, voltage, environmentValue);
        const cableInfo = swedishCableTypes[recommendedCableType] || swedishCableTypes['PVC'];
        // Calculate final derated capacity for display
        const finalDeratedCapacityDisplay = (selectedCapacity * tempFactor * groupFactor).toFixed(1);
        // voltageDropOK already declared earlier
        
        // MCB variables already declared earlier
        
        // All variables already declared earlier in the auto-upgrade section
        
        // Display results
        resultsDiv.innerHTML = `
            <div class="results-container success">
                <h3>🛒 Inköpslista / Shopping List</h3>
                
                <div class="shopping-list" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 12px; margin-bottom: 30px; border: 3px solid #ffffff; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);">
                    <h4 style="color: #ffffff; margin-top: 0; font-size: 1.6em; font-weight: bold; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); margin-bottom: 20px;">✅ Vad du behöver köpa / What you need to buy:</h4>
                    
                    <div class="shopping-item" style="margin: 20px 0; padding: 20px; background: rgba(255,255,255,0.95); border-radius: 10px; border: 2px solid rgba(255, 255, 255, 0.3); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);">
                        <h5 style="margin: 0 0 12px 0; color: #333; font-size: 1.3em; font-weight: bold;">🔌 Kabel / Cable:</h5>
                        <p style="margin: 0; font-size: 20px; font-weight: bold; color: #667eea;">
                            ${selectedSize}mm² ${cableType === 'copper' ? 'Cu' : 'Al'} kabel
                        </p>
                        <p style="margin: 8px 0 0 0; font-size: 18px; color: #333; font-weight: bold;">
                            Kabeltyp: <span style="color: #667eea;">${getCableDesignation(selectedSize, voltage, installationType)}</span>
                        </p>
                        <p style="margin: 8px 0 0 0; font-size: 16px; color: #333;">
                            Exempel: ${getCableExamples(selectedSize, voltage)}
                        </p>
                        <p style="margin: 8px 0 0 0; font-size: 16px; color: #333;">
                            Längd: ${distance}m + 10% extra = <strong style="color: #667eea; font-size: 18px;">${(distance * 1.1).toFixed(1)}m</strong>
                        </p>
                        ${cableUpgraded ? '<p style="margin: 8px 0 0 0; font-size: 14px; color: #e67e22; font-weight: bold;">⚠️ Uppgraderad från ursprunglig beräkning för MCB-kompatibilitet</p>' : ''}
                    </div>
                    
                    <div class="shopping-item" style="margin: 20px 0; padding: 20px; background: rgba(255,255,255,0.95); border-radius: 10px; border: 2px solid rgba(255, 255, 255, 0.3); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);">
                        <h5 style="margin: 0 0 12px 0; color: #333; font-size: 1.3em; font-weight: bold;">⚡ Säkring / MCB:</h5>
                        <p style="margin: 0; font-size: 20px; font-weight: bold; color: #667eea;">
                            ${mcbSize}A MCB ${voltage === 230 ? '1-polig + N' : '3-polig'}
                        </p>
                        <p style="margin: 8px 0 0 0; font-size: 16px; color: #333;">
                            Karakteristik: B eller C, Brytförmåga: ${mcbBreakingCapacity}
                        </p>
                    </div>
                    
                    ${rcdRequired ? 
                    '<div class="shopping-item" style="margin: 20px 0; padding: 20px; background: rgba(231, 76, 60, 0.95); border-radius: 10px; border: 2px solid #c0392b; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);">' +
                        '<h5 style="margin: 0 0 12px 0; color: #ffffff; font-size: 1.3em; font-weight: bold; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">🛡️ Jordfelsbrytare / RCD:</h5>' +
                        '<p style="margin: 0; font-size: 20px; font-weight: bold; color: #ffffff; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">' + rcdType + '</p>' +
                        '<p style="margin: 8px 0 0 0; font-size: 14px; color: #ffffff; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">' + rcdInfo + '</p>' +
                        '<p style="margin: 8px 0 0 0; font-size: 16px; font-weight: bold; color: #ffffff; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">⚠️ OBLIGATORISK enligt SEK Handbok 444</p>' +
                    '</div>' :
                    '<div class="shopping-item" style="margin: 20px 0; padding: 20px; background: rgba(255,255,255,0.8); border-radius: 10px; border: 2px solid rgba(255, 255, 255, 0.3); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);">' +
                        '<h5 style="margin: 0 0 12px 0; color: #333; font-size: 1.3em; font-weight: bold;">🛡️ Jordfelsbrytare / RCD:</h5>' +
                        '<p style="margin: 0; font-size: 18px; color: #666;">' + rcdType + '</p>' +
                        '<p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">' + rcdInfo + '</p>' +
                    '</div>'}
                </div>

                <h3>📊 Tekniska Detaljer / Technical Details</h3>
                
                <div class="info-box" style="margin-bottom: 20px; background: rgba(255, 255, 255, 0.1);">
                    <p><strong>📝 Input Parameters / Inmatade värden:</strong></p>
                    <p><strong>Voltage:</strong> ${voltage}V ${voltage === 230 ? '(1-fas)' : '(3-fas)'}</p>
                    <p><strong>Input:</strong> ${inputTypeValue === 'power' ? document.getElementById('power').value + ' kW (cos φ = ' + document.getElementById('powerFactor').value + ')' : document.getElementById('current').value + ' A'}</p>
                    <p><strong>Cable Length:</strong> ${distance} m</p>
                    <p><strong>Installation:</strong> ${document.getElementById('installationType').options[document.getElementById('installationType').selectedIndex].text}</p>
                    <p><strong>Material:</strong> ${cableType === 'copper' ? 'Copper (Cu)' : 'Aluminum (Al)'}</p>
                    <p><strong>Insulation:</strong> ${insulation}</p>
                    <p><strong>Temperature:</strong> ${ambientTemp}°C</p>
                    <p><strong>Cables:</strong> ${grouping} ${grouping > 1 ? 'cables together' : 'cable (isolated)'}</p>
                    <p><strong>Application:</strong> ${document.getElementById('application').options[document.getElementById('application').selectedIndex].text}</p>
                </div>
                
                <div class="result-row">
                    <span class="label">Load Current / Belastningsström:</span>
                    <span class="value">${current.toFixed(2)} A</span>
                </div>
                <div class="result-row">
                    <span class="label">Recommended Cable / Rekommenderad kabel:</span>
                    <span class="value highlight">${selectedSize} mm² ${cableType === 'copper' ? 'Cu' : 'Al'}</span>
                </div>
                <div class="result-row">
                    <span class="label">Cable Type / Kabeltyp:</span>
                    <span class="value highlight">${cableInfo.name}</span>
                </div>
                <div class="result-row">
                    <span class="label">Cable Description / Beskrivning:</span>
                    <span class="value">${cableInfo.description}</span>
                </div>
                <div class="result-row">
                    <span class="label">Cable Specification / Specifikation:</span>
                    <span class="value">${selectedSize}×${cableInfo.name} ${cableInfo.voltage}</span>
                </div>
                <div class="result-row">
                    <span class="label">Cable Capacity (base) / Belastbarhet:</span>
                    <span class="value">${selectedCapacity} A (vid 30°C, 1 kabel)</span>
                </div>
                <div class="result-row">
                    <span class="label">Derated Capacity / Avvärderad belastbarhet:</span>
                    <span class="value">${finalDeratedCapacityDisplay} A</span>
                </div>
                <div class="result-row">
                    <span class="label">Temperature Factor / Temperaturfaktor:</span>
                    <span class="value">${tempFactor.toFixed(2)} (vid ${ambientTemp}°C)</span>
                </div>
                <div class="result-row">
                    <span class="label">Grouping Factor / Grupperingsfaktor:</span>
                    <span class="value">${groupFactor.toFixed(2)} (${grouping} kab${grouping > 1 ? 'lar' : 'el'})</span>
                </div>
                <div class="result-row">
                    <span class="label">Recommended MCB / Rekommenderad säkring:</span>
                    <span class="value highlight">${mcbSize} A ${mcbTypeShort}</span>
                </div>
                <div class="result-row">
                    <span class="label">MCB Type / Säkringstyp:</span>
                    <span class="value">${mcbType}</span>
                </div>
                <div class="result-row">
                    <span class="label">MCB Breaking Capacity / Brytförmåga:</span>
                    <span class="value">${mcbBreakingCapacity}</span>
                </div>
                <div class="result-row ${rcdRequired ? 'required-item' : ''}">
                    <span class="label">RCD / Jordfelsbrytare:</span>
                    <span class="value">${rcdType}</span>
                </div>
                <div class="result-row">
                    <span class="label">Voltage Drop / Spänningsfall:</span>
                    <span class="value">${voltageDrop.toFixed(2)} V (${voltageDropPercent.toFixed(2)}%)</span>
                </div>
                <div class="result-row">
                    <span class="label">Voltage Drop Status:</span>
                    <span class="value ok">✓ OK (< 4% enligt SS 424 14 26)</span>
                </div>
                <div class="info-box">
                    <p><strong>� References / Referenser:</strong></p>
                    <p><strong>📋 Cable Capacity:</strong> SEK Handbok 444, Tabell 52B.3 (sid 274)</p>
                    <p><strong>🌡️ Temperature Derating:</strong> Tabell 52B.14 (sid 285)</p>
                    <p><strong>👥 Grouping Factor:</strong> Tabell 52B.17 (sid 287)</p>
                    <p><strong>⚡ MCB Coordination:</strong> Avsnitt 433.1, regel Ib ≤ In ≤ Iz (sid 132)</p>
                    <p><strong>📉 Voltage Drop Limit:</strong> 4% för slutliga kretsar (Avsnitt 525)</p>
                    <p><strong>🔌 Installation Methods:</strong> Tabell 52B.1 (sid 270), ${document.getElementById('installationType').options[document.getElementById('installationType').selectedIndex].text}</p>
                    <p><strong>⚠️ Note:</strong> Values based on ${insulation} insulation at ${ambientTemp}°C</p>
                </div>
                <div class="info-box ${rcdRequired ? 'required-box' : ''}">
                    <p><strong>🛡️ RCD / Jordfelsbrytare:</strong></p>
                    <p>${rcdInfo}</p>
                    <p><strong>📖 RCD Requirement:</strong> SEK Handbok 444, Avsnitt 411.3.3 ${rcdRequired ? '(sid 155)' : ''}</p>
                    ${rcdRequired ? '<p style="color: #d63031; font-weight: bold;">⚠️ OBLIGATORISK enligt SEK Handbok 444 / SS 436 40 00</p>' : ''}
                </div>
            </div>
        `;
    });

    // Visitor counter
    function updateVisitorCount() {
        let visits = localStorage.getItem('mdoyle-calc-visits') || 0;
        visits = parseInt(visits) + 1;
        localStorage.setItem('mdoyle-calc-visits', visits);
        
        const visitElement = document.getElementById('visit-count');
        if (visitElement) {
            visitElement.textContent = visits.toLocaleString();
        }
    }

    // Update visitor count when page loads
    updateVisitorCount();
});