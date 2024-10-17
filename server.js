// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const { Blockchain, Block } = require('./blockchain');  // Import Blockchain and Block classes

// Initialize the Express app
const app = express();
const PORT = 3000;

// Create a new instance of Blockchain
const myBlockchain = new Blockchain();

// Define authorized users for consortium blockchain
const authorizedUsers = ['user1', 'user2', 'user3'];

// Use middleware to parse JSON data
app.use(bodyParser.json());

// Authorization middleware
const checkAuthorization = (req, res, next) => {
    const username = req.headers['username']; // Get the username from headers

    console.log('Received username:', username); // Log the received username

    if (!username || !authorizedUsers.includes(username)) {
        console.log('Unauthorized access attempt:', username); // Log unauthorized access
        return res.status(401).json({ message: 'Unauthorized user' });
    }

    next(); // User is authorized, proceed to the next middleware or route handler
};

// Define the /blockchain route (GET)
app.get('/blockchain', (req, res) => {
    console.log('GET request received at /blockchain'); // Log when this endpoint is hit
    console.log('Current Blockchain:', JSON.stringify(myBlockchain, null, 2)); // Log the current state of the blockchain
    res.json(myBlockchain);
});

// Define the /mineBlock route (POST) with authorization
app.post('/mineBlock', checkAuthorization, (req, res) => {
    const data = req.body.data;  // Extract data from the request

    // Create a new Block using the Block class
    const newBlock = new Block(
        myBlockchain.chain.length,     // index
        new Date().toLocaleString(),   // timestamp
        data,                          // transaction data
        myBlockchain.getLatestBlock().hash  // previousHash
    );

    // Add the new block to the blockchain
    myBlockchain.addBlock(newBlock);

    // Log the new block and the entire blockchain in the terminal
    console.log('New Block Added:', JSON.stringify(newBlock, null, 2));
    console.log('Updated Blockchain:', JSON.stringify(myBlockchain, null, 2));

    // Send response back to Postman
    res.json({ message: 'Block added successfully', blockchain: myBlockchain });
});

// Define the /verify route (GET) to verify the blockchain
app.get('/verify', (req, res) => {
    console.log('GET request received at /verify'); // Log when this endpoint is hit

    const isValid = myBlockchain.isChainValid(); // Check if the blockchain is valid

    if (isValid) {
        console.log('Blockchain is valid');
        res.json({ message: 'Blockchain is valid' });
    } else {
        console.log('Blockchain is not valid');
        res.status(400).json({ message: 'Blockchain is not valid' });
    }
});

// Define the /delete route (DELETE) to delete a block by index with authorization
app.delete('/delete/:index', checkAuthorization, (req, res) => {
    const index = parseInt(req.params.index); // Get the index from the request parameters

    // Check if the index is valid
    if (index < 0 || index >= myBlockchain.chain.length) {
        console.log('Invalid block index:', index); // Log invalid index
        return res.status(400).json({ message: 'Invalid block index' });
    }

    // Remove the block from the blockchain
    const removedBlock = myBlockchain.chain.splice(index, 1)[0]; // Remove block by index

    // Log the removed block and the updated blockchain in the terminal
    console.log('Block Deleted:', JSON.stringify(removedBlock, null, 2));
    console.log('Updated Blockchain:', JSON.stringify(myBlockchain, null, 2));

    // Send response back to Postman
    res.json({ message: 'Block deleted successfully', removedBlock, blockchain: myBlockchain });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Consortium Blockchain server is running on port ${PORT}`);
});
