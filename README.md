# Electrical Installation Calculator

This web application allows users to perform electrical installation calculations based on Swedish regulations. It provides functionalities for calculating power metrics, voltage drop, and determining the required cable size and type based on various external factors and installation types.

## Features

- Calculate kW, amps, and volts based on user input.
- Determine voltage drop in electrical installations.
- Calculate required cable size and type based on power and installation conditions.
- Adhere to Swedish electrical regulations and standards.

## Project Structure

```
electrical-calculator-app
├── src
│   ├── index.html          # Main HTML document
│   ├── styles              # Contains CSS files
│   │   └── main.css        # Styles for the web application
│   ├── scripts             # Contains JavaScript files
│   │   ├── app.js          # Main JavaScript file
│   │   ├── calculations     # Calculation modules
│   │   │   ├── powerCalculations.js  # Power calculations
│   │   │   ├── voltDropCalculations.js # Voltage drop calculations
│   │   │   └── cableSizing.js # Cable sizing calculations
│   │   ├── regulations      # Regulations modules
│   │   │   └── swedishStandards.js # Swedish standards
│   │   └── utils           # Utility functions
│   │       └── validation.js # Input validation
│   └── data                # Data files
│       ├── cableTypes.json  # Cable types data
│       └── installationTypes.json # Installation types data
├── package.json            # npm configuration file
└── README.md               # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd electrical-calculator-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Open `src/index.html` in a web browser.
2. Follow the on-screen instructions to perform calculations.
3. Input the necessary parameters and view the results.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.