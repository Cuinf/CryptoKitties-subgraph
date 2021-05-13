import { Birth, Transfer } from '../generated/CryptoKitties/CryptoKitties'
import { KittyOwner, KittyBalance, TransferTrace } from '../generated/schema'
import { BigInt, Address } from "@graphprotocol/graph-ts"

export function handleBirth(event: Birth): void {
    let id = event.transaction.hash.toHex()
    let kitty = new KittyOwner(id)
    kitty.tokenId = event.params.kittyId
    kitty.owner = event.params.owner
    kitty.contract = event.address
    kitty.save()

    let kittyBalance = new KittyBalance(event.params.owner.toHex())
    kittyBalance.amount = BigInt.fromI32(1)
    kittyBalance.save()
}

export function handleTransfer(event: Transfer): void {
    let id = event.transaction.hash.toHex()
    let kitty = KittyOwner.load(id)
    if (kitty == null) {
        kitty = new KittyOwner(id)
        kitty.tokenId = event.params.tokenId
        kitty.contract = event.address
    }   
    kitty.owner = event.params.to
    kitty.save()

    //collect the entities of transfer traces
    let transferEntity = new TransferTrace(id)
    transferEntity.from = event.params.from
    transferEntity.to = event.params.to
    transferEntity.timestamp = event.block.timestamp
    transferEntity.save()

    //count the amount of tokens hold by an owner
    let previousOwner = event.params.from.toHex()
    let kittyBalance = KittyBalance.load(previousOwner)
    if (kittyBalance != null) {
        if (kittyBalance.amount > BigInt.fromI32(0)) {
            kittyBalance.amount = kittyBalance.amount - BigInt.fromI32(1)
        }
        kittyBalance.save()
    } 
    

    let newOwner = event.params.to.toHex()
    let newKittyBalance = KittyBalance.load(newOwner)
    if (newKittyBalance == null) {
        newKittyBalance = new KittyBalance(newOwner)
        newKittyBalance.amount = BigInt.fromI32(0)
    }
    newKittyBalance.amount = newKittyBalance.amount + BigInt.fromI32(1)
    newKittyBalance.save()
}