/*
ETC Node Server: Transaction Object
Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===modules===================================================|
const w3fx = require('./web3_fx');
const Web3ETH =  require('web3-eth');
const Web3 =  require('web3');
//-o_o===init======================================================|
const node_addr = `http://localhost:${process.env.N_PORT}`;
let web3eth = new Web3ETH(node_addr); 
let web3 = new Web3(node_addr);
//-o_o===create====================================================|
let create = (to,amount,private_key)=>{
  return new Promise((resolve,reject)=>{
    try{
      const init_counter = 1;
      
      let send_acc = w3fx.account_from_key(private_key)
      .then((send_acc)=>{
        let acc_obj=send_acc;
        web3eth.getTransactionCount(send_acc.address)
        .then((counter)=>{
          //console.log(counter);
          let tx_object = {
            from: acc_obj.address,
            to: to,
            value: web3.utils.toHex(amount),
            gasPrice:web3.utils.toHex(100000000000),
            gas: web3.utils.toHex(400000),
            chainId: 2,
            nonce:web3.utils.toHex(counter+2156)
          }
          resolve(tx_object);  
        });           
      })
      .catch((e)=>{
        reject(e);
      });
    }
    catch(e){
      reject(e);
    }
  });
}
//-o_o===exports==================================================|
module.exports={create};
//-o_o===fin======================================================|