
const ethers = require('ethers');

const contractAddress = "0x56c35B7E7e35a5be8C39C3e69c555F497b43A827";
const contractAbi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_address",
				"type": "address"
			}
		],
		"name": "giveAscess",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_address",
				"type": "address"
			},
			{
				"name": "hash",
				"type": "string"
			}
		],
		"name": "hashData",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_address",
				"type": "address"
			}
		],
		"name": "RevokeAscess",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "id",
				"type": "string"
			},
			{
				"name": "key",
				"type": "string"
			}
		],
		"name": "sendId",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_address1",
				"type": "address"
			},
			{
				"name": "_address2",
				"type": "address"
			}
		],
		"name": "check",
		"outputs": [
			{
				"name": "val",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_address1",
				"type": "address"
			},
			{
				"name": "_address2",
				"type": "address"
			}
		],
		"name": "CheckAscess",
		"outputs": [
			{
				"name": "data_id",
				"type": "string"
			},
			{
				"name": "sym_key",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

const provider = new ethers.BrowserProvider(window.ethereum);
await provider.send("eth_requestAccounts", []);
const signer = await provider.getSigner();
export const contract  = new ethers.Contract(contractAddress, contractAbi, signer);
//export const contract =  new ethers.Contract(contractAddress, contractAbi, provider);

//const tx = await contract.giveAscess(address); // doctor address called by patient
//const tx = await contract.revokeAscess(address); // " "  "
//const tx = await contract.sendId(data_id, key);  // all in string
//const tx = await contract.hashData(patient_address, hashed_data);


//const result = await contract.CheckAscess(patient_addr, doctor_addr);  // no etherr used (view function)
// adress should be any string 
