
const ethers = require('ethers');

const contractAddress = "0xFe578b25Eb1Cb94cD7Dc9e7fBe9f8c95F464f1e9";
const contractAbi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_address",
				"type": "address"
			}
		],
		"name": "giveAccess",
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
			}
		],
		"name": "revokeAccess",
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
				"name": "_address1",
				"type": "address"
			},
			{
				"name": "_address2",
				"type": "address"
			},
			{
				"name": "hash",
				"type": "string"
			}
		],
		"name": "sendHash",
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
		"name": "checkAccess",
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
		"name": "returnHash",
		"outputs": [
			{
				"name": "hash",
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




// all addresses should be valid as well as should be called as a string for eg. "0xFe578b25Eb1Cb94cD7Dc9e7fBe9f8c95F464f1e9"


//const tx = await contract.giveAccess(address); // giving access to doctor or patient ethereum address

//const tx = await contract.revokeAccess(address); // revoking access ...

//const result = await contract.checkAccess(address patient , address doctor);  // checking access ...

//const tx = await contract.sendHash(address patient, address doctor, hash);  // sending hashed data of patient
																		      // it will do nothing if not given access		
																			  
//const result = await contract.returnHash(adress patient, address doctor);  // returning hashed data of patient
																			 // "-1" if not given access
																			 // empty if not present

