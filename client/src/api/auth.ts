import { useAdminStore } from '@/lib/storeContext'
import { ChangePasswordFields, LoginFields } from '@/types/schemas'
import { request } from '@/utils/fetcher'
import { queryOptions, useMutation } from '@tanstack/react-query'

export const useLogin = () => {
  return useMutation({
    mutationFn: (formData: LoginFields) => request('/auth/login', 'POST', formData)
  })
}

export const useLogout = () => {
  const { setIsLoggingOut } = useAdminStore()

  return useMutation({
    mutationFn: () => request('/auth/logout', 'DELETE'),
    onError: () => setIsLoggingOut(false)
  })
}

export const checkAuthOptions = queryOptions({
  queryKey: ['auth'],
  queryFn: () => request('/auth/ping', 'GET'),
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  refetchInterval: 3000,
})

export const useChangePasswod = () => {
  return useMutation({
    mutationFn: (formData: Omit<ChangePasswordFields, 'rePassword'>) => 
      request('/auth/change_password', 'PATCH', formData)
  })
}