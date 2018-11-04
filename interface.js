/*
ETC Node Server
Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===modules===================================================|
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const fs = require('fs');
const base64 = require ('base-64');
const http = require ('http');
//var rp = require ('request-promise-native');

const logs = require('./logs');
const w3fx = require('./web3_fx');
//-o_o===init======================================================|
const NODE_PORT = process.env.N_PORT;
const S_PORT = process.env.S_PORT;
const node_addr = `http://localhost:${NODE_PORT}`;

let app = express();
app.use(helmet());
app.use(helmet.noCache());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//===create-wallet-====================================================|
app.post('/create_wallet',(req,res)=>{
  try{
    let privateKey = req.body.priv;
    w3fx.account_from_key(privateKey)
    .then((account)=>{
      console.log(account);
      res.send(account);
    })
    .catch((e)=>{
      console.log(e);
      res.send(e);
    })
  }
  catch(e){
    console.log(e);
    res.send(e);
  }

})
//===load-wallet-====================================================|
//===AccountGen-====================================================|
app.post('/new_account',(req,res)=>{
  try{
    w3fx.new_account()
    .then((account)=>{
      console.log('Created new account: ',account);
      res.send(account);
    })
    .catch((e)=>{
      console.log("Error creating new account", e);
      res.send(e);
    });
  }
  catch(e){
  	res.send(e);
  }
})
//===TxDetail-=====================================================|
app.post('/tx_detail',(req,res)=>{
  try{
   let txid = req.body.txid;
   w3fx.tx_detail(txid)
   .then((details)=>{
    console.log('Tx_Detail: ',details);
    res.send(details);
  })
  .catch((e)=>{
    console.log("Error creating new account", e);
    res.send(e);
  });
}
catch(e){
  res.send(e);
}
  
});
//===get_block=====-==================================================|
app.post('/height',(req,res)=>{
  try{
    w3fx.block_height()
    .then((height)=>{
      console.log('Current block height: ',height);
      res.send(height);
    })
    .catch((e)=>{
      console.log("Error creating new account", e);
      res.send(e);
    });
  }
  catch(e){
  	res.send(e);
  }
});
//===account_from_privateey-========================================|
//===CONNECT=====-==================================================|

app.listen(S_PORT,()=>{
 console.log(`Listening on port ${S_PORT}`);
})
//===FIN=====-==================================================|
