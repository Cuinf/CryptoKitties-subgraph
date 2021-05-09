import { Birth, Transfer } from '../generated/CryptoKitties/CryptoKitties'
import { KittyOwner, KittyBalance } from '../generated/schema'
import { BigInt, Address } from "@graphprotocol/graph-ts"

export function handleBirth(event: Birth): void {
    let id = event.transaction.hash.toHex()
    let kitty = new KittyOwner(id)
    kitty.tokenId = event.params.kittyId
    kitty.owner = event.params.owner
    kitty.contract = Address.fromString("0x06012c8cf97BEaD5deAe237070F9587f8E7A266d")
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
        kitty.contract = Address.fromString("0x06012c8cf97BEaD5deAe237070F9587f8E7A266d")
    }   
    kitty.owner = event.params.to
    kitty.save()

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