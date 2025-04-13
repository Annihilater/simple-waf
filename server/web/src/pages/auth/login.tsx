import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { LoginForm } from '@/feature/auth/components/LoginForm'
import useAuthStore from '@/store/auth'
import { useTranslation } from 'react-i18next'

export default function LoginPage() {
    const { isAuthenticated, needPasswordReset } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation()

    // Get the redirect path from location state, or default to '/'
    const from = location.state?.from?.pathname || '/'

    useEffect(() => {
        // If already authenticated
        if (isAuthenticated) {
            // If needs password reset, redirect to reset page
            if (needPasswordReset) {
                navigate('/reset-password')
            } else {
                // Otherwise, redirect to the page they tried to access or home
                navigate(from)
            }
        }
    }, [isAuthenticated, needPasswordReset, navigate, from])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-500 to-indigo-500">
            {/* 动态背景元素 */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[80%] h-[80%] top-[10%] left-[10%] bg-purple-300/20 rounded-full blur-3xl"></div>
                <div className="absolute w-[40%] h-[40%] top-[5%] right-[15%] bg-cyan-300/20 rounded-full blur-3xl"></div>
                <div className="absolute w-[50%] h-[50%] bottom-[5%] left-[15%] bg-indigo-300/20 rounded-full blur-3xl"></div>
            </div>

            <div className="mb-8 z-10 flex flex-col items-center">
                <h1 className="text-3xl font-bold text-center text-white drop-shadow-md">
                    {t('sidebar.title')}
                </h1>
            </div>

            <div className="w-full max-w-md z-10">
                <LoginForm />
            </div>

            {/* 底部说明文字 */}
            <div className="mt-8 text-white/70 text-sm text-center z-10">
                © {new Date().getFullYear()} RuiQi WAF. All rights reserved.
            </div>
        </div>
    )
}