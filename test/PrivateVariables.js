const { assert } = require("chai");
const { ethers } = require("hardhat");

function hashValue(value) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(value));
}

const bytes4Value = ethers.utils.hexDataSlice(hashValue("bytes4"), 0, 4);
const bytes8Value = ethers.utils.hexDataSlice(hashValue("bytes8"), 0, 8);

describe("PrivateVariables", function () {
  let b4,
    b8,
    u80,
    u96,
    user,
    u256,
    value,
    user1,
    ui256,
    deployer,
    BigNumber,
    structAddr,
    structAddr0,
    hashedString,
    PrivateVariables,
    privateVariables;

  before(async () => {
    [deployer, user, user1] = await ethers.getSigners();

    u80 = 3;
    u96 = 6;

    u256 = 9;
    value = 12;
    ui256 = 15;

    b4 = bytes4Value;
    b8 = bytes8Value;

    structAddr = user.address;
    structAddr0 = user1.address;

    BigNumber = ethers.BigNumber;
    hashedString = hashValue("privateVariables");

    PrivateVariables = await ethers.getContractFactory("PrivateVariables");
    privateVariables = await PrivateVariables.deploy();

    await privateVariables.deployed();
    await privateVariables.updateU80(u80);

    await privateVariables.updateU256(u256);
    await privateVariables.updateFlag(true);

    await privateVariables.updateDynamicArray(value);
    await privateVariables.updateBytes32(hashedString);

    await privateVariables.updateAddress(deployer.address);
    await privateVariables.updateMapping(0, deployer.address);

    await privateVariables.updateStaticArray([
      deployer.address,
      user.address,
      user1.address,
    ]);

    await privateVariables.updateStructValues(
      u96,
      structAddr,
      structAddr0,
      b4,
      b8,
      ui256
    );
  });

  it("Should return packed variables from slot 0", async function () {
    const storageValue = await StorageValue(0);

    const address = ethers.utils.hexDataSlice(storageValue, 12, 32);
    const u80_ = ethers.utils.hexDataSlice(storageValue, 2, 12);

    const bool =
      ethers.utils.arrayify(
        ethers.utils.hexDataSlice(storageValue, 1, 2)
      )[0] !== 0;

    assert.equal(true, bool);
    assert.equal(BigNumber.from(u80_), u80);
    assert.equal(deployer.address, ethers.utils.getAddress(address));
  });

  it("Should return variable from slot 1", async function () {
    const storageValue = await StorageValue(1);

    assert.equal(storageValue, hashedString);
  });

  it("Should return variable from slot 2", async function () {
    const storageValue = await StorageValue(2);

    const convertedBytes = BigNumber.from(storageValue);
    assert.equal(convertedBytes, u256);
  });

  it("Should return variable from slot 3", async function () {
    const storageValue = await StorageValue(3);

    assert.equal(
      deployer.address,
      ethers.utils.defaultAbiCoder.decode(["address"], storageValue)
    );
  });

  it("Should return variable from slot 4", async function () {
    const storageValue = await StorageValue(4);

    assert.equal(
      user.address,
      ethers.utils.defaultAbiCoder.decode(["address"], storageValue)
    );
  });

  it("Should return variable from slot 5", async function () {
    const storageValue = await StorageValue(5);

    assert.equal(
      user1.address,
      ethers.utils.defaultAbiCoder.decode(["address"], storageValue)
    );
  });

  it("Should return variables from slot 6", async function () {
    await privateVariables.updateDynamicArray(value * 2);

    // using solidity to achieve part of the entire process
    const arrayLocation0 = await privateVariables.getArrayLocation(6, 0);
    const arrayLocation1 = await privateVariables.getArrayLocation(6, 1);

    const hexValue0 = ethers.utils.hexValue(BigNumber.from(arrayLocation0));
    const hexValue1 = ethers.utils.hexValue(BigNumber.from(arrayLocation1));

    const storageValue0 = await StorageValue(hexValue0);

    const storageValue1 = await StorageValue(hexValue1);

    // using ether js to achieve the entire process
    const slot = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(["uint"], [6])
    );

    const storageValue2 = await StorageValue(slot);

    const bigNumberValue = BigNumber.from(slot);

    // Add 1 to the BigNumber
    const result = bigNumberValue.add(1);

    // Convert the result back to bytes32
    const resultBytes32 = ethers.utils.hexlify(result);

    const storageValue3 = await StorageValue(resultBytes32);

    assert.equal(value, BigNumber.from(storageValue0));
    assert.equal(value * 2, BigNumber.from(storageValue1));

    assert.equal(value, BigNumber.from(storageValue2));
    assert.equal(value * 2, BigNumber.from(storageValue3));
  });

  it("Should return variables from slot 7", async function () {
    await privateVariables.updateMapping(1, user.address);

    // using solidity to achieve part of the entire process
    const mapLocation0 = await privateVariables.getMapLocation(7, 0);
    const mapLocation1 = await privateVariables.getMapLocation(7, 1);

    const hexValue0 = ethers.utils.hexValue(BigNumber.from(mapLocation0));
    const hexValue1 = ethers.utils.hexValue(BigNumber.from(mapLocation1));

    const storageValue0 = await StorageValue(hexValue0);
    const storageValue1 = await StorageValue(hexValue1);

    // using ether js to achieve the entire process

    const slot = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(["uint", "uint"], [0, 7])
    );

    const slot0 = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(["uint", "uint"], [1, 7])
    );

    const storageValue2 = await StorageValue(slot);

    const storageValue3 = await StorageValue(slot0);

    assert.equal(
      deployer.address,
      ethers.utils.defaultAbiCoder.decode(["address"], storageValue0)
    );

    assert.equal(
      user.address,
      ethers.utils.defaultAbiCoder.decode(["address"], storageValue1)
    );

    assert.equal(
      deployer.address,
      ethers.utils.defaultAbiCoder.decode(["address"], storageValue2)
    );

    assert.equal(
      user.address,
      ethers.utils.defaultAbiCoder.decode(["address"], storageValue3)
    );
  });

  it("Should return packed variables from slot 8", async function () {
    const arrayLocation0 = await privateVariables.getArrayLocation(8, 0);
    const arrayLocation1 = await privateVariables.getArrayLocation(8, 1);
    const arrayLocation2 = await privateVariables.getArrayLocation(8, 2);

    const hexValue0 = ethers.utils.hexValue(BigNumber.from(arrayLocation0));
    const hexValue1 = ethers.utils.hexValue(BigNumber.from(arrayLocation1));
    const hexValue2 = ethers.utils.hexValue(BigNumber.from(arrayLocation2));

    const storageValue0 = await StorageValue(hexValue0);

    const storageValue1 = await StorageValue(hexValue1);

    const storageValue2 = await StorageValue(hexValue2);

    const u96_ = ethers.utils.hexDataSlice(storageValue0, 20, 32);
    const structAddr = ethers.utils.hexDataSlice(storageValue0, 0, 20);

    const b8 = ethers.utils.hexDataSlice(storageValue1, 0, 8);
    const b4 = ethers.utils.hexDataSlice(storageValue1, 8, 12);
    const structAddr0 = ethers.utils.hexDataSlice(storageValue1, 12, 32);

    assert.equal(b4, bytes4Value);
    assert.equal(b8, bytes8Value);

    assert.equal(structAddr, structAddr);
    assert.equal(structAddr0, structAddr0);

    assert.equal(BigNumber.from(u96_), u96);
    assert.equal(BigNumber.from(storageValue2), ui256);
  });

  it("Should return packed variables from slot 9", async function () {
    const mapLocation0 = await privateVariables.getMapLocation(9, u96);
    const result = mapLocation0.add(1);
    const result0 = mapLocation0.add(2);

    const resultBytes32 = ethers.utils.hexlify(result);
    const resultBytes32_0 = ethers.utils.hexlify(result0);

    const hexValue0 = ethers.utils.hexValue(BigNumber.from(mapLocation0));

    const storageValue0 = await StorageValue(hexValue0);

    const storageValue1 = await StorageValue(resultBytes32);

    const storageValue2 = await StorageValue(resultBytes32_0);

    const u96_ = ethers.utils.hexDataSlice(storageValue0, 20, 32);
    const structAddr = ethers.utils.hexDataSlice(storageValue0, 0, 20);

    const b8 = ethers.utils.hexDataSlice(storageValue1, 0, 8);
    const b4 = ethers.utils.hexDataSlice(storageValue1, 8, 12);
    const structAddr0 = ethers.utils.hexDataSlice(storageValue1, 12, 32);

    assert.equal(b4, bytes4Value);
    assert.equal(b8, bytes8Value);

    assert.equal(structAddr, structAddr);
    assert.equal(structAddr0, structAddr0);

    assert.equal(BigNumber.from(u96_), u96);
    assert.equal(BigNumber.from(storageValue2), ui256);
  });

  async function StorageValue(slot) {
    return await ethers.provider.getStorageAt(privateVariables.address, slot);
  }
});
