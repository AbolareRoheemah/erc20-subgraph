import { BigInt } from "@graphprotocol/graph-ts"
import { ERC20, Approval, Transfer } from "../generated/ERC20/ERC20"
import { TransferEntity } from "../generated/schema"

export function handleApproval(event: Approval): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type

  // let entity = ExampleEntity.load(event.transaction.from)

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand

  // if (!entity) {
  //   entity = new ExampleEntity(event.transaction.from)

    // Entity fields can be set using simple assignments

    // entity.count = BigInt.fromI32(0)
  // }

  // BigInt and BigDecimal math are supported

  // entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters

  // entity._owner = event.params._owner
  // entity._spender = event.params._spender

  // Entities can be written to the store with `.save()`

  // entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.allowance(...)
  // - contract.approve(...)
  // - contract.balanceOf(...)
  // - contract.decreaseAllowance(...)
  // - contract.increaseAllowance(...)
  // - contract.totalSupply(...)
  // - contract.transfer(...)
  // - contract.transferFrom(...)
}

export function handleTransfer(event: Transfer): void {
  const transferId = event.transaction.from.toHexString().concat("-").concat(event.params._value.toHexString());
  const transfer = new TransferEntity(transferId);

  transfer._from = event.params._from;
  transfer._to = event.params._to;
  transfer.value = event.params._value;
  transfer.timestamp = event.block.timestamp;
  transfer.transactionHash = event.transaction.hash;

  transfer.save();


  let contract = ERC20.bind(event.address);
  
  // Attempt to get the balance of the sender
  const balanceResult = contract.try_balanceOf(event.transaction.from);
  
  // Check if the call was successful
  if (!balanceResult.reverted) {
    // Optionally, you can log or handle the balance if needed
    // console.log("Balance of sender:", balanceResult.value.toString());
  } else {
    // Handle the case where the balance call reverted
    // console.error("Failed to fetch balance for:", event.transaction.from.toHexString());
  }
}
