import { useState } from 'react'
import { X } from '@phosphor-icons/react'
import { Select } from '../../../../components/ui/Select'
import { FormInput } from '../../../../components/ui/FormInput'
import { TechMultiSelect } from '../../../../components/ui/TechMultiSelect'
import { JOB_TYPE_OPTIONS, TECHNOLOGIES_LIST } from '../../constants'
import styles from './AddJobModal.module.css'

export type AddJobData = {
  title: string
  department: string
  location: string
  type: string
  salaryMin: number
  salaryMax: number
  description: string
  technologies: string[]
}

type Errors = Partial<Record<'title' | 'department' | 'location' | 'description', string>>

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
    technologies: [] as string[],
  })
  const [errors, setErrors] = useState<Errors>({})

  const set = (key: string) => (v: string) => {
    setForm(p => ({ ...p, [key]: v }))
    setErrors(p => ({ ...p, [key]: undefined }))
  }

  const validate = (): Errors => {
    const e: Errors = {}
    if (!form.title.trim()) e.title = 'This field is required'
    if (!form.department.trim()) e.department = 'This field is required'
    if (!form.location.trim()) e.location = 'This field is required'
    if (!form.description.trim()) e.description = 'This field is required'
    return e
  }

  const handleSubmit = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onAdd({
      ...form,
      salaryMin: Number(form.salaryMin) || 0,
      salaryMax: Number(form.salaryMax) || 0,
    })
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
          <button type="button" className={styles.modalCloseBtn} onClick={onClose} aria-label="Close modal">
            <X size={16} weight="bold" aria-hidden="true" />
          </button>
        </div>

        <div className={styles.modalBody}>
          <FormInput
            label="Job title"
            required
            value={form.title}
            onChange={set('title')}
            placeholder="Senior Full-Stack Engineer"
            error={errors.title}
          />

          <div className={styles.twoCol}>
            <FormInput
              label="Department"
              required
              value={form.department}
              onChange={set('department')}
              placeholder="Engineering"
              error={errors.department}
            />
            <FormInput
              label="Location"
              required
              value={form.location}
              onChange={set('location')}
              placeholder="Kyiv, Ukraine"
              error={errors.location}
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
              onChange={set('salaryMin')}
              placeholder="3000"
              type="number"
            />
            <FormInput
              label="Salary max ($)"
              value={form.salaryMax}
              onChange={set('salaryMax')}
              placeholder="6000"
              type="number"
            />
          </div>

          <TechMultiSelect
            label="Tech stack"
            selected={form.technologies}
            options={TECHNOLOGIES_LIST}
            onChange={v => setForm(p => ({ ...p, technologies: v }))}
            placeholder="Search technologies…"
          />

          <div className={styles.modalSection}>
            <div className={`${styles.modalSectionLabel}${errors.description ? ' ' + styles.labelError : ''}`}>
              Description <span className={styles.required}>*</span>
            </div>
            <textarea
              className={`${styles.textarea}${errors.description ? ' ' + styles.textareaError : ''}`}
              value={form.description}
              onChange={e => {
                setForm(p => ({ ...p, description: e.target.value }))
                setErrors(p => ({ ...p, description: undefined }))
              }}
              placeholder="Describe the role, responsibilities and requirements..."
              rows={4}
              aria-label="Job description"
            />
            {errors.description && <span className={styles.fieldError}>{errors.description}</span>}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button type="button" className={styles.saveBtn} onClick={handleSubmit}>Post job</button>
        </div>
      </div>
    </div>
  )
}
