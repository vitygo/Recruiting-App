import { useState, useRef } from 'react'
import { X } from '@phosphor-icons/react'
import { Select } from '../../../../components/ui/Select'
import { FormInput } from '../../../../components/ui/FormInput'
import type { Candidate } from '../../../../types'
import { SOURCE_OPTIONS } from '../../constants'
import { getInitials } from '../../utils'
import styles from './CandidateFormModal.module.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[+\d()\-\s]*$/

interface CandidateFormModalProps {
  candidate?: Candidate
  onClose: () => void
  onSave: (data: Partial<Candidate>) => void
  title: string
  submitLabel: string
  isSubmitting?: boolean
}

type Errors = Partial<Record<'firstName' | 'lastName' | 'email' | 'phone', string>>

export function CandidateFormModal({ candidate, onClose, onSave, title, submitLabel, isSubmitting }: CandidateFormModalProps) {
  const [form, setForm] = useState({
    firstName: candidate?.firstName || '',
    lastName: candidate?.lastName || '',
    email: candidate?.email || '',
    phone: candidate?.phone || '',
    location: candidate?.location || '',
    source: candidate?.source || 'MANUAL',
  })
  const [errors, setErrors] = useState<Errors>({})

  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof typeof form>(key: K) => (v: string) => {
    setForm(p => ({ ...p, [key]: v }))
    setErrors(p => ({ ...p, [key]: undefined }))
  }

  const validate = (): Errors => {
    const e: Errors = {}
    if (!form.firstName.trim()) e.firstName = 'This field is required'
    if (!form.lastName.trim()) e.lastName = 'This field is required'
    if (!form.email.trim()) {
      e.email = 'This field is required'
    } else if (!EMAIL_REGEX.test(form.email)) {
      e.email = 'Invalid email format'
    }
    if (form.phone && !PHONE_REGEX.test(form.phone)) {
      e.phone = 'Please enter a valid phone number, digits only'
    }
    return e
  }

  const handleSubmit = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      if (errs.firstName) firstNameRef.current?.focus()
      else if (errs.lastName) lastNameRef.current?.focus()
      else if (errs.email) emailRef.current?.focus()
      else if (errs.phone) phoneRef.current?.focus()
      return
    }
    onSave(form)
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderInfo}>
          {candidate && (
            <div className={styles.avatar}>
              {getInitials(candidate.firstName, candidate.lastName)}
            </div>
          )}
          <div>
            <div className={styles.modalName}>{title}</div>
            <div className={styles.modalRole}>Fill in the candidate details</div>
          </div>
          </div>
          <button type="button" className={styles.modalCloseBtn} onClick={onClose} aria-label="Close modal">
            <X size={16} weight="bold" aria-hidden="true" />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.twoCol}>
            <FormInput
              label="First name"
              required
              value={form.firstName}
              onChange={set('firstName')}
              placeholder="Alex"
              error={errors.firstName}
              inputRef={firstNameRef}
            />
            <FormInput
              label="Last name"
              required
              value={form.lastName}
              onChange={set('lastName')}
              placeholder="Johnson"
              error={errors.lastName}
              inputRef={lastNameRef}
            />
          </div>

          <FormInput
            label="Email"
            required
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="alex@email.com"
            error={errors.email}
            inputRef={emailRef}
          />

          <div className={styles.twoCol}>
            <FormInput
              label="Phone"
              value={form.phone}
              onChange={set('phone')}
              placeholder="+380 50 123 4567"
              error={errors.phone}
              inputRef={phoneRef}
            />
            <FormInput
              label="Location"
              value={form.location}
              onChange={set('location')}
              placeholder="Kyiv, Ukraine"
            />
          </div>

          <div className={styles.modalSection}>
            <div className={styles.modalSectionLabel}>Source</div>
            <Select fullWidth value={form.source} onChange={v => setForm(p => ({ ...p, source: v as typeof p.source }))} options={SOURCE_OPTIONS} />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSubmitting}>Cancel</button>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
