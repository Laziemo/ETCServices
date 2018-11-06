#!/usr/bin/env node
/*
Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
Morden CommandLine Client
*/
//-o_O===<o..o>=================================================~|
'use strict';
//-o_o===modules=================================================|
var program = require('commander');
const w3fx = require('./lib/web3_fx');
const Web3 = require('web3');
const tx_obj = require('./lib/transaction_object');
//-o_o===init====================================================|
const node_addr = `http://localhost:${process.env.N_PORT}`;
let web3 = new Web3(node_addr);
//-o_o===program====================================================|
program
  .version('0.1.0')
  .description('morden-node-cli\n be careful!!\n this program is unsafe as it does not check inputs.');
//-o_o===height====================================================|

program
  .command('chain_height')
  .alias('h')
  .description('Get current height of the morden chain.')
  .action(()=>{
    w3fx.block_height()
    .then((height)=>{
      console.log(`\n\nHeight:${height}\n`);
    })
    .catch((e)=>{
      console.log("\nError in getting chain height.\n",e);
    });
  });
//-o_o===balance====================================================|

program
  .command('balance <address>')
  .alias('b')
  .description('get balance for the provided morden address.')
  .action((address)=>{
    w3fx.get_balance(address)
    .then((balance)=>{
      const bEth=web3.utils.fromWei(balance, 'ether'); 
      console.log(`\n\nBalance:\nWei:${balance}\nEther:${bEth}`);
    })
    .catch((e)=>{
      console.log(`\nError in retrieving balance for ${address}.\n${e}\nIs this a morden address?\n`);
    });
  });
//-o_o===sign====================================================|
program
  .command('send <to> <amount> <private_key>')
  .alias('x')
  .description('creates transaction object of <amount> ether, from account <private_key>, <to> address; and broadcasts to morden.')
  .action((to,amount,private_key)=>{
    const amEth=web3.utils.toWei(amount,'ether');
    tx_obj.create(to,amEth,private_key)
    .then((result)=>{
      let tx_o = result;
      console.log(tx_o);
      w3fx.sign(result,private_key)
      .then((signed_tx)=>{
        console.log(`\n\nTransaction Signed.\nFrom:${tx_o.from}\nTo:${to}\nAmount:${amount} ETC\n`);
        console.log(`Raw signed transaction:\n${signed_tx}`);
        console.log(`Attempting broadcast...`);
        w3fx.broadcast(signed_tx.rawTransaction)
        .then((result)=>{
          console.log(`${receipt}`);
        })
      })
      .catch((e)=>{
        console.log(`\nError in signing transaction from ${tx_o.from} to ${to} for ${amount} ETC.\n${e}\n`);
      });
    }) 
  });
//-o_o===get_transaction====================================================|
program
.command('get_tx <tx_hash>')
.alias('g')
.description('get transaction_object for the provided morden tx_hash.')
.action((tx_hash)=>{
  w3fx.get_tx(tx_hash)
  .then((object)=>{
    console.log(`\n\nTransactionID: ${tx_hash}\nObject:${object}`);
  })
  .catch((e)=>{
    console.log(`\nError in retrieving transaction ${tx_hash}.\n${e}\nIs this a valid tx_hash?\n`);
  });
});
//-o_o===get_receipt====================================================|
program
.command('get_receipt <raw_tx>')
.alias('g')
.description('get transaction_object for the provided morden tx_hash.')
.action((raw_tx)=>{
  w3fx.get_tx_receipt(raw_tx)
  .then((object)=>{
    console.log(`\n\nRawTx: ${raw_tx}\nObject:${object}`);
  })
  .catch((e)=>{
    console.log(`\nError in retrieving transaction ${raw_tx}.\n${e}`);
  });
});

//-o_o===publish====================================================|
//-o_o===parse====================================================|
program
.parse(process.argv);
//-o_o===fin=====================================================|
