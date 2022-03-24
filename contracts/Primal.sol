// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Primal is ERC20, Ownable {
    using SafeMath for uint256;

    uint256 public tokenPrice = 1000000000000000;
    address[] internal stakeholders;
    mapping(address => uint256) internal stakes;
    mapping(address => uint256) internal stakeTime;
    uint256 stakeEnd = 640800;

    constructor() ERC20("Primal", "PRI") {
        _mint(msg.sender, 1000 * 10**18);
    }

    fallback() external payable {
        uint256 tokens =  msg.value / tokenPrice;
        _mint(msg.sender, tokens * 10**18);
    }

    receive() external payable {
        uint256 tokens =  msg.value / tokenPrice;
        _mint(msg.sender, tokens * 10**18);
    }

    function buyTokens() public payable {
        uint256 tokens =  msg.value / tokenPrice;
        _mint(msg.sender, tokens * 10**18);
    }

    function sellToken(uint256 amount) public payable {
        require(amount > 0, "Don't you have tokens?");
        uint balance = balanceOf(msg.sender);
        require(balance >= amount, "Your balance is too low");
        uint256 sending = amount * tokenPrice;
        uint ownerBalance = address(this).balance;
        require(ownerBalance >= sending, "Conract doesn't have enough Eth");
        bool check = transfer(address(this), amount * 10 ** 18);
        require(check, "Failed to receive tokens");
        (bool sent, ) = msg.sender.call{value: sending}("");
        require(sent, "Failed to send Ether");
    }

    function modifyTokenBuyPrice(uint256 amount) public onlyOwner {
        tokenPrice = amount * 10 ** 18;
    }

    function getEthBalance(address _user) public view returns(uint) {
        uint balance = address(_user).balance;
        return balance;
    }

    function sendToken(address _to, uint256 amount) public returns(bool){
        bool x = transfer(_to, amount * 10 ** 18);
        return x;
    }


    //functions for controlling stakeholders

    function isStakeholder(address _address)
        public
        view
        returns (bool, uint256)
    {
        for (uint256 i = 0; i < stakeholders.length; i += 1) {
            if (_address == stakeholders[i]) return (true, i);
        }
        return (false, 0);
    }

    function addStakeholder(address _stakeholder) public {
        (bool _isStakeholder, ) = isStakeholder(_stakeholder);
        if (!_isStakeholder) stakeholders.push(_stakeholder);
    }

    function removeStakeholder(address _stakeholder) public {
        (bool _isStakeholder, uint256 i) = isStakeholder(_stakeholder);
        if (_isStakeholder) {
            //assign the value of last stake holder to the one to be removed
            stakeholders[i] = stakeholders[stakeholders.length - 1];
            //method not advisable if the order of staking is important
            stakeholders.pop();
        }
    }

    function getStakeHolders() public view returns (address[] memory) {
        return stakeholders;
    }

    function getStakeHoldersNumber() public view returns (uint256) {
        return stakeholders.length;
    }

    //Functions for controlling stake
    function stakeAmount(address _stakeholder) public view returns (uint256) {
        (bool _isStakeholder, ) = isStakeholder(_stakeholder);
        if (!_isStakeholder) return 0;
        else return stakes[_stakeholder];
    }

    function totalStakes() public view returns (uint256) {
        uint256 _totalStakes = 0;
        for (uint256 i = 0; i < stakeholders.length; i += 1) {
            _totalStakes = _totalStakes.add(stakes[stakeholders[i]]);
        }
        return _totalStakes;
    }

    function createStake(uint256 _stake) public {
        _burn(msg.sender, _stake * 10**18);
        if (stakes[msg.sender] == 0) addStakeholder(msg.sender);
        stakeTime[msg.sender] = block.timestamp;
        stakes[msg.sender] = stakes[msg.sender].add(_stake * 10**18);
    }

    function unStake(uint256 _stake) public {
        stakes[msg.sender] = stakes[msg.sender].sub(_stake * 10**18);
        if (stakes[msg.sender] == 0) removeStakeholder(msg.sender);
        _mint(msg.sender, _stake * 10 ** 18);
    }

    //functions for controlling rewards
    function rewardOf(address _stakeholder) public view returns (uint256) {
        return getReward(_stakeholder);
    }

    function getReward(address _stakeholder)
        public
        view
        returns (uint256)
    {
        return stakes[_stakeholder] / 100;
    }

    function totalRewards() public view returns (uint256) {
        uint256 _totalRewards = 0;
        for (uint256 i = 0; i < stakeholders.length; i += 1) {
            _totalRewards = _totalRewards.add(getReward(stakeholders[i]));
        }
        return _totalRewards;
    }

    function claimReward() public {
        require(block.timestamp >= (stakeTime[msg.sender] + stakeEnd));
        uint256 reward = getReward(msg.sender);
        _mint(msg.sender, reward);
        stakeTime[msg.sender] = block.timestamp;
    }

    function rewardReady(address _address) public view returns (bool) {
        return (block.timestamp >= (stakeTime[_address] + stakeEnd));
    }

    function rewardTimeLeft(address _user) public view returns (uint256) {
        uint time = (stakeTime[_user] + stakeEnd) - block.timestamp;
        if (time <= 0) return 0;
        uint256 timeLeft = time/86400;
        if (timeLeft >= 1) {
            return timeLeft;
        } else {
            return (timeLeft / 24) * 10;
        }
    }
}