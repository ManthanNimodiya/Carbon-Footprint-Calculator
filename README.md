# 🌍 Carbon Footprint Calculator

A comprehensive web application for tracking and visualizing carbon emissions using the Climatiq API. Calculate CO₂e emissions from various activities including electricity usage, travel, freight, purchases, and fuel consumption.

![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![Express](https://img.shields.io/badge/Express-4.18-blue)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4-orange)
![License](https://img.shields.io/badge/License-ISC-yellow)

## ✨ Features

- **🔢 Multiple Activity Types**: Track emissions from:
  - ⚡ Electricity consumption
  - 🚗 Travel (car, bus, train, plane, motorcycle)
  - 📦 Freight/shipping
  - 🛒 Procurement/purchases
  - ⛽ Fuel consumption

- **📊 Data Visualization**: 
  - Daily emission trends (7-day view)
  - Weekly aggregated data (4-week view)
  - Activity type breakdown
  - Real-time statistics dashboard

- **🌱 Carbon Offset Suggestions**:
  - Automatic offset cost calculation
  - Recommended offset projects via Gold Standard API
  - Project details including SDG goals and certifications

- **💾 Data Storage**:
  - In-memory data store (easily replaceable with database)
  - Historical activity tracking
  - Daily/weekly aggregations

- **🎨 Modern UI**:
  - Responsive design
  - Interactive charts with Chart.js
  - Real-time toast notifications
  - Clean, gradient-based styling

## 🏗️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client for API calls
- **Dotenv** - Environment variable management

### Frontend
- **HTML5/CSS3** - Structure and styling
- **Vanilla JavaScript** - Frontend logic
- **Chart.js** - Data visualization

### APIs
- **Climatiq API** - Carbon emission calculations
- **Gold Standard API** - Offset project recommendations (bonus)

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Climatiq API Key** - [Get one here](https://www.climatiq.io/)
- **Gold Standard API Key** (optional) - For offset suggestions

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
cd Carbon-Footprint-Calculator
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- dotenv
- cors
- axios
- body-parser
- nodemon (dev dependency)

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# For Windows (PowerShell)
New-Item -Path .env -ItemType File

# For Mac/Linux
touch .env
```

Add the following configuration to your `.env` file:

```env
# Server Configuration
PORT=3000

# Climatiq API Configuration (REQUIRED)
CLIMATIQ_API_KEY=your_actual_climatiq_api_key_here
CLIMATIQ_API_URL=https://api.climatiq.io

# Gold Standard API Configuration (OPTIONAL - for offset suggestions)
GOLD_STANDARD_API_KEY=your_gold_standard_api_key_here
GOLD_STANDARD_API_URL=https://api.goldstandard.org

# Environment
NODE_ENV=development
```

**⚠️ Important**: Replace `your_actual_climatiq_api_key_here` with your real Climatiq API key!

### 4. Get Your Climatiq API Key

1. Go to [https://www.climatiq.io/](https://www.climatiq.io/)
2. Sign up for a free account
3. Navigate to your dashboard
4. Generate an API key
5. Copy the key and paste it into your `.env` file

### 5. Start the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

You should see:
```
🌍 Carbon Footprint Calculator running on http://localhost:3000
📊 API endpoints available at http://localhost:3000/api
🔑 Make sure to set your CLIMATIQ_API_KEY in .env file
```

### 6. Open in Browser

Navigate to: **http://localhost:3000**

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Emissions Endpoints

#### Calculate Emission
**POST** `/api/emissions/calculate`

Calculate emissions for a specific activity.

**Request Body Examples:**

**Electricity:**
```json
{
  "activity_type": "electricity",
  "energy": 100,
  "energy_unit": "kWh",
  "region": "US",
  "year": 2022
}
```

**Travel:**
```json
{
  "activity_type": "travel",
  "distance": 50,
  "distance_unit": "km",
  "vehicle_type": "car",
  "fuel_type": "petrol",
  "region": "GB"
}
```

**Freight:**
```json
{
  "activity_type": "freight",
  "weight": 500,
  "weight_unit": "kg",
  "distance": 1000,
  "distance_unit": "km",
  "transport_mode": "truck"
}
```

**Procurement:**
```json
{
  "activity_type": "procurement",
  "money": 500,
  "money_unit": "usd",
  "category": "consumer_goods-type_consumer_goods",
  "region": "US"
}
```

**Fuel:**
```json
{
  "activity_type": "fuel",
  "volume": 50,
  "volume_unit": "l",
  "fuel_type": "petrol"
}
```

#### Batch Calculate
**POST** `/api/emissions/batch`

Calculate multiple emissions at once.

```json
{
  "emissions": [
    {
      "activity_type": "electricity",
      "energy": 50,
      "energy_unit": "kWh",
      "region": "US"
    },
    {
      "activity_type": "travel",
      "distance": 30,
      "distance_unit": "km",
      "vehicle_type": "car",
      "fuel_type": "petrol",
      "region": "GB"
    }
  ]
}
```

#### Get History
**GET** `/api/emissions/history`

Get all emission records.

#### Get Daily Emissions
**GET** `/api/emissions/daily?days=7`

Get daily aggregated emissions (default: 7 days).

#### Get Weekly Emissions
**GET** `/api/emissions/weekly?weeks=4`

Get weekly aggregated emissions (default: 4 weeks).

#### Get Statistics
**GET** `/api/emissions/statistics`

Get overall emission statistics.

#### Get Today's Emissions
**GET** `/api/emissions/today`

Get emissions recorded today.

#### Delete Emission
**DELETE** `/api/emissions/:id`

Delete a specific emission record.

#### Search Emission Factors
**GET** `/api/emissions/search?query=electricity&region=US`

Search available emission factors from Climatiq.

### Offset Endpoints

#### Get Offset Suggestions
**GET** `/api/offsets/suggestions?co2_kg=100`

Get carbon offset project suggestions for a specific amount.

#### Calculate Offset Cost
**POST** `/api/offsets/calculate`

```json
{
  "co2_kg": 100,
  "price_per_ton": 15
}
```

#### Get Total Offset Suggestions
**GET** `/api/offsets/total`

Get offset suggestions for all tracked emissions.

## 🧪 Testing with Postman

1. Import the provided `postman_collection.json` file into Postman
2. The collection includes all API endpoints with example requests
3. Update the base URL if your server runs on a different port

**To import:**
1. Open Postman
2. Click "Import"
3. Select `postman_collection.json`
4. Start testing!

## 📁 Project Structure

```
Carbon-Footprint-Calculator/
├── public/                    # Frontend files
│   ├── index.html            # Main HTML page
│   ├── styles.css            # Styling
│   └── app.js                # Frontend JavaScript
├── routes/                    # API routes
│   ├── emissions.js          # Emission calculation routes
│   └── offsets.js            # Offset suggestion routes
├── services/                  # Business logic
│   ├── climatiqService.js    # Climatiq API integration
│   ├── goldStandardService.js # Gold Standard API integration
│   └── dataStore.js          # In-memory data storage
├── server.js                  # Express server setup
├── package.json              # Dependencies
├── .env                      # Environment variables (create this)
├── .gitignore               # Git ignore rules
├── postman_collection.json  # Postman API collection
└── README.md                # This file
```

## 🎯 Usage Guide

### Adding Activities

1. **Select Activity Type**: Choose from the dropdown (electricity, travel, freight, etc.)
2. **Fill in Details**: Form fields will update based on your selection
3. **Calculate**: Click "Calculate Emission" button
4. **View Results**: See the emission amount and updated statistics

### Viewing Data

- **Statistics Cards**: Real-time overview of total emissions, activities, and daily average
- **Daily Chart**: Line chart showing emissions over the last 7 days
- **Weekly Chart**: Bar chart showing emissions over the last 4 weeks
- **Activity Chart**: Doughnut chart breaking down emissions by activity type
- **Recent Activities**: List of recently tracked activities

### Carbon Offsets

Once you have tracked emissions, the offset section will automatically appear showing:
- Total emissions summary
- Estimated offset cost
- Recommended offset projects
- Project details and pricing

## 🔧 Configuration Options

### Supported Regions
- US - United States
- GB - United Kingdom
- DE - Germany
- FR - France
- IN - India
- CN - China
- AU - Australia
- CA - Canada

### Supported Units

**Energy:**
- kWh (Kilowatt-hour)
- MWh (Megawatt-hour)
- GJ (Gigajoule)

**Distance:**
- km (Kilometers)
- mi (Miles)

**Weight:**
- kg (Kilograms)
- t (Metric Tons)
- lb (Pounds)

**Volume:**
- l (Liters)
- gal (Gallons)

**Currency:**
- USD, EUR, GBP, INR, CNY

### Vehicle Types
- Car (with fuel options: petrol, diesel, electric, hybrid)
- Bus
- Train
- Airplane
- Motorcycle

### Transport Modes (Freight)
- Truck
- Ship
- Airplane
- Train

## 🗄️ Database Integration

Currently, the application uses an in-memory data store. For production use, replace `services/dataStore.js` with a proper database implementation:

**Recommended Options:**
- **MongoDB** with Mongoose
- **PostgreSQL** with Sequelize
- **MySQL** with Sequelize
- **SQLite** for lightweight applications

The data structure is simple and can be easily migrated to any database system.

## 🐛 Troubleshooting

### API Key Issues
**Problem:** "CLIMATIQ_API_KEY not found"
**Solution:** 
1. Ensure `.env` file exists in the root directory
2. Verify the API key is correct
3. Restart the server after adding the key

### Port Already in Use
**Problem:** "Port 3000 is already in use"
**Solution:**
1. Change PORT in `.env` to a different value (e.g., 3001)
2. Or stop the process using port 3000

### CORS Errors
**Problem:** CORS policy blocking requests
**Solution:** The app already has CORS enabled. If issues persist, check your browser console for specific errors.

### Climatiq API Errors
**Problem:** API returns 400 or 401 errors
**Solution:**
1. Verify your API key is valid
2. Check your Climatiq account status and quota
3. Ensure request body matches the expected format

## 🚀 Deployment

### Heroku
```bash
heroku create your-app-name
heroku config:set CLIMATIQ_API_KEY=your_key_here
git push heroku main
```

### Vercel
```bash
vercel --prod
# Add environment variables in Vercel dashboard
```

### Docker
Create a `Dockerfile`:
```dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📝 License

ISC License

## 🙏 Credits

- **Climatiq API** - For comprehensive emission factor data
- **Chart.js** - For beautiful data visualization
- **Gold Standard** - For carbon offset project information

## 📞 Support

For issues related to:
- **Climatiq API**: [Climatiq Documentation](https://www.climatiq.io/docs)
- **This Application**: Open an issue in the repository

## 🔮 Future Enhancements

- [ ] User authentication and accounts
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Export data to CSV/PDF
- [ ] Mobile app version
- [ ] Team/organization features
- [ ] Goals and targets tracking
- [ ] Integration with more carbon APIs
- [ ] Advanced analytics and reporting
- [ ] Comparison with industry benchmarks

---

**Made with 💚 for a sustainable future**

🌍 Track your carbon footprint. Make informed decisions. Offset responsibly.
