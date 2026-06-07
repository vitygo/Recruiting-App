import { useState } from 'react'
import { X } from '@phosphor-icons/react'
import { Select } from '../../../../components/ui/Select'
import { FormInput } from '../../../../components/ui/FormInput'
import { JOB_TYPE_OPTIONS } from '../../constants'
import styles from './AddJobModal.module.css'

export type AddJobData = {
  title: string
  department: string
  location: string
  type: string
  salaryMin: number
  salaryMax: number
  description: string
}

type Props = {
  onClose: () => void
  onAdd: (data: AddJobData) => void
}

export function AddJobModal({ onClose, onAdd }: Props) {
  const [form, setForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'FULL_TIME',
    salaryMin: '',
    salaryMax: '',
    description: '',
  })

  const handleSubmit = () => {
    if (!form.title || !form.department) return
    onAdd({
      ...form,
      salaryMin: Number(form.salaryMin) || 0,
      salaryMax: Number(form.salaryMax) || 0,
    })
    onClose()
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalName}>Post a job</div>
            <div className={styles.modalRole}>Fill in the job details</div>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>
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

          <div className={styles.twoCol}>
            <FormInput
              label="Department"
              required
              value={form.department}
              onChange={v => setForm(p => ({ ...p, department: v }))}
              placeholder="Engineering"
            />
            <FormInput
              label="Location"
              value={form.location}
              onChange={v => setForm(p => ({ ...p, location: v }))}
              placeholder="Kyiv, Ukraine"
            />
          </div>

          <div className={styles.modalSection}>
            <div className={styles.modalSectionLabel}>Type</div>
            <Select
              fullWidth
              value={form.type}
              onChange={v => setForm(p => ({ ...p, type: v }))}
              options={JOB_TYPE_OPTIONS}
            />
          </div>

          <div className={styles.twoCol}>
            <FormInput
              label="Salary min ($)"
              value={form.salaryMin}
              onChange={v => setForm(p => ({ ...p, salaryMin: v }))}
              placeholder="3000"
              type="number"
            />
            <FormInput
              label="Salary max ($)"
              value={form.salaryMax}
              onChange={v => setForm(p => ({ ...p, salaryMax: v }))}
              placeholder="6000"
              type="number"
            />
          </div>

          <div className={styles.modalSection}>
            <div className={styles.modalSectionLabel}>Description</div>
            <textarea
              className={styles.textarea}
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Describe the role, responsibilities and requirements..."
              rows={4}
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSubmit}>Post job</button>
        </div>
      </div>
    </div>
  )
}
