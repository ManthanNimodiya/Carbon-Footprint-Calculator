/**
 * Simple in-memory data store for emission records
 * In production, you would use a proper database (MongoDB, PostgreSQL, etc.)
 */

class DataStore {
  constructor() {
    this.emissions = [];
  }

  /**
   * Add a new emission record
   */
  addEmission(emissionData) {
    const record = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      ...emissionData
    };
    
    this.emissions.push(record);
    return record;
  }

  /**
   * Get all emissions
   */
  getAllEmissions() {
    return this.emissions;
  }

  /**
   * Get emissions by date range
   */
  getEmissionsByDateRange(startDate, endDate) {
    return this.emissions.filter(emission => {
      const emissionDate = new Date(emission.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return emissionDate >= start && emissionDate <= end;
    });
  }

  /**
   * Get emissions for today
   */
  getTodayEmissions() {
    const today = new Date().toISOString().split('T')[0];
    return this.emissions.filter(emission => emission.date === today);
  }

  /**
   * Get emissions for this week
   */
  getWeekEmissions() {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return this.getEmissionsByDateRange(weekAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
  }

  /**
   * Get emissions for this month
   */
  getMonthEmissions() {
    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    return this.getEmissionsByDateRange(monthAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
  }

  /**
   * Get daily aggregated emissions
   */
  getDailyAggregated(days = 7) {
    const dailyData = {};
    const today = new Date();
    
    // Initialize all days
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = {
        date: dateStr,
        total_co2_kg: 0,
        count: 0,
        activities: {}
      };
    }
    
    // Aggregate emissions
    this.emissions.forEach(emission => {
      if (dailyData[emission.date]) {
        dailyData[emission.date].total_co2_kg += emission.co2_kg || 0;
        dailyData[emission.date].count += 1;
        
        const activity = emission.activity_type || 'other';
        if (!dailyData[emission.date].activities[activity]) {
          dailyData[emission.date].activities[activity] = 0;
        }
        dailyData[emission.date].activities[activity] += emission.co2_kg || 0;
      }
    });
    
    return Object.values(dailyData);
  }

  /**
   * Get weekly aggregated emissions
   */
  getWeeklyAggregated(weeks = 4) {
    const weeklyData = [];
    const today = new Date();
    
    for (let i = weeks - 1; i >= 0; i--) {
      const weekEnd = new Date(today.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekStart = new Date(weekEnd.getTime() - 6 * 24 * 60 * 60 * 1000);
      
      const weekEmissions = this.getEmissionsByDateRange(
        weekStart.toISOString().split('T')[0],
        weekEnd.toISOString().split('T')[0]
      );
      
      const total = weekEmissions.reduce((sum, e) => sum + (e.co2_kg || 0), 0);
      
      weeklyData.push({
        week_start: weekStart.toISOString().split('T')[0],
        week_end: weekEnd.toISOString().split('T')[0],
        total_co2_kg: total,
        count: weekEmissions.length
      });
    }
    
    return weeklyData;
  }

  /**
   * Get emissions by activity type
   */
  getEmissionsByActivity() {
    const byActivity = {};
    
    this.emissions.forEach(emission => {
      const activity = emission.activity_type || 'other';
      if (!byActivity[activity]) {
        byActivity[activity] = {
          activity_type: activity,
          total_co2_kg: 0,
          count: 0
        };
      }
      byActivity[activity].total_co2_kg += emission.co2_kg || 0;
      byActivity[activity].count += 1;
    });
    
    return Object.values(byActivity);
  }

  /**
   * Get total emissions
   */
  getTotalEmissions() {
    return this.emissions.reduce((sum, emission) => sum + (emission.co2_kg || 0), 0);
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const total = this.getTotalEmissions();
    const count = this.emissions.length;
    const average = count > 0 ? total / count : 0;
    
    return {
      total_emissions_kg: total,
      total_emissions_tons: (total / 1000).toFixed(3),
      total_activities: count,
      average_per_activity_kg: average.toFixed(2),
      daily_average_kg: this.getDailyAverage().toFixed(2),
      by_activity: this.getEmissionsByActivity()
    };
  }

  /**
   * Get daily average
   */
  getDailyAverage() {
    if (this.emissions.length === 0) return 0;
    
    const dates = [...new Set(this.emissions.map(e => e.date))];
    const total = this.getTotalEmissions();
    return dates.length > 0 ? total / dates.length : 0;
  }

  /**
   * Clear all data
   */
  clearAll() {
    this.emissions = [];
  }

  /**
   * Delete emission by ID
   */
  deleteEmission(id) {
    const index = this.emissions.findIndex(e => e.id === id);
    if (index !== -1) {
      this.emissions.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return `em_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = new DataStore();

