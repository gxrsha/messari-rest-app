# messari-rest-app
Sample Messari Rest App using Express

## Features

  * Get Pools associated with an assetId
  * Get total volume in USD for given assetId between 2 given days
  * Given a block number, to retrieve the swaps in the block and get all assets associated with swaps


## Quick Start

  To run the program suite, first install the dependencies, then start the server:

  Install dependencies:

```bash
$ npm install
```

  Start the server:

```bash
$ npm start
```

  Navigate to localhost:3000 to test the endpoints

## Routes

  Description: 
  Retrieve all pools that exist that include given `assetId`
```
/pool/:assetId
```

  Description: 
  Retrieve total volume of given asset swapped in a given time range [`startDate`, `endDate`]
```
/volume/:assetId?startDate&endDate
```

  Description: 
  Retrieve all swaps and assets associated with swap given a `blockNumber`
```
/blockInfo/:blockNumber
```

