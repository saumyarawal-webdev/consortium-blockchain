# consortium-blockchain
step 1 : make folder with name "consortium-blockchain"

step 2 : cd consortium-blockchain

step 3 : npm init -y && npm install express body-parser

step 4 : download and install postman in pc.

step 5 : execute command "node server.js"

step 6 : use following urls in postman for getting existing blocks, add/mine new block, delete block.

GET: http://localhost:3000/blockchain POST: http://localhost:3000/mineBlock Verify : http://localhost:3000/verify Delete: http://localhost:3000/delete/{index}

while mining block go to body, select json, add new object, pass authorized users in header and click send.

JSON Format for private blockchain mineBlock: { "data": "Your block data"}

Header Format for mining or deleting block :
Content-Type: application/json
username: user1

Note : Current authorized users are 'user1' and 'user2'. Note : Manage authorized users from blockchain.js
