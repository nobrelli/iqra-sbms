import { Discount } from "@/types/schemas"

export const computeDiscount = (amount: number, discount: number, isPercent: boolean) => {
    return amount - (isPercent ? amount * discount / 100 : discount)
}

export const computeTotalPayableAmount = (fees: string[], discount?: Discount) => {
    if (!fees?.length) return 0

    const MISC_FEE = 'miscellaneous fee'

    return fees.reduce((total, fee) => {
        const [description, amount] = fee.split(',')
        const floatAmount = parseFloat(amount)

        return (discount && description.toLowerCase() === MISC_FEE)
            ? total += computeDiscount(
                floatAmount,
                discount.amount,
                discount.isPercent
            ) : total += floatAmount
    }, 0)
}

export const computeBalance = (totalCost: number, payment: number) => {
    if (payment > totalCost) return 0
    return totalCost - payment
}