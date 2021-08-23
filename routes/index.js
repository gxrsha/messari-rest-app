var express = require('express');
var router = express.Router();
const axios = require('axios');
const { sumOfVolume, swapsOccuredOnBlock } = require('../helperFunctions/helpers');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Messari' });
});

router.get('/test', function(req, res) {
  console.log('we are in the test route');
  axios.get("https://api.neoscan.io/api/main_net/v1/get_all_nodes")
  .then(response => res.json(response.data))
  .catch(err => res.send(err));
});


// Route to see all associated pools given an asset ID
router.post('/pool/:assetId', function(req, res, next) {
  if (!req.params.assetId) {
    const err = new Error('assetId is required');
    err.status = 400;
    next(err);
  }
  axios({
    url: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-alt',
    method: 'post',
    data: {
      query: `
      {
        pools(where: {
          token0: "${req.params.assetId}"
        }) {
          id
        }
      }      
      `
    }
  })
  .then(response => {
    console.log('this is the response: ', response.data.data)
    res.status(200).json(response.data.data)
  })
  .catch(err => {
    console.log('there was an error processing the request: ', err)
    res.status(400).send(err)
  })
});


// Given an asset ID find trading volume between given time range
router.post('/volume/:assetId', function(req, res, next) {
  if (!req.query.startDate || !req.query.endDate) {
    const err = new Error('Required query params missing');
    err.status = 400;
    next(err);
  }
  axios({
    url: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-alt',
    method: 'post',
    data: {
      query: `
      {
        tokens (where: {
          id: "${req.params.assetId}"
        }) {
         symbol
          tokenDayData(where: {
            date_gt: ${req.query.startDate},
            date_lt: ${req.query.endDate}}) {
            volumeUSD
          }
        }
      }
      `
    }
  })
  .then(response => {
    console.log('this is the response: ', response.data.data);
    try {
      let sum = sumOfVolume(response)
      res.status(200).json({
        'totalVolume': sum
      })
    } catch (err) {
      console.log(err)
    }
  })
  .catch(err => {
    res.status(400).send('There was an error: ', err)
  })

})

// Route to query for block number and get all swap information associated with it
router.post('/blockinfo/:blockNumber', function(req, res, next) {
  if (!req.params.blockNumber) {
    const err = new Error('Block number is required');
    err.status = 400;
    next(err);
  }
  axios({
    url: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-alt',
    method: 'post',
    data: {
      query: `
      {
        transactions(where: {
          blockNumber: ${req.params.blockNumber}
        }) {
          swaps {
            id
            token0 {
              symbol
              id
            }
            token1 {
              symbol
              id
            }
          }
        }
        }
      `
    }
  })
  .then(response => {
    try {
        let responseObj = swapsOccuredOnBlock(response, req.params.blockNumber)
        res.status(200).json(responseObj)
    } catch(err) {
        console.log('there was an error: ', err)
    }
  })
  .catch(err => {
    res.status(400).send('There was an error: ', err)
  })


})

module.exports = router;
