var Record = artifacts.require("./record.sol");

module.exports = function(deployer) {
  deployer.deploy(Record);
};
