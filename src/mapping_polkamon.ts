import { Transfer } from '../generated/Polkamon/Polkamon'
import { PolkamonOwner, PolkamonBalance } from '../generated/schema'
import { BigInt } from "@graphprotocol/graph-ts"

export function handleTransfer(event: Transfer): void {
    let id = event.params.tokenId.toHex()
    let polkamon = PolkamonOwner.load(id)
    if (polkamon == null) {
        polkamon = new PolkamonOwner(id)
    }
    polkamon.owner = event.params.to
    polkamon.save()

    let previousOwner = event.params.from.toHex()
    let polkamonBalance = PolkamonBalance.load(previousOwner)
    if (polkamonBalance != null) {
        if (polkamonBalance.amount > BigInt.fromI32(0)) {
            polkamonBalance.amount = polkamonBalance.amount - BigInt.fromI32(1)
        }
        polkamonBalance.save()
    }    

    let newOwner = event.params.to.toHex()
    let newPolkamonBalance = PolkamonBalance.load(newOwner)
    if (newPolkamonBalance == null) {
        newPolkamonBalance = new PolkamonBalance(newOwner)
        newPolkamonBalance.amount = BigInt.fromI32(0)
    }
    newPolkamonBalance.amount = newPolkamonBalance.amount + BigInt.fromI32(1)
    newPolkamonBalance.save()
}