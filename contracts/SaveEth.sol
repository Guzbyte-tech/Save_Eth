// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SaveEth {
    mapping(address => uint) UserBalances;
    mapping(address => bool) isUser;

    uint private safeBal;

    event accountCreatedSuccessfully(address _address);
    event depositSuccessful(uint _amount);

    error AddressZeroDetected();
    error InsufficientFund();
    error InvalidUser();

    // create account function
    function createAccount(address _address) external {
        require(_address != address(0), "Address zero detected");
        require(_address.balance > 0, "Not an Ether address");

        isUser[_address] = true;
        UserBalances[_address] = 0;

        emit accountCreatedSuccessfully(_address);
    }

    // deposit function

    function deposit() external payable {
        require(isUser[msg.sender], "You do not have an account");
        require(msg.sender != address(0), "Address zero detected");
        require(msg.value > 0, "Zero deposit not allowed");

        UserBalances[msg.sender] += msg.value;
        emit depositSuccessful(msg.value);
    }

    //transfer function

    function transfer(uint _amount, address _addressTo) external payable {
        require(_addressTo != address(0), "Address zero detected");
        require(msg.sender != address(0), "Address zero detected");
        require(_amount > 0, "Can't transfer zero amount");
        require(isUser[msg.sender], "Invalid user");

        uint bal = UserBalances[msg.sender];
        require(bal > _amount, "Insufficient fund");

        UserBalances[msg.sender] -= _amount;

        (bool success, ) = _addressTo.call{value: _amount}("");
        require(success, "Failed Transfer");
    }

    //withdraw function

    function withdraw(uint amount) external payable {
        if (msg.sender == address(0)) {
            revert AddressZeroDetected();
        }
        if (amount < 0) {
            revert InsufficientFund();
        }
        if (!isUser[msg.sender]) {
            revert InvalidUser();
        }

        uint bal = UserBalances[msg.sender];

        if (bal < amount) {
            revert InsufficientFund();
        }

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed withdrawal");
    }

    // checkBalance function

    function checkBalance() external view returns (uint) {
        return UserBalances[msg.sender];
    }
}
