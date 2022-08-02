const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');
let compileInput = {
    language: 'Solidity',
    sources: {
        'campaign.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
}; 
let output = JSON.parse(solc.compile(JSON.stringify(compileInput))).contracts['campaign.sol'];
for(let contract in output){
    fs.outputJSONSync(
        path.resolve(buildPath, contract+'.json'), output[contract]
    );
}

// fs.ensureDirSync(buildPath);
// console.log(JSON.parse(solc.compile(JSON.stringify(compileInput))).contracts['campaign.sol'].Campaign);
// module.exports = JSON.parse(solc.compile(JSON.stringify(compileInput))).contracts['lottery.sol'].Lottery;