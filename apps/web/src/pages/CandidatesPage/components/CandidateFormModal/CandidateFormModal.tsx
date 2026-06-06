import { useState } from 'react'
import { X } from '@phosphor-icons/react'
import { Select } from '../../../../components/ui/Select'
import { FormInput } from '../../../../components/ui/FormInput'
import type { Candidate } from '../../../../types'
import { SOURCE_OPTIONS } from '../../constants'
import { getInitials } from '../../utils'
import styles from './CandidateFormModal.module.css'

interface CandidateFormModalProps {
  candidate?: Candidate
  onClose: () => void
  onSave: (data: Partial<Candidate>) => void
  title: string
  submitLabel: string
}

export function CandidateFormModal({ candidate, onClose, onSave, title, submitLabel }: CandidateFormModalProps) {
  const [form, setForm] = useState({
    firstName: candidate?.firstName || '',
    lastName: candidate?.lastName || '',
    email: candidate?.email || '',
    phone: candidate?.phone || '',
    location: candidate?.location || '',
    source: candidate?.source || 'MANUAL',
  })

  const handleSubmit = () => {
    if (!form.firstName || !form.email) return
    onSave(form)
    onClose()
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
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.twoCol}>
            <FormInput label="First name" required value={form.firstName} onChange={v => setForm(p => ({ ...p, firstName: v }))} placeholder="Alex" />
            <FormInput label="Last name" value={form.lastName} onChange={v => setForm(p => ({ ...p, lastName: v }))} placeholder="Johnson" />
          </div>

          <FormInput label="Email" required type="email" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} placeholder="alex@email.com" />

          <div className={styles.twoCol}>
            <FormInput label="Phone" value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} placeholder="+380 50 123 4567" />
            <FormInput label="Location" value={form.location} onChange={v => setForm(p => ({ ...p, location: v }))} placeholder="Kyiv, Ukraine" />
          </div>

          <div className={styles.modalSection}>
            <div className={styles.modalSectionLabel}>Source</div>
            <Select fullWidth value={form.source} onChange={v => setForm(p => ({ ...p, source: v }))} options={SOURCE_OPTIONS} />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSubmit}>{submitLabel}</button>
        </div>
      </div>
    </div>
  )
}
