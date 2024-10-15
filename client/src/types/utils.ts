import { QueryClient } from "@tanstack/react-query"
import { MetaPaginated } from "./ui"

export type PayloadTypes = number | string | string[] | boolean | Date | null | object | unknown
export type Payload = Record<string, PayloadTypes> | Record<string, PayloadTypes>[] | PayloadTypes

export interface FetchResponse<T extends Payload> {
  payload?: T
  meta: {
    message: string | undefined
    code?: number
    [key: string]: number | string | undefined
  } & MetaPaginated
}

export interface RequestError extends Error {
  code: number
}

export type RouteContextProps = {
  queryClient: QueryClient
  isAuth: boolean
}