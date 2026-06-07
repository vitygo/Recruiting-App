import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAuthStore } from '../../../store/authStore'
import { useRipple } from '../../../hooks/useRipple'
import { authApi } from '../../../api'
import { setAccessToken } from '../../../api/client'
import styles from './LoginForm.module.css'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Required'),
})

type LoginInput = z.infer<typeof loginSchema>

type Props = {
  onSwitchToRegister: () => void
}

export default function LoginForm({ onSwitchToRegister }: Props) {
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuthStore()
  const navigate = useNavigate()
  const createRipple = useRipple()
  const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    try {
      const res = await authApi.login(data)
      setAccessToken(res.accessToken)
      setUser(res.user)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className={styles.formTitle}>Sign in</div>
      <div className={styles.formSub}>
        Don't have an account?{' '}
        <a onClick={onSwitchToRegister}>Create one free</a>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Email</label>
          <input
            className={styles.formInput}
            placeholder="you@company.com"
            {...form.register('email')}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Password</label>
          <input
            className={styles.formInput}
            type="password"
            placeholder="••••••••"
            {...form.register('password')}
          />
        </div>
        <button
          className={styles.submitBtn}
          type="submit"
          disabled={loading}
          onClick={createRipple}
        >
          {loading ? 'Signing in...' : 'Sign in →'}
        </button>
      </form>

      <div className={styles.divider}>
        <div className={styles.dividerLine} />
        <span className={styles.dividerText}>or continue with</span>
        <div className={styles.dividerLine} />
      </div>

      <button className={styles.googleBtn} onClick={createRipple}>
        <i className="ti ti-brand-google" />
        Google
      </button>

      <div className={styles.formFooter}>
        Forgot password? <a href="#">Reset it</a>
      </div>
    </>
  )
}
