var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Primal = artifacts.require("./Primal.sol");

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Primal);
};
