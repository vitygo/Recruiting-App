import { useState, useEffect } from 'react'
import { X, Briefcase } from '@phosphor-icons/react'
import { Select } from '../../../../components/ui/Select'
import { FormInput } from '../../../../components/ui/FormInput'
import { SOURCE_OPTIONS, STAGE_OPTIONS } from '../../constants'
import styles from './AddCandidateModal.module.css'

export interface AddCandidateFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  source: string
  stage: string
  jobId: string
}

interface AddCandidateModalProps {
  onClose: () => void
  onAdd: (data: AddCandidateFormData) => void
  defaultStage: string
  jobs: { id: string; title: string }[]
  selectedJobId: string
}

export function AddCandidateModal({ onClose, onAdd, defaultStage, jobs, selectedJobId }: AddCandidateModalProps) {
  const activeJob = selectedJobId !== 'all' ? jobs.find(j => j.id === selectedJobId) : undefined

  const [form, setForm] = useState<AddCandidateFormData>({
    firstName: '', lastName: '', email: '',
    phone: '', location: '', source: 'MANUAL',
    stage: defaultStage,
    jobId: activeJob?.id ?? '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof AddCandidateFormData, string>>>({})

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const validate = () => {
    const next: typeof errors = {}
    if (!form.firstName.trim()) next.firstName = 'Required'
    if (!form.email.trim())     next.email = 'Required'
    if (!form.jobId && jobs.length > 0) next.jobId = 'Select a job position'
    return next
  }

  const handleSubmit = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onAdd(form)
    onClose()
  }

  const set = <K extends keyof AddCandidateFormData>(key: K) =>
    (v: string) => {
      setForm(p => ({ ...p, [key]: v }))
      if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }))
    }

  return (
    <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Add candidate">
      <div className={styles.modalOverlay} onClick={onClose} aria-hidden="true" />
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalName}>Add candidate</div>
            <div className={styles.modalRole}>Fill in the candidate details</div>
          </div>
          <button type="button" className={styles.modalCloseBtn} onClick={onClose} aria-label="Close">
            <X size={16} weight="bold" aria-hidden="true" />
          </button>
        </div>

        {activeJob && (
          <div className={styles.activeJobBadge}>
            <Briefcase size={13} weight="fill" aria-hidden="true" />
            Adding to <strong>{activeJob.title}</strong> · Applied stage
          </div>
        )}

        <div className={styles.modalBody}>
          <div className={styles.twoCol}>
            <FormInput
              label="First name" required
              value={form.firstName} onChange={set('firstName')}
              placeholder="Alex"
            />
            <FormInput
              label="Last name"
              value={form.lastName} onChange={set('lastName')}
              placeholder="Johnson"
            />
          </div>

          <FormInput
            label="Email" required type="email"
            value={form.email} onChange={set('email')}
            placeholder="alex@email.com"
          />

          <div className={styles.twoCol}>
            <FormInput
              label="Phone"
              value={form.phone} onChange={set('phone')}
              placeholder="+1 212 555 0101"
            />
            <FormInput
              label="Location"
              value={form.location} onChange={set('location')}
              placeholder="New York, NY"
            />
          </div>

          <div className={styles.twoCol}>
            <div className={styles.modalSection}>
              <div className={styles.modalSectionLabel}>Source</div>
              <Select fullWidth value={form.source} onChange={set('source')} options={SOURCE_OPTIONS} />
            </div>
            <div className={styles.modalSection}>
              <div className={styles.modalSectionLabel}>Stage</div>
              <Select fullWidth value={form.stage} onChange={set('stage')} options={STAGE_OPTIONS} />
            </div>
          </div>

          {!activeJob && jobs.length > 0 && (
            <div className={styles.modalSection}>
              <div className={`${styles.modalSectionLabel} ${errors.jobId ? styles.labelError : ''}`}>
                Job position <span className={styles.required}>*</span>
              </div>
              <Select
                fullWidth
                value={form.jobId}
                onChange={set('jobId')}
                options={[
                  { value: '', label: 'Select a job…' },
                  ...jobs.map(j => ({ value: j.id, label: j.title })),
                ]}
              />
              {errors.jobId && <span className={styles.fieldError}>{errors.jobId}</span>}
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button type="button" className={styles.saveBtn} onClick={handleSubmit}>Add candidate</button>
        </div>
      </div>
    </div>
  )
}
