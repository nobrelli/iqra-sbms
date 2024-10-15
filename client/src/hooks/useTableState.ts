import { defaultPaginationSizes } from "@/components/tables/TablePaginator"
import { TableState } from "@/types/ui"
import { useReducer } from "react"

export enum TableActionType {
  PAGINATE,
  SORT,
  GLOBAL_FILTER,
  ROW_SELECT
}

export type TableAction =
  | ({ type: TableActionType.PAGINATE } & Pick<TableState, 'pagination'>)
  | ({ type: TableActionType.SORT } & Pick<TableState, 'sorting'>)
  | ({ type: TableActionType.GLOBAL_FILTER } & Pick<TableState, 'globalFilter'>)
  | ({ type: TableActionType.ROW_SELECT } & Pick<TableState, 'rowSelection'>)

const tableUtilsReducer = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case TableActionType.PAGINATE:
      return { ...state, pagination: action.pagination }
    case TableActionType.SORT:
      return { ...state, sorting: action.sorting }
    case TableActionType.GLOBAL_FILTER:
      return { ...state, globalFilter: action.globalFilter }
    case TableActionType.ROW_SELECT:
      return { ...state, rowSelection: action.rowSelection }
  }
}

export const initTableState: TableState = {
  pagination: {
    pageIndex: 0,
    pageSize: defaultPaginationSizes[0]
  },
  sorting: [],
  globalFilter: '',
  rowSelection: {}
}

export const useTableState = (defaultValues?: TableState) => {
  const [state, dispatch] = useReducer(tableUtilsReducer, defaultValues ?? initTableState)

  return {
    tableState: state,
    setTableState: dispatch
  }
}