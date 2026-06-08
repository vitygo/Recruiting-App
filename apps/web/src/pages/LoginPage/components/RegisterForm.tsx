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

const registerSchema = z.object({
  name: z.string().min(2, 'At least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
})

type RegisterInput = z.infer<typeof registerSchema>

type Props = {
  onSwitchToLogin: () => void
}

export default function RegisterForm({ onSwitchToLogin }: Props) {
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuthStore()
  const navigate = useNavigate()
  const createRipple = useRipple()
  const form = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true)
    try {
      const res = await authApi.register(data)
      setAccessToken(res.accessToken)
      setUser(res.user)
      localStorage.setItem('is_demo_active', 'true')
      toast.success('Account created!')
      navigate('/dashboard')
    } catch {
      toast.error('Email already in use')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className={styles.formTitle}>Create account</div>
      <div className={styles.formSub}>
        Already have one?{' '}
        <a onClick={onSwitchToLogin}>Sign in</a>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Full name</label>
          <input
            className={styles.formInput}
            placeholder="Alex Johnson"
            {...form.register('name')}
          />
        </div>
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
            placeholder="Min. 8 characters"
            {...form.register('password')}
          />
        </div>
        <button
          className={styles.submitBtn}
          type="submit"
          disabled={loading}
          onClick={createRipple}
        >
          {loading ? 'Creating account...' : 'Get started free →'}
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
        By signing up you agree to our <a href="#">Terms</a>
      </div>
    </>
  )
}
