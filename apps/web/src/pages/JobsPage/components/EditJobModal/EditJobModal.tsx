import { useState } from 'react'
import { X } from '@phosphor-icons/react'
import { Select } from '../../../../components/ui/Select'
import { FormInput } from '../../../../components/ui/FormInput'
import { JOB_STATUS_EDIT_OPTIONS } from '../../constants'
import type { Job } from '../../../../types'
import styles from './EditJobModal.module.css'

export type EditJobData = {
  title: string
  department: string
  status: Job['status']
}

type Props = {
  job: Job
  onClose: () => void
  onSave: (data: EditJobData) => void
}

export function EditJobModal({ job, onClose, onSave }: Props) {
  const [form, setForm] = useState<EditJobData>({
    title: job.title,
    department: job.department,
    status: job.status,
  })

  const handleSubmit = () => {
    if (!form.title || !form.department) return
    onSave(form)
    onClose()
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalName}>Edit job</div>
            <div className={styles.modalRole}>{job.title}</div>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose} aria-label="Close">
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className={styles.modalBody}>
          <FormInput
            label="Job title"
            required
            value={form.title}
            onChange={v => setForm(p => ({ ...p, title: v }))}
            placeholder="Senior Full-Stack Engineer"
          />

          <FormInput
            label="Department"
            required
            value={form.department}
            onChange={v => setForm(p => ({ ...p, department: v }))}
            placeholder="Engineering"
          />

          <div className={styles.modalSection}>
            <div className={styles.modalSectionLabel}>Status</div>
            <Select
              fullWidth
              value={form.status}
              onChange={v => setForm(p => ({ ...p, status: v as Job['status'] }))}
              options={JOB_STATUS_EDIT_OPTIONS}
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSubmit}>Save changes</button>
        </div>
      </div>
    </div>
  )
}
