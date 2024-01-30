import { Color } from "three"

export const DEFAULT_USER_COLORS = [
    {
        R: BigInt(77),
        G: BigInt(78),
        B: BigInt(89)
    }, {
        R: BigInt(196),
        G: BigInt(72),
        B: BigInt(60)
    }
]
export const green1 = new Color('green').addScalar(0.02).getHex()
export const green2 = new Color('green').addScalar(-0.02).getHex()