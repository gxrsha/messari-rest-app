// Helper functions


// gets the sum of all volume collected between two dates
function sumOfVolume(response) {
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    let dataObj = [...response.data.data.tokens]
    let volumeObj = [...dataObj]
    let volumeArray = []
  
    volumeObj[0].tokenDayData.forEach(volume => {
      volumeArray.push(Number(parseFloat(volume.volumeUSD).toFixed(2)))
    })
    let sum = volumeArray.reduce((a,b) => a + b, 0)
  
    return formatter.format(parseFloat(sum).toFixed(2));
  }
  
// Returns a response object where we get all swap IDs of a specfic block and tokens associated with them
  function swapsOccuredOnBlock(response, blockNumber) {
    let dataObj = [...response.data.data.transactions]
    let swapObj = [...dataObj]
    let swapArray = []
  
    for (swap in swapObj) {
        for (transaction in swapObj[swap].swaps) {
            console.log('transaction: ', swapObj[swap].swaps[transaction])
            swapArray.push(swapObj[swap].swaps[transaction])
        }
    }
  
    let responseObj = {
        blockNumber: blockNumber,
        swaps: swapArray,
    }
  
    return responseObj;
  }

  module.exports = {
      sumOfVolume, swapsOccuredOnBlock
  }