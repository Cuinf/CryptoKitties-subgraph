import { Birth, Transfer } from '../generated/CryptoKitties/CryptoKitties'
import { KittyOwner } from '../generated/schema'

export function handleBirth(event: Birth): void {
    let kitty = new KittyOwner(event.params.kittyId.toHex())
    kitty.kittyId = event.params.kittyId
    kitty.owner = event.params.owner
    kitty.save()
}

export function handleTransfer(event: Transfer): void {
    let id = event.params.tokenId.toHex()
    let kitty = new KittyOwner(id)
    if (kitty == null) {
        kitty = new KittyOwner(id)
    }
    kitty.owner = event.params.to
    kitty.save()
}