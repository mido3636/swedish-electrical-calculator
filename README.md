# Swedish Electrical Calculator ⚡🇸🇪

Professional electrical installation calculator following Swedish standards (SS 424 14 26, SEK Handbok 444) with smart auto-selection features.

## ⚡ Features

- **Smart Auto-Selection**: Automatically selects insulation type based on installation method and ambient temperature based on environment
- **Swedish Standards Compliance**: Full compliance with SS 424 14 26 and SEK Handbok 444
- **Real Cable Specifications**: Uses actual Swedish supplier cable data (H07V-K, EQLQ, AXQJ, etc.)
- **Interactive Shopping List**: Shows exactly which cables to buy with supplier examples
- **Visual Feedback**: Green highlights show which fields are auto-filled
- **Professional Results**: MCB selection, RCD requirements, and complete installation specs

## 🔧 How to Use

1. **Select Installation Type** - The app automatically chooses the right insulation type
2. **Pick Environment** - Ambient temperature is auto-set based on your choice  
3. **Enter Power and Length** - Input your specific installation requirements
4. **Get Complete Results** - Cable sizing, MCB selection, RCD requirements, and shopping list

## 📐 Technical Standards

- **Temperature Derating**: Based on Table 52B.14
- **Grouping Factors**: Following Table 52B.17  
- **Voltage Drop**: Compliant with 4% limit for final circuits
- **Cable Selection**: Real specifications from Swedish suppliers (Ahlsell, Elkedjan, etc.)

## 💡 Smart Features

The calculator automatically handles:
- **Underground/Outdoor installations** → PEX insulation
- **Indoor installations** → PVC insulation  
- **Environment-based temperature settings** with typical values
- **Visual feedback** for auto-selected fields

## 🌐 Getting Online

To deploy your own version:
1. Push this repository to GitHub
2. Go to repository Settings → Pages  
3. Select "Deploy from a branch"
4. Choose "main" branch and "/docs" folder
5. Your calculator will be live at: `https://[username].github.io/[repository-name]/`

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