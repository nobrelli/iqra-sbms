import '@/lib/dayjs'
import { computeDiscount } from '@/utils/compute'
import { formatAmount, formatDate, getDueStatus, snakeToCamelCase } from '@/utils/formatters'
import { lookupPayingStatus } from '@/utils/lookups'
import { describe, expect, test } from 'vitest'

describe('formatters', () => {
  test('format money', () => {
    expect(formatAmount(100)).toStrictEqual('₱ 100.00')
    expect(formatAmount(100.00)).toStrictEqual('₱ 100.00')
    expect(formatAmount(100.50)).toStrictEqual('₱ 100.50')
    expect(formatAmount(100.59)).toStrictEqual('₱ 100.59')
    expect(formatAmount(100.599)).toStrictEqual('₱ 100.59')
    expect(formatAmount(1500)).toStrictEqual('₱ 1,500.00')
  })

  test('convert snake to camel case', () => {
    expect(snakeToCamelCase('hello_world_whats_up_hahaha')).toStrictEqual('helloWorldWhatsUpHahaha')
  })

  test('format date', () => {
    expect(formatDate('2024-10-15')).toStrictEqual('Oct 15, 2024')
    expect(formatDate('2024-10-15', 'YYYY-MM-DD')).toStrictEqual('2024-10-15')
  })

  test('get due status', () => {
    expect(getDueStatus('2024-10-15', '2024-10-15')).toStrictEqual('today')
    expect(getDueStatus('2024-10-16', '2024-10-15')).toStrictEqual('near')
    expect(getDueStatus('2024-10-20', '2024-10-15')).toStrictEqual('near')
    expect(getDueStatus('2024-10-21', '2024-10-15')).toStrictEqual('pending')
    expect(getDueStatus('2024-10-14', '2024-10-15')).toStrictEqual('overdue')
  })
})

describe('computers', () => {
  test('compute discount', () => {
    expect(computeDiscount(1800, 1800, false)).toStrictEqual(0)
    expect(computeDiscount(1800, 70, true)).toStrictEqual(540)
  })
})

describe('lookups', () => {
  test('paying status lookup', () => {
    expect(lookupPayingStatus('academic_scholar')).toStrictEqual('Honor Student')
  })
})