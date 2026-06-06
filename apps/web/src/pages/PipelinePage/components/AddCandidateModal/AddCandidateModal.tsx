import { useState } from 'react'
import { X } from '@phosphor-icons/react'
import { Select } from '../../../../components/ui/Select'
import { FormInput } from '../../../../components/ui/FormInput'
import { SOURCE_OPTIONS, STAGE_OPTIONS } from '../../constants'
import styles from './AddCandidateModal.module.css'

interface AddCandidateFormData {
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
  const [form, setForm] = useState<AddCandidateFormData>({
    firstName: '', lastName: '', email: '',
    phone: '', location: '', source: 'MANUAL',
    stage: defaultStage,
    jobId: selectedJobId !== 'all' ? selectedJobId : '',
  })

  const handleSubmit = () => {
    if (!form.firstName || !form.email) return
    onAdd(form)
    onClose()
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalName}>Add candidate</div>
            <div className={styles.modalRole}>Fill in the candidate details</div>
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

          <div className={styles.twoCol}>
            <div className={styles.modalSection}>
              <div className={styles.modalSectionLabel}>Source</div>
              <Select fullWidth value={form.source} onChange={v => setForm(p => ({ ...p, source: v }))} options={SOURCE_OPTIONS} />
            </div>
            <div className={styles.modalSection}>
              <div className={styles.modalSectionLabel}>Stage</div>
              <Select fullWidth value={form.stage} onChange={v => setForm(p => ({ ...p, stage: v }))} options={STAGE_OPTIONS} />
            </div>
          </div>

          {jobs.length > 0 && (
            <div className={styles.modalSection}>
              <div className={styles.modalSectionLabel}>Job position</div>
              <Select
                fullWidth
                value={form.jobId}
                onChange={v => setForm(p => ({ ...p, jobId: v }))}
                options={[
                  { value: '', label: 'No job selected' },
                  ...jobs.map(j => ({ value: j.id, label: j.title })),
                ]}
              />
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSubmit}>Add candidate</button>
        </div>
      </div>
    </div>
  )
}
