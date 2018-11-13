/*
ETC Node Server: Web3 f(x)
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
const EthereumTx = require('ethereumjs-tx');

const logs = require('./logs.js');
//-o_o===init======================================================|
const node_addr = `http://localhost:${process.env.N_PORT}`;

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
      personal.newAccount("shhhh!@#*")
      .then((account)=>{
        // console.log(account);
        resolve(account);
      })
      .catch((e)=>{
        // console.log(e);
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
      // console.log(account);
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
          // console.log(error);
          reject(error);
        }
        else{
          // console.log(result);
          resolve(String(result));
        }
      });
    }
    catch(e){
      // console.log("Final catch at block_height:",e);
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
  // console.log("Final catch at tx_detail",e);
  reject(e);
  }
 });
}
//===sign_tx-========================================|
let sign = (tx_obj,pk)=>{
  return new Promise((resolve,reject)=>{
    try{
      const tx = new EthereumTx(tx_obj);
      const privateKey = Buffer.from(pk,'hex');
      tx.sign(privateKey);
      const serializedTx = tx.serialize();
      const tx_hex='0x' + serializedTx.toString('hex');

      console.log("Signed Transaction Hex:\n",tx_hex);
      resolve (tx_hex);
    }
    catch(e){
      // console.log("Final catch at send_tx:",e);
      reject(e);
    }
  });
}
//===broadcast-========================================|
let broadcast = (tx_hex)=>{
  return new Promise((resolve,reject)=>{
    try{
      //console.log(`RAW:${raw_tx}`);
      web3eth.sendSignedTransaction(tx_hex)
      .on('receipt', (receipt)=>{
        if(receipt!=null){
          console.log("Got Transaction Receipt.");
          resolve(receipt);
        }
        else{
          console.log("Got null receipt");
          reject(receipt);
        }
      });
    }
    catch(e){
      // console.log("Final catch at broadcast:",e);
      reject(e);
    }
  });
}
//===send-========================================|
let send = (tx_obj)=>{
  return new Promise((resolve,reject)=>{
    try{
      web3eth.sendTransaction(tx_obj)
      .then((tx_hash)=>{
        console.log("Signed Transaction: \n", tx_hash);
        resolve (tx_hash);
      })
      .catch((e)=>{
        // console.log("Error in sign_tx:\n",e);
        reject(e);
      })
    }
    catch(e){
      // console.log("Final catch at send_tx:",e);
      reject(e);
    }
  });
}
//===broadcast-========================================|
let get_balance = (address)=>{
  return new Promise((resolve,reject)=>{
    try{
      if(web3.utils.isAddress(address)){
        web3.eth.getBalance(address)
        .then((balance)=>{
          //console.log(balance);
          resolve(balance);
        })
        .catch((e)=>{
          reject(e);
        })
      }
      else{
        reject(new Error("Invalid Address"));
      }
    }
    catch(e){
      // console.log("Final catch at get_balance:",e);
      reject(e);
    }
  });
}
//===get_tx=====-==================================================|
let get_tx = (tx_hash)=>{
  return new Promise((resolve,reject)=>{
    try{
      web3eth.getTransaction(tx_hash)
      .then((tx_object)=>{
        console.log(tx_object);
        resolve(tx_object);
      })
      .catch((e)=>{
        console.log(e);
        reject(e);
      })
    }
    catch(e){
      // console.log("Final catch at get_balance:",e);
      reject(e);
    }
  });
}
//===get_receipt=====-==================================================|TEST!!!!!!
let get_tx_receipt = (raw_tx)=>{//TEST
  return new Promise((resolve,reject)=>{
    try{
      web3.eth.getTransactionReceipt(raw_tx)
      .then((tx_detail)=>{
        console.log(tx_detail);
        resolve(tx_detail);
      })
      .catch((e)=>{
        console.log(e);
        reject(e);
      });
    }
    catch(e){
      // console.log("Final catch at get_balance:",e);
      reject(e);
    }
  });
}

//===get_work =====-==================================================|
let get_work = ()=>{
  return new Promise((resolve,reject)=>{
    try{
      web3.eth.getWork()
      .then((work)=>{
        console.log(work);
        resolve(work);
      })
      .catch((e)=>{
        console.log(e);
        reject(e);
      });
    }
    catch(e){
      // console.log("Final catch at get_balance:",e);
      reject(e);
    }
  });
}
//===exports=====-==================================================|
module.exports={new_account,account_from_key,block_height,sign,broadcast,send,get_balance,get_tx,get_tx_receipt,get_work};
//===FIN=====-==================================================|
