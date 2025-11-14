const axios = require('axios');

class GoldStandardService {
  constructor() {
    this.apiKey = process.env.GOLD_STANDARD_API_KEY;
    this.baseUrl = process.env.GOLD_STANDARD_API_URL || 'https://api.goldstandard.org';
    
    if (!this.apiKey) {
      console.warn('⚠️  GOLD_STANDARD_API_KEY not found - offset suggestions will be limited');
    }

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Get offset project suggestions based on CO2 emissions
   * @param {number} co2Amount - Amount of CO2 in kg
   * @returns {Promise<Object>} - Offset suggestions
   */
  async getOffsetSuggestions(co2Amount) {
    try {
      // Note: This is a placeholder implementation
      // Actual Gold Standard API endpoints may differ
      // You'll need to adjust based on their actual API documentation
      
      if (!this.apiKey) {
        return this.getMockOffsetSuggestions(co2Amount);
      }

      const response = await this.client.get('/projects', {
        params: {
          co2_amount: co2Amount
        }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Gold Standard API Error:', error.response?.data || error.message);
      // Return mock data as fallback
      return this.getMockOffsetSuggestions(co2Amount);
    }
  }

  /**
   * Mock offset suggestions (used when API key is not available)
   */
  getMockOffsetSuggestions(co2Amount) {
    const co2Tons = co2Amount / 1000;
    const pricePerTon = 15; // Average price per ton
    const estimatedCost = (co2Tons * pricePerTon).toFixed(2);

    return {
      success: true,
      data: {
        total_co2_kg: co2Amount,
        total_co2_tons: co2Tons.toFixed(3),
        estimated_offset_cost: {
          amount: estimatedCost,
          currency: 'USD'
        },
        suggested_projects: [
          {
            id: 'mock-1',
            name: 'Renewable Energy - Wind Farm Project',
            type: 'Renewable Energy',
            location: 'India',
            description: 'Supporting wind energy generation to replace fossil fuel power',
            price_per_ton: 12,
            certification: 'Gold Standard',
            sdg_goals: ['Affordable and Clean Energy', 'Climate Action'],
            url: 'https://www.goldstandard.org/projects'
          },
          {
            id: 'mock-2',
            name: 'Forest Conservation Project',
            type: 'Forestry',
            location: 'Brazil',
            description: 'Protecting existing forests and preventing deforestation',
            price_per_ton: 15,
            certification: 'Gold Standard',
            sdg_goals: ['Life on Land', 'Climate Action'],
            url: 'https://www.goldstandard.org/projects'
          },
          {
            id: 'mock-3',
            name: 'Clean Cooking Stoves',
            type: 'Community',
            location: 'Kenya',
            description: 'Distributing efficient cooking stoves to reduce wood consumption',
            price_per_ton: 18,
            certification: 'Gold Standard',
            sdg_goals: ['Good Health', 'Affordable Clean Energy', 'Climate Action'],
            url: 'https://www.goldstandard.org/projects'
          }
        ],
        recommendations: [
          `To offset ${co2Tons.toFixed(2)} tons of CO₂, consider investing in carbon offset projects`,
          'Gold Standard certified projects ensure high-quality, verified carbon reductions',
          'Choose projects aligned with UN Sustainable Development Goals (SDGs)'
        ]
      },
      mock: true
    };
  }

  /**
   * Calculate offset cost
   */
  calculateOffsetCost(co2Kg, pricePerTon = 15) {
    const co2Tons = co2Kg / 1000;
    return {
      co2_kg: co2Kg,
      co2_tons: co2Tons,
      price_per_ton: pricePerTon,
      total_cost: co2Tons * pricePerTon,
      currency: 'USD'
    };
  }

  /**
   * Get project details
   */
  async getProjectDetails(projectId) {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: 'API key not configured'
        };
      }

      const response = await this.client.get(`/projects/${projectId}`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Gold Standard API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || { message: error.message }
      };
    }
  }
}

module.exports = new GoldStandardService();

