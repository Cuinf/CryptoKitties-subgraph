import { Birth, Transfer } from '../generated/CryptoKitties/CryptoKitties'
import { KittyOwner } from '../generated/schema'
//import { BigInt } from "@graphprotocol/graph-ts"

export function handleBirth(event: Birth): void {
    let kitty = new KittyOwner(event.params.kittyId.toHex())
    kitty.owner = event.params.owner
    //kitty.count = BigInt.fromI32(1)
    kitty.save()
}

export function handleTransfer(event: Transfer): void {
    let id = event.params.tokenId.toHex()
    let kitty = KittyOwner.load(id)
    if (kitty == null) {
        kitty = new KittyOwner(id)
    }
    kitty.owner = event.params.to
    kitty.save()
}