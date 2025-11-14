// API Base URL
const API_URL = '/api';

// Chart instances
let dailyChart = null;
let weeklyChart = null;
let activityChart = null;

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    loadStatistics();
    loadHistory();
    loadDailyData();
    loadWeeklyData();
});

// Update form fields based on selected activity type
function updateFormFields() {
    const activityType = document.getElementById('activityType').value;
    const dynamicFields = document.getElementById('dynamicFields');
    
    if (!activityType) {
        dynamicFields.innerHTML = '';
        return;
    }
    
    let html = '';
    
    switch (activityType) {
        case 'electricity':
            html = `
                <div class="form-group">
                    <label for="energy">Energy Amount:</label>
                    <input type="number" id="energy" placeholder="e.g., 100" required>
                </div>
                <div class="form-group">
                    <label for="energy_unit">Energy Unit:</label>
                    <select id="energy_unit">
                        <option value="kWh">kWh (Kilowatt-hour)</option>
                        <option value="MWh">MWh (Megawatt-hour)</option>
                        <option value="GJ">GJ (Gigajoule)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="region">Region:</label>
                    <select id="region">
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="IN">India</option>
                        <option value="CN">China</option>
                        <option value="AU">Australia</option>
                        <option value="CA">Canada</option>
                    </select>
                </div>
                <div class="info-box">
                    💡 Enter your electricity consumption to calculate emissions from grid energy use.
                </div>
            `;
            break;
            
        case 'travel':
            html = `
                <div class="form-group">
                    <label for="distance">Distance:</label>
                    <input type="number" id="distance" placeholder="e.g., 50" required>
                </div>
                <div class="form-group">
                    <label for="distance_unit">Distance Unit:</label>
                    <select id="distance_unit">
                        <option value="km">Kilometers (km)</option>
                        <option value="mi">Miles (mi)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="vehicle_type">Vehicle Type:</label>
                    <select id="vehicle_type">
                        <option value="car">Car</option>
                        <option value="bus">Bus</option>
                        <option value="train">Train</option>
                        <option value="plane">Airplane</option>
                        <option value="motorcycle">Motorcycle</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="fuel_type">Fuel Type (for cars):</label>
                    <select id="fuel_type">
                        <option value="petrol">Petrol/Gasoline</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </div>
                <div class="info-box">
                    🚗 Calculate emissions from your travel activities including commuting and trips.
                </div>
            `;
            break;
            
        case 'freight':
            html = `
                <div class="form-row">
                    <div class="form-group">
                        <label for="weight">Weight:</label>
                        <input type="number" id="weight" placeholder="e.g., 500" required>
                    </div>
                    <div class="form-group">
                        <label for="weight_unit">Weight Unit:</label>
                        <select id="weight_unit">
                            <option value="kg">Kilograms (kg)</option>
                            <option value="t">Metric Tons (t)</option>
                            <option value="lb">Pounds (lb)</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="distance">Distance:</label>
                        <input type="number" id="distance" placeholder="e.g., 1000" required>
                    </div>
                    <div class="form-group">
                        <label for="distance_unit">Distance Unit:</label>
                        <select id="distance_unit">
                            <option value="km">Kilometers (km)</option>
                            <option value="mi">Miles (mi)</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="transport_mode">Transport Mode:</label>
                    <select id="transport_mode">
                        <option value="truck">Truck</option>
                        <option value="ship">Ship</option>
                        <option value="plane">Airplane</option>
                        <option value="train">Train</option>
                    </select>
                </div>
                <div class="info-box">
                    📦 Calculate emissions from shipping and freight transportation.
                </div>
            `;
            break;
            
        case 'procurement':
            html = `
                <div class="form-group">
                    <label for="money">Amount Spent:</label>
                    <input type="number" id="money" placeholder="e.g., 500" required>
                </div>
                <div class="form-group">
                    <label for="money_unit">Currency:</label>
                    <select id="money_unit">
                        <option value="usd">USD ($)</option>
                        <option value="eur">EUR (€)</option>
                        <option value="gbp">GBP (£)</option>
                        <option value="inr">INR (₹)</option>
                        <option value="cny">CNY (¥)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="category">Purchase Category:</label>
                    <select id="category">
                        <option value="consumer_goods-type_consumer_goods">Consumer Goods</option>
                        <option value="food_and_beverages">Food & Beverages</option>
                        <option value="electronics">Electronics</option>
                        <option value="clothing">Clothing & Textiles</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="region">Region:</label>
                    <select id="region">
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                    </select>
                </div>
                <div class="info-box">
                    🛒 Calculate emissions from purchases and procurement activities.
                </div>
            `;
            break;
            
        case 'fuel':
            html = `
                <div class="form-group">
                    <label for="volume">Fuel Volume:</label>
                    <input type="number" id="volume" placeholder="e.g., 50" required>
                </div>
                <div class="form-group">
                    <label for="volume_unit">Volume Unit:</label>
                    <select id="volume_unit">
                        <option value="l">Liters (L)</option>
                        <option value="gal">Gallons (gal)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="fuel_type">Fuel Type:</label>
                    <select id="fuel_type">
                        <option value="petrol">Petrol/Gasoline</option>
                        <option value="diesel">Diesel</option>
                        <option value="natural_gas">Natural Gas</option>
                        <option value="lpg">LPG</option>
                    </select>
                </div>
                <div class="info-box">
                    ⛽ Calculate emissions from direct fuel consumption.
                </div>
            `;
            break;
    }
    
    dynamicFields.innerHTML = html;
}

// Calculate emission
async function calculateEmission(event) {
    const activityType = document.getElementById('activityType').value;
    
    if (!activityType) {
        showToast('Please select an activity type', 'error');
        return;
    }
    
    // Gather form data
    const formData = {
        activity_type: activityType
    };
    
    // Get all input and select elements in dynamic fields
    const dynamicFields = document.getElementById('dynamicFields');
    const inputs = dynamicFields.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        if (input.value) {
            formData[input.id] = input.value;
        }
    });
    
    // Validate required fields
    const requiredInputs = dynamicFields.querySelectorAll('input[required]');
    for (let input of requiredInputs) {
        if (!input.value) {
            showToast(`Please fill in ${input.previousElementSibling.textContent}`, 'error');
            return;
        }
    }
    
    // Get the button element
    const button = event ? event.target : document.querySelector('.btn-primary');
    if (!button) {
        showToast('❌ Button not found', 'error');
        return;
    }
    
    const originalText = button.textContent;
    
    try {
        // Show loading state
        button.disabled = true;
        button.classList.add('loading');
        button.textContent = 'Calculating...';
        
        const response = await fetch(`${API_URL}/emissions/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        // Re-enable button BEFORE doing anything else
        button.disabled = false;
        button.classList.remove('loading');
        button.textContent = originalText;
        
        if (result.success) {
            showToast(`✅ Emission calculated: ${result.data.co2e_kg.toFixed(2)} kg CO₂e`, 'success');
            
            // Reset form after re-enabling button
            document.getElementById('activityType').value = '';
            updateFormFields();
            
            // Reload data
            loadStatistics();
            loadHistory();
            loadDailyData();
            loadWeeklyData();
            loadActivityData();
            loadOffsetSuggestions();
        } else {
            // Show detailed error message
            const errorMsg = result.error.message || result.error || 'Calculation failed';
            showToast(`❌ Error: ${errorMsg}`, 'error');
            console.error('API Error:', result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('❌ Network error. Please check your connection.', 'error');
        
        // Re-enable button on error
        if (button) {
            button.disabled = false;
            button.classList.remove('loading');
            button.textContent = originalText;
        }
    }
}

// Load statistics
async function loadStatistics() {
    try {
        const response = await fetch(`${API_URL}/emissions/statistics`);
        const result = await response.json();
        
        if (result.success) {
            const stats = result.data;
            document.getElementById('totalEmissions').textContent = 
                `${stats.total_emissions_kg.toFixed(2)} kg`;
            document.getElementById('totalActivities').textContent = stats.total_activities;
            document.getElementById('dailyAverage').textContent = 
                `${stats.daily_average_kg} kg`;
            
            // Calculate offset cost
            const offsetCost = (parseFloat(stats.total_emissions_kg) / 1000 * 15).toFixed(2);
            document.getElementById('offsetCost').textContent = `$${offsetCost}`;
            
            // Load activity chart
            if (stats.by_activity && stats.by_activity.length > 0) {
                loadActivityData();
            }
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Load history
async function loadHistory() {
    try {
        const response = await fetch(`${API_URL}/emissions/history`);
        const result = await response.json();
        
        if (result.success) {
            const historyDiv = document.getElementById('activityHistory');
            
            if (result.data.length === 0) {
                historyDiv.innerHTML = '<div class="empty-state"><p>No activities tracked yet. Add your first activity above!</p></div>';
                return;
            }
            
            // Show last 10 activities
            const recentActivities = result.data.slice(-10).reverse();
            
            historyDiv.innerHTML = recentActivities.map(activity => `
                <div class="activity-item">
                    <div class="activity-header">
                        <span class="activity-type">${getActivityIcon(activity.activity_type)} ${activity.activity_type}</span>
                        <span class="activity-co2">${activity.co2_kg.toFixed(2)} kg CO₂e</span>
                    </div>
                    <div class="activity-details">${formatActivityDetails(activity)}</div>
                    <div class="activity-date">${formatDate(activity.timestamp)}</div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

// Load daily data
async function loadDailyData() {
    try {
        const response = await fetch(`${API_URL}/emissions/daily?days=7`);
        const result = await response.json();
        
        if (result.success) {
            updateDailyChart(result.data);
        }
    } catch (error) {
        console.error('Error loading daily data:', error);
    }
}

// Load weekly data
async function loadWeeklyData() {
    try {
        const response = await fetch(`${API_URL}/emissions/weekly?weeks=4`);
        const result = await response.json();
        
        if (result.success) {
            updateWeeklyChart(result.data);
        }
    } catch (error) {
        console.error('Error loading weekly data:', error);
    }
}

// Load activity breakdown data
async function loadActivityData() {
    try {
        const response = await fetch(`${API_URL}/emissions/statistics`);
        const result = await response.json();
        
        if (result.success && result.data.by_activity) {
            updateActivityChart(result.data.by_activity);
        }
    } catch (error) {
        console.error('Error loading activity data:', error);
    }
}

// Load offset suggestions
async function loadOffsetSuggestions() {
    try {
        const response = await fetch(`${API_URL}/offsets/total`);
        const result = await response.json();
        
        if (result.success && result.emissions_summary.total_co2_kg > 0) {
            displayOffsetSuggestions(result);
        }
    } catch (error) {
        console.error('Error loading offset suggestions:', error);
    }
}

// Display offset suggestions
function displayOffsetSuggestions(data) {
    const offsetSection = document.getElementById('offsetSection');
    const offsetContent = document.getElementById('offsetContent');
    
    const summary = data.emissions_summary;
    const offsets = data.offset_suggestions;
    
    let html = `
        <div class="offset-summary">
            <h3>Your Total Emissions</h3>
            <p><strong>Total CO₂:</strong> ${summary.total_co2_kg.toFixed(2)} kg (${summary.total_co2_tons} tons)</p>
            <p><strong>Total Activities:</strong> ${summary.total_activities}</p>
            <p><strong>Estimated Offset Cost:</strong> $${offsets.estimated_offset_cost.amount} ${offsets.estimated_offset_cost.currency}</p>
        </div>
        
        <h3>Recommended Offset Projects</h3>
        <div class="offset-projects">
    `;
    
    offsets.suggested_projects.forEach(project => {
        html += `
            <div class="project-card">
                <h3>${project.name}</h3>
                <span class="project-type">${project.type}</span>
                <div class="project-location">📍 ${project.location}</div>
                <p>${project.description}</p>
                <div class="project-price">$${project.price_per_ton}/ton CO₂</div>
                <p style="margin-top: 10px; font-size: 0.9em; color: #666;">
                    ✓ ${project.certification} Certified
                </p>
            </div>
        `;
    });
    
    html += '</div>';
    
    if (offsets.recommendations) {
        html += '<div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px;">';
        offsets.recommendations.forEach(rec => {
            html += `<p style="margin: 8px 0;">💡 ${rec}</p>`;
        });
        html += '</div>';
    }
    
    offsetContent.innerHTML = html;
    offsetSection.style.display = 'block';
}

// Initialize charts
function initializeCharts() {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        }
    };
    
    // Daily chart
    const dailyCtx = document.getElementById('dailyChart').getContext('2d');
    dailyChart = new Chart(dailyCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'CO₂e (kg)',
                data: [],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: chartOptions
    });
    
    // Weekly chart
    const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
    weeklyChart = new Chart(weeklyCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'CO₂e (kg)',
                data: [],
                backgroundColor: '#764ba2'
            }]
        },
        options: chartOptions
    });
    
    // Activity chart
    const activityCtx = document.getElementById('activityChart').getContext('2d');
    activityChart = new Chart(activityCtx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#4facfe',
                    '#43e97b'
                ]
            }]
        },
        options: chartOptions
    });
}

// Update daily chart
function updateDailyChart(data) {
    dailyChart.data.labels = data.map(d => formatDateShort(d.date));
    dailyChart.data.datasets[0].data = data.map(d => d.total_co2_kg.toFixed(2));
    dailyChart.update();
}

// Update weekly chart
function updateWeeklyChart(data) {
    weeklyChart.data.labels = data.map(d => 
        `${formatDateShort(d.week_start)} - ${formatDateShort(d.week_end)}`
    );
    weeklyChart.data.datasets[0].data = data.map(d => d.total_co2_kg.toFixed(2));
    weeklyChart.update();
}

// Update activity chart
function updateActivityChart(data) {
    activityChart.data.labels = data.map(d => d.activity_type);
    activityChart.data.datasets[0].data = data.map(d => d.total_co2_kg.toFixed(2));
    activityChart.update();
}

// Helper functions
function getActivityIcon(activityType) {
    const icons = {
        'electricity': '⚡',
        'travel': '🚗',
        'freight': '📦',
        'procurement': '🛒',
        'fuel': '⛽'
    };
    return icons[activityType] || '📊';
}

function formatActivityDetails(activity) {
    const input = activity.input_data;
    let details = [];
    
    if (input.energy) details.push(`${input.energy} ${input.energy_unit}`);
    if (input.distance) details.push(`${input.distance} ${input.distance_unit}`);
    if (input.weight) details.push(`${input.weight} ${input.weight_unit}`);
    if (input.money) details.push(`${input.money} ${input.money_unit}`);
    if (input.volume) details.push(`${input.volume} ${input.volume_unit}`);
    if (input.vehicle_type) details.push(`${input.vehicle_type}`);
    if (input.transport_mode) details.push(`${input.transport_mode}`);
    if (input.region) details.push(`Region: ${input.region}`);
    
    return details.join(' • ');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateShort(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

