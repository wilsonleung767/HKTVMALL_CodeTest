const express = require('express');
const app = express();
app.use(express.json());

function calculateShippingFee(items, temperatureCondition) {
    // Rates as defined in the rate card
    const price = {
      "Ambient": { "pricePerKg": 10, "priceAbove5Kg": 15 },
      "Chill": { "pricePerKg": 20, "priceAbove5Kg": 30 }
    };
  
    let totalFee = 0;
    const details = [];
  
    // Loop through each item to calculate individual shipping fees
    items.forEach((item, index) => {
      const { name, length, width, height, weight, quantity } = item;
  
      const volumetricWeight = (length * width * height) / 5000;
  
      // Determine charged weight that is higher
      const chargedWeight = Math.max(weight, volumetricWeight);
  
      const finalPrice = chargedWeight <= 5 ? price[temperatureCondition]["pricePerKg"] : price[temperatureCondition]["priceAbove5Kg"];
  
      const itemFee = finalPrice * chargedWeight * quantity;
      totalFee += itemFee;
  
      details.push({
        itemIndex: index,
        itemName: name,
        calculatedVolumetricWeight: volumetricWeight,
        chargedWeight: chargedWeight,
        shippingFee: itemFee
      });
    });
  
    return { totalShippingFee: totalFee, itemFees: details };
  }

  // API endpoint for calculating shipping fees
app.get('/', (request, response) => {
    response.send('backend for shippingcalculator')
})
app.post('/shipping/calculate', (req, res) => {
  try {
      const { items, temperatureCondition } = req.body;
      const result = calculateShippingFee(items, temperatureCondition);
      res.json(result);
  } catch (error) {
      res.status(500).send('An error occurred while calculating shipping fees.');
  }
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});