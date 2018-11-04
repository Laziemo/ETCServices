/*
ETC Node Server
Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===modules===================================================|

const bodyParser = require('body-parser');
const fs = require('fs');
const Web3 = require ('web3');
const Web3ETH =  require('web3-eth');
const Accounts = require('web3-eth-accounts');
const Personal = require('web3-eth-personal');

const logs = require('./logs.js');
//-o_o===init======================================================|
const NODE_PORT = process.env.N_PORT;
const node_addr = `http://localhost:${NODE_PORT}`;

let web3 = new Web3(node_addr);
let accounts = new Accounts(node_addr);
let web3eth = new Web3ETH(node_addr); //use instead of web3.eth
let personal = new Personal(node_addr);


//===new_account=====-==================================================|
let new_account = ()=>{
  return new Promise((resolve,reject)=>{
    try{
      //const time = new Date().getTime();
      
      //Never call this function over a unsecured Websocket or HTTP provider
      //as your password will be send in plain text!
      personal.newAccount("oksw29")
      .then((account)=>{
        console.log(account);
        resolve(account);
      })
      .catch((e)=>{
        console.log(e);
        reject(e);
      });      
    }
    catch(e){
      reject(e);
    }
  });
}
//===account_from_privateey-========================================|
let account_from_key=(privateKey)=>{
  return new Promise((resolve,reject)=>{
    try{
      let account = accounts.privateKeyToAccount(privateKey);
      console.log(account);
      resolve(account);
    }
    catch(e){
      reject(e);
    }
  });
}
//===block_height-========================================|
let block_height = ()=>{
  return new Promise((resolve,reject)=>{
    try{
      web3eth.getBlockNumber((error, result)=>{       
        if(error){
          console.log(error);
          reject(error);
        }
        else{
          console.log(result);
          resolve(String(result));
        }
      });
    }
    catch(e){
      console.log("Final catch at block_height:",e);
      reject(e);
    }
  });
}
//===tx_detail-========================================|
let tx_detail = (txid)=>{
 return new Promise((resolve,reject)=>{
  try{
    let re = new RegExp('^0x([A-Fa-f0-9]{64})$');
    if(re.test(txid)){
    
    web3.eth.getTransaction(txid)
    .then((result)=>{
      resolve ({
        "txid":result.hash,
        "confirmations":web3.eth.blockNumber - result.blockNumber,
        "from":result.from,
        "to":result.to,
        "value": result.value,
        "gas":result.gas,
        "gasPrice":result.gasPrice
      })
    })
    .catch((error)=>{
      reject(error);
    })
    }
    else{
    reject("Invalid TxId");
    }
  }
  catch(e){
  console.log("Final catch at tx_detail",e);
  reject(e);
  }
 });
}
//===sign_tx-========================================|
let sign = (transaction,pk)=>{
  return new Promise((resolve,reject)=>{
    try{
      web3eth.accounts.signTransaction(transaction,pk)
      .then((signed_tx)=>{
        console.log("Signed Transaction: \n", signed_tx);
        resolve (signed_tx.rawTransaction);
      })
      .catch((e)=>{
        console.log("Error in sign_tx:\n",e);
        reject(e);
      })
    }
    catch(e){
      console.log("Final catch at send_tx:",e);
      reject(e);
    }
  });
}
//
//===broadcast-========================================|
let broadcast = (signed_tx)=>{
  return new Promise((resolve,reject)=>{
    try{
      web3eth.sendSignedTransaction(signed_tx)
      .then((result)=>{
        console.log("Broadcasted Transaction: \n", result);
        web3.eth.getTransactionReceipt('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b')
        .then((receipt)=>{
          console.log("Got Receipt:\n",receipt);
          resolve (receipt);
        });
      })
      .catch((e)=>{
        console.log("Error in broadcast:\n",e);
        reject(e);
      })
    }
    catch(e){
      console.log("Final catch at send_tx:",e);
      reject(e);
    }
  });
}
//===exports=====-==================================================|
module.exports={new_account,account_from_key,block_height,sign,broadcast};
//===FIN=====-==================================================|
