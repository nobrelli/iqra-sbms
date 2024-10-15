import dayjs from 'dayjs'
import { InputAttributes, NumericFormatProps, numericFormatter } from 'react-number-format'

export const formatDateTime = (datetime: string) => {
  datetime = datetime.lastIndexOf('Z') < 0 ? datetime + 'Z' : datetime
  return dayjs(datetime).format('lll')
}

export const formatDate = (date: string, format?: string) => {
  return dayjs(date).format(format ?? 'll')
}

export const formatAmount = (amount: string | number, isPercent = false) => {
  /* return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    currencySign: 'accounting',
  }).format(amount) */

  const options: NumericFormatProps<InputAttributes> = isPercent
    ? { suffix: '%' } : {
      prefix: '₱ ',
      thousandSeparator: true,
      decimalScale: 2,
      fixedDecimalScale: true,
    }

  return numericFormatter(typeof amount === 'number' ? amount.toString() : amount, options)
}

export const joinNames = (lastName: string, firstName: string, midName?: string) => {
  return [`${lastName}, ${firstName}`, midName && `${midName.at(0)}.`].join(' ')
}

export const snakeToCamelCase = (textInSnakeCase: string) => {
  return textInSnakeCase.toLocaleLowerCase().split('_').map((word, index) =>
    !index ? word : word.charAt(0).toUpperCase() + word.slice(1)
  ).join('')
}

export const formatIfSingularOrPlural = (count: number, rootWord: string) => {
  return ''.concat(count.toString(), ' ', count > 1 ? rootWord + 's' : rootWord)
}

export const getDueStatus = (dueDate: string, from?: string) => {
  const today = dayjs(from ?? undefined)
  const due = dayjs(dueDate)
  const DAYS_BEFORE_NOTIF = 5 * 24 * 60 * 60 * 1000

  const daysDiff = due.diff(today, 'millisecond')
  
  if (daysDiff > 0 && daysDiff <= DAYS_BEFORE_NOTIF)
    return 'near'
  else if (daysDiff === 0 || today.isSame(due))
    return 'today'
  else if (daysDiff < 0)
    return 'overdue'
  else
    return 'pending'
}