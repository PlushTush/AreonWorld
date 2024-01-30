// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AreonWorld {
    uint public constant WORLD_PRICE = 0.05 ether; 
    uint public constant COLOR_PRICE = 0.01 ether; 

    address public contractOwner;

    struct World {
        string title;
        address creator;
        string state;
        uint createdTime;
        uint lastUpdateTime;
    }

    struct Color {
        uint R;
        uint G;
        uint B;
    }
    
    uint public worldsCount = 0;
    mapping(uint => World) private worlds;
    mapping(address => uint) public worldsCountOf;
    mapping(address => mapping(uint => uint)) private worldOfAddressByIndex;

    mapping(address => Color[]) private colorsOf;

    constructor() {
        contractOwner = msg.sender;
    }

    function getWorldInfo(uint worldIndex) public view returns (World memory) {
        assert(worldIndex > 0 && worldIndex <= worldsCount);
        return worlds[worldIndex];
    }

    function getWorldOfAddressByIndex(address _address, uint worldIndex) public view returns (uint) {
        assert(worldIndex < worldsCountOf[_address]);
        return worldOfAddressByIndex[_address][worldIndex];
    }

    function getColorsOf(address _address) public view returns (Color[] memory) {
        return colorsOf[_address];
    }

    function checkColorPossesion(address _address, uint R, uint G, uint B) public view returns (bool) {
        require(R >= 0 && R <= 255);
        require(G >= 0 && G <= 255);
        require(B >= 0 && B <= 255);
        Color[] memory colors = getColorsOf(_address);
        for (uint i = 0; i < colors.length; i++) {
            Color memory color = colors[i];
            if(color.R == R && color.G == G && color.B == B) {
                return true;
            }
        }
        return false;
    }

    function createWorld(string memory mapTitle) public payable {
        require(msg.value >= WORLD_PRICE,  "Not enough native tokens sent, check price!");

        worldsCount += 1;
        worlds[worldsCount] = World(mapTitle, msg.sender, "", block.timestamp, block.timestamp);
        if (colorsOf[msg.sender].length == 0) {
            colorsOf[msg.sender].push(Color(196, 72, 60));
            colorsOf[msg.sender].push(Color(77, 78, 89));
        }
        worldOfAddressByIndex[msg.sender][worldsCountOf[msg.sender]] = worldsCount;
        worldsCountOf[msg.sender] += 1;

        if(msg.value > WORLD_PRICE){
            address payable to = payable(msg.sender);
            to.transfer(msg.value - COLOR_PRICE);
        }
    }


    function updateWorldState(uint worldId, string memory newState) public {
        assert(worldId <= worldsCount);
        require(msg.sender == worlds[worldId].creator,  "You are not the creator of this world !");
        worlds[worldId].state = newState;
        worlds[worldId].lastUpdateTime = block.timestamp;
    }

    function buyColor(uint R, uint G, uint B) public payable {
        require(msg.value >= COLOR_PRICE,  "Not enough native tokens sent, check price!");
        require(checkColorPossesion(msg.sender, R, G, B) == false, "You already have this color");
        require(R >= 0 && R <= 255);
        require(G >= 0 && G <= 255);
        require(B >= 0 && B <= 255);

        if (colorsOf[msg.sender].length == 0) {
            colorsOf[msg.sender].push(Color(196, 72, 60));
            colorsOf[msg.sender].push(Color(77, 78, 89));
        }

        colorsOf[msg.sender].push(Color(R, G, B));

        if(msg.value > COLOR_PRICE){
            address payable to = payable(msg.sender);
            to.transfer(msg.value - COLOR_PRICE);
        }
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    function withdraw() public onlyContractOwner {
        address payable to = payable(contractOwner);
        to.transfer(getBalance());
    }

    modifier onlyContractOwner() {
        require(msg.sender == contractOwner, "Caller is not owner");
        _;
    }
} 