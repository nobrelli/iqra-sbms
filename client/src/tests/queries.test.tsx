// import { useFetchDiscounts } from '@/api/discount'
// import { useFetchFees } from '@/api/fee'
// import { useFetchStudents } from '@/api/student'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { renderHook, waitFor } from "@testing-library/react"
// import { afterEach } from 'node:test'
// import { ReactNode } from 'react'
// import { describe, expect, test } from 'vitest'


// describe('queries', () => {
//     const queryClient = new QueryClient({
//         defaultOptions: {
//             queries: {
//                 retry: false
//             }
//         }
//     })

//     const createWrapper = ({ children }: { children: ReactNode }) => (
//         <QueryClientProvider client={queryClient}>
//             {children}
//         </QueryClientProvider>
//     )

//     afterEach(() => {
//         queryClient.clear()
//     })

//     test('fetch students', async () => {
//         const { result } = renderHook(() => useFetchStudents(), {
//             wrapper: createWrapper
//         })
        
//         await waitFor(() => expect(result.current.isSuccess).toBe(true))
//     })

//     test('fetch fees', async () => {
//         const { result } = renderHook(() => useFetchFees(), {
//             wrapper: createWrapper
//         })
        
//         await waitFor(() => expect(result.current.isSuccess).toBe(true))
//     })

//     test('fetch discounts', async () => {
//         const { result } = renderHook(() => useFetchDiscounts(), {
//             wrapper: createWrapper
//         })
        
//         await waitFor(() => expect(result.current.isSuccess).toBe(true))
//     })
// })