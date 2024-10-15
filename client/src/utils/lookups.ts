import { enrollmentStatusLookup, payingStatusLookup } from "@/lib/lookups"
import { StudentPayingStatus } from "@/types/constants"
import { Discount } from "@/types/schemas"
import { snakeToCamelCase } from "./formatters"

export const lookupPayingStatus = (status: string) => {
  return payingStatusLookup[snakeToCamelCase(status)]
    ?? StudentPayingStatus.Regular
}

export const lookupEnrollmentStatus = (status: string) => {
  return enrollmentStatusLookup[status]
}

export const lookupDiscountInfo = (discountType: string, discounts: Discount[]) => {
  return discounts.find(discount => 
    discount.description === discountType
  ) ?? null
}