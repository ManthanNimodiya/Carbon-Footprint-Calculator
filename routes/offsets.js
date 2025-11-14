const express = require('express');
const router = express.Router();
const goldStandardService = require('../services/goldStandardService');
const dataStore = require('../services/dataStore');

/**
 * GET /api/offsets/suggestions
 * Get carbon offset project suggestions
 */
router.get('/suggestions', async (req, res) => {
  try {
    let co2Amount = parseFloat(req.query.co2_kg);

    // If no amount specified, use total emissions from datastore
    if (!co2Amount || isNaN(co2Amount)) {
      co2Amount = dataStore.getTotalEmissions();
    }

    if (co2Amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'co2_kg must be greater than 0'
      });
    }

    const result = await goldStandardService.getOffsetSuggestions(co2Amount);

    res.json(result);
  } catch (error) {
    console.error('Error getting offset suggestions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/offsets/calculate
 * Calculate offset cost for a specific amount
 */
router.post('/calculate', (req, res) => {
  try {
    const { co2_kg, price_per_ton } = req.body;

    if (!co2_kg || isNaN(co2_kg) || co2_kg <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid co2_kg (greater than 0) is required'
      });
    }

    const cost = goldStandardService.calculateOffsetCost(
      parseFloat(co2_kg),
      price_per_ton ? parseFloat(price_per_ton) : undefined
    );

    res.json({
      success: true,
      data: cost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/offsets/projects/:projectId
 * Get details for a specific offset project
 */
router.get('/projects/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const result = await goldStandardService.getProjectDetails(projectId);

    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/offsets/total
 * Get offset suggestions for total tracked emissions
 */
router.get('/total', async (req, res) => {
  try {
    const totalEmissions = dataStore.getTotalEmissions();
    const stats = dataStore.getStatistics();

    if (totalEmissions === 0) {
      return res.json({
        success: true,
        message: 'No emissions tracked yet',
        data: {
          total_co2_kg: 0,
          total_co2_tons: 0,
          estimated_offset_cost: {
            amount: 0,
            currency: 'USD'
          }
        }
      });
    }

    const offsetSuggestions = await goldStandardService.getOffsetSuggestions(totalEmissions);

    res.json({
      success: true,
      emissions_summary: {
        total_co2_kg: stats.total_emissions_kg,
        total_co2_tons: stats.total_emissions_tons,
        total_activities: stats.total_activities,
        by_activity: stats.by_activity
      },
      offset_suggestions: offsetSuggestions.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

