# 🚀 Quick Start Guide

Get up and running in 5 minutes!

## Step 1: Install Node.js

If you don't have Node.js installed:
- Download from: https://nodejs.org/
- Choose the LTS (Long Term Support) version
- Verify installation: `node --version`

## Step 2: Install Dependencies

Open terminal in the `Carbon-Footprint-Calculator` directory and run:

```bash
npm install
```

Wait for all packages to install (this may take a minute).

## Step 3: Get Your Climatiq API Key

1. Go to: https://www.climatiq.io/
2. Click "Sign Up" (it's FREE!)
3. Verify your email
4. Go to your Dashboard
5. Click "API Keys" or "Generate API Key"
6. Copy the API key

## Step 4: Create .env File

### Option A: Manual Creation

1. Create a new file named `.env` in the `Carbon-Footprint-Calculator` folder
2. Copy the content from `ENV_TEMPLATE.txt`
3. Replace `your_actual_climatiq_api_key_here` with your real API key
4. Save the file

### Option B: Command Line

**Windows (PowerShell):**
```powershell
Copy-Item ENV_TEMPLATE.txt .env
```

**Mac/Linux:**
```bash
cp ENV_TEMPLATE.txt .env
```

Then edit the `.env` file and add your API key.

## Step 5: Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

You should see:
```
🌍 Carbon Footprint Calculator running on http://localhost:3000
```

## Step 6: Open in Browser

Open your browser and go to:
```
http://localhost:3000
```

## Step 7: Test It Out!

1. Select "⚡ Electricity Usage" from the dropdown
2. Enter: `100` for energy amount
3. Select unit: `kWh`
4. Select region: `US`
5. Click "Calculate Emission"

You should see a success message with the CO₂ emission amount!

## 🎉 You're All Set!

Now you can:
- ✅ Track different types of emissions
- ✅ View charts and statistics
- ✅ Get carbon offset suggestions
- ✅ Use the API with Postman

## ⚠️ Troubleshooting

### "CLIMATIQ_API_KEY not found"
- Make sure the `.env` file is in the root directory
- Check that you've added your actual API key
- Restart the server after creating/editing `.env`

### "Port 3000 is already in use"
- Change `PORT=3000` to `PORT=3001` in your `.env` file
- Or stop other applications using port 3000

### "Cannot find module"
- Run `npm install` again
- Delete `node_modules` folder and run `npm install`

### API returns errors
- Verify your Climatiq API key is correct
- Check your account status on climatiq.io
- Ensure you haven't exceeded the free tier limits

## 📚 Next Steps

- Read the full README.md for detailed documentation
- Import postman_collection.json to test the API
- Explore different activity types and inputs
- Check out the charts and visualizations

## 🆘 Need Help?

- Check the main README.md
- Visit Climatiq documentation: https://www.climatiq.io/docs
- Review the API endpoints in the Postman collection

---

Happy Carbon Tracking! 🌱

