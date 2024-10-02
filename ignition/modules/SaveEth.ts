import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SaveEthModule = buildModule("SaveEthModule", (m) => {

    const SaveEth = m.contract("SaveEth");

  return { SaveEth };
});

export default SaveEthModule;
