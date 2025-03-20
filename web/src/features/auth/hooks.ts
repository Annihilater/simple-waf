import { useState } from 'react'
import { useNavigate } from 'react-router' // 修改导入路径从react-router-dom到react-router
import { useQuery, useMutation } from '@tanstack/react-query'
import { authApi } from '@/api/services'
import useAuthStore from '@/store/auth'
import { LoginFormValues, PasswordResetFormValues } from '@/validations/auth'

export const useLogin = () => {
    const navigate = useNavigate()
    const { login } = useAuthStore()
    const [error, setError] = useState<string | null>(null)

    const mutation = useMutation({
        mutationFn: (values: LoginFormValues) => authApi.login(values),
        onSuccess: (data) => {
            // Store token and user data
            login(data.token, data.user)

            // Redirect based on password reset requirement
            if (data.user.needReset) {
                navigate('/reset-password')
            } else {
                navigate('/')
            }
        },
        onError: (error: any) => {
            setError(error.response?.data?.message || '登录失败，请检查用户名和密码')
        },
    })

    return {
        login: mutation.mutate,
        isLoading: mutation.isLoading, // 修改 isPending 为 isLoading
        error,
        clearError: () => setError(null),
    }
}

export const useResetPassword = () => {
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const { user, logout } = useAuthStore()

    const mutation = useMutation({
        mutationFn: (values: Omit<PasswordResetFormValues, 'confirmPassword'>) => {
            return authApi.resetPassword({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
            })
        },
        onSuccess: () => {
            // If the user was required to reset password, log them out
            // to force a new login with the new password
            if (user?.needReset) {
                logout()
                navigate('/login', { state: { message: '密码已重置，请使用新密码登录' } })
            } else {
                navigate('/')
            }
        },
        onError: (error: any) => {
            setError(error.response?.data?.message || '密码重置失败，请重试')
        },
    })

    return {
        resetPassword: mutation.mutate,
        isLoading: mutation.isLoading, // 修改 isPending 为 isLoading
        error,
        clearError: () => setError(null),
    }
}

export const useCurrentUser = () => {
    const { user, setUser } = useAuthStore()

    const { data, isLoading, error } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => authApi.getCurrentUser(),
        enabled: !!useAuthStore.getState().token,
        onSuccess: (data) => {
            if (data) {
                setUser(data)
            }
        },
    })

    return {
        user: data || user,
        isLoading,
        error,
    }
}