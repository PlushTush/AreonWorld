export const CONTRACT_ABI = [{
    "inputs": [{
        "internalType": "uint256",
        "name": "R",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "G", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "B",
        "type": "uint256"
    }], "name": "buyColor", "outputs": [], "stateMutability": "payable", "type": "function"
}, {
    "inputs": [{"internalType": "string", "name": "mapTitle", "type": "string"}],
    "name": "createWorld",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
}, {"inputs": [], "stateMutability": "nonpayable", "type": "constructor"}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "worldId",
        "type": "uint256"
    }, {"internalType": "string", "name": "newState", "type": "string"}],
    "name": "updateWorldState",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_address", "type": "address"}, {
        "internalType": "uint256",
        "name": "R",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "G", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "B",
        "type": "uint256"
    }],
    "name": "checkColorPossesion",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "COLOR_PRICE",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "contractOwner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getBalance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_address", "type": "address"}],
    "name": "getColorsOf",
    "outputs": [{
        "components": [{"internalType": "uint256", "name": "R", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "G",
            "type": "uint256"
        }, {"internalType": "uint256", "name": "B", "type": "uint256"}],
        "internalType": "struct WorldCraft.Color[]",
        "name": "",
        "type": "tuple[]"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "worldIndex", "type": "uint256"}],
    "name": "getWorldInfo",
    "outputs": [{
        "components": [{
            "internalType": "string",
            "name": "title",
            "type": "string"
        }, {"internalType": "address", "name": "creator", "type": "address"}, {
            "internalType": "string",
            "name": "state",
            "type": "string"
        }, {"internalType": "uint256", "name": "createdTime", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "lastUpdateTime",
            "type": "uint256"
        }], "internalType": "struct WorldCraft.World", "name": "", "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_address", "type": "address"}, {
        "internalType": "uint256",
        "name": "worldIndex",
        "type": "uint256"
    }],
    "name": "getWorldOfAddressByIndex",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "WORLD_PRICE",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "worldsCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "worldsCountOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}]