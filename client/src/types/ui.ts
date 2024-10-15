import { PaginationState, RowSelectionState, SortingState } from "@tanstack/react-table"

export type TableState = {
  pagination: PaginationState
  sorting?: SortingState
  globalFilter: string
  rowSelection?: RowSelectionState
}

export type TableServerQuery = {
  pageIndex: number
  pageSize: number
  filterQuery: string
}

export type MetaPaginated = {
  pageCount: number
  rowCount: number
}

export type Severity = 'info' | 'success' | 'warning' | 'error'

export type Notification = {
  title: string
  message: string
  severity: Severity
}