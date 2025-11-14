const express = require('express');
const router = express.Router();
const climatiqService = require('../services/climatiqService');
const dataStore = require('../services/dataStore');

/**
 * POST /api/emissions/calculate
 * Calculate emissions for various activities
 */
router.post('/calculate', async (req, res) => {
  try {
    const { activity_type, ...activityData } = req.body;

    if (!activity_type) {
      return res.status(400).json({
        error: 'activity_type is required'
      });
    }

    let result;

    // Route to appropriate calculation method based on activity type
    switch (activity_type) {
      case 'electricity':
        result = await climatiqService.calculateElectricity(activityData);
        break;
      
      case 'travel':
        result = await climatiqService.calculateTravel(activityData);
        break;
      
      case 'freight':
        result = await climatiqService.calculateFreight(activityData);
        break;
      
      case 'procurement':
        result = await climatiqService.calculateProcurement(activityData);
        break;
      
      case 'fuel':
        result = await climatiqService.calculateFuel(activityData);
        break;
      
      case 'custom':
        result = await climatiqService.calculateEmission(activityData);
        break;
      
      default:
        return res.status(400).json({
          error: `Unknown activity_type: ${activity_type}. Supported types: electricity, travel, freight, procurement, fuel, custom`
        });
    }

    if (result.success) {
      // Store the emission data
      const emissionRecord = dataStore.addEmission({
        activity_type,
        input_data: activityData,
        co2_kg: result.data.co2e,
        co2_unit: result.data.co2e_unit,
        emission_factor: result.data.emission_factor,
        constituent_gases: result.data.constituent_gases
      });

      res.json({
        success: true,
        message: 'Emission calculated successfully',
        record_id: emissionRecord.id,
        data: {
          co2e_kg: result.data.co2e,
          co2e_unit: result.data.co2e_unit,
          co2e_calculation_method: result.data.co2e_calculation_method,
          emission_factor: result.data.emission_factor,
          constituent_gases: result.data.constituent_gases,
          activity_data: result.data.activity_data
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error calculating emissions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/emissions/batch
 * Calculate multiple emissions in batch
 */
router.post('/batch', async (req, res) => {
  try {
    const { emissions } = req.body;

    if (!Array.isArray(emissions)) {
      return res.status(400).json({
        error: 'emissions array is required'
      });
    }

    const results = [];

    for (const emission of emissions) {
      const { activity_type, ...activityData } = emission;
      
      let result;
      switch (activity_type) {
        case 'electricity':
          result = await climatiqService.calculateElectricity(activityData);
          break;
        case 'travel':
          result = await climatiqService.calculateTravel(activityData);
          break;
        case 'freight':
          result = await climatiqService.calculateFreight(activityData);
          break;
        case 'procurement':
          result = await climatiqService.calculateProcurement(activityData);
          break;
        case 'fuel':
          result = await climatiqService.calculateFuel(activityData);
          break;
        default:
          result = await climatiqService.calculateEmission(activityData);
      }

      if (result.success) {
        const emissionRecord = dataStore.addEmission({
          activity_type,
          input_data: activityData,
          co2_kg: result.data.co2e,
          co2_unit: result.data.co2e_unit,
          emission_factor: result.data.emission_factor
        });

        results.push({
          success: true,
          record_id: emissionRecord.id,
          co2e_kg: result.data.co2e
        });
      } else {
        results.push({
          success: false,
          error: result.error
        });
      }
    }

    const totalCo2 = results
      .filter(r => r.success)
      .reduce((sum, r) => sum + r.co2e_kg, 0);

    res.json({
      success: true,
      total_records: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      total_co2e_kg: totalCo2,
      results
    });
  } catch (error) {
    console.error('Error in batch calculation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/emissions/history
 * Get all emission records
 */
router.get('/history', (req, res) => {
  try {
    const emissions = dataStore.getAllEmissions();
    res.json({
      success: true,
      count: emissions.length,
      data: emissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/emissions/daily
 * Get daily aggregated emissions
 */
router.get('/daily', (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const dailyData = dataStore.getDailyAggregated(days);
    
    res.json({
      success: true,
      period: `${days} days`,
      data: dailyData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/emissions/weekly
 * Get weekly aggregated emissions
 */
router.get('/weekly', (req, res) => {
  try {
    const weeks = parseInt(req.query.weeks) || 4;
    const weeklyData = dataStore.getWeeklyAggregated(weeks);
    
    res.json({
      success: true,
      period: `${weeks} weeks`,
      data: weeklyData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/emissions/statistics
 * Get overall statistics
 */
router.get('/statistics', (req, res) => {
  try {
    const stats = dataStore.getStatistics();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/emissions/today
 * Get today's emissions
 */
router.get('/today', (req, res) => {
  try {
    const emissions = dataStore.getTodayEmissions();
    const total = emissions.reduce((sum, e) => sum + (e.co2_kg || 0), 0);
    
    res.json({
      success: true,
      date: new Date().toISOString().split('T')[0],
      count: emissions.length,
      total_co2_kg: total,
      data: emissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/emissions/:id
 * Delete an emission record
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = dataStore.deleteEmission(id);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Emission record deleted'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Emission record not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/emissions/search
 * Search emission factors
 */
router.get('/search', async (req, res) => {
  try {
    const result = await climatiqService.searchEmissionFactors(req.query);
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

