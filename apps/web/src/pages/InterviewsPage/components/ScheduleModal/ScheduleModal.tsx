import { useState } from 'react'
import { X } from '@phosphor-icons/react'
import { Select } from '../../../../components/ui/Select'
import { FormInput } from '../../../../components/ui/FormInput'
import type { Interview } from '../../../../types'
import { TYPE_OPTIONS } from '../../constants'
import styles from './ScheduleModal.module.css'

export function ScheduleModal({ onClose, onSave, candidates, jobs }: {
  onClose: () => void
  onSave: (data: Partial<Interview>) => void
  candidates: { id: string; firstName?: string; lastName?: string }[]
  jobs: { id: string; title: string }[]
}) {
  const today = new Date()
  const [form, setForm] = useState({
    candidateId: '',
    jobId: '',
    date: today.toISOString().split('T')[0],
    time: '10:00',
    duration: '60',
    type: 'VIDEO',
    meetLink: '',
    notes: '',
  })

  const handleSave = () => {
    if (!form.candidateId || !form.jobId) return
    const scheduledAt = new Date(`${form.date}T${form.time}`).toISOString()
    onSave({
      candidateId: form.candidateId,
      jobId: form.jobId,
      scheduledAt,
      duration: Number(form.duration),
      type: form.type as Interview['type'],
      status: 'SCHEDULED',
      meetLink: form.meetLink || undefined,
      notes: form.notes || undefined,
    })
    onClose()
  }

  const candidateOptions = candidates.map(c => ({
    value: c.id,
    label: `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.id,
  }))

  const jobOptions = jobs.map(j => ({ value: j.id, label: j.title }))

  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalName}>Schedule interview</div>
            <div className={styles.modalRole}>Set up a new interview</div>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalSection}>
            <div className={styles.modalSectionLabel}>Candidate *</div>
            <Select
              fullWidth
              value={form.candidateId}
              onChange={v => setForm(p => ({ ...p, candidateId: v }))}
              options={[{ value: '', label: 'Select candidate...' }, ...candidateOptions]}
            />
          </div>

          <div className={styles.modalSection}>
            <div className={styles.modalSectionLabel}>Job position *</div>
            <Select
              fullWidth
              value={form.jobId}
              onChange={v => setForm(p => ({ ...p, jobId: v }))}
              options={[{ value: '', label: 'Select job...' }, ...jobOptions]}
            />
          </div>

          <div className={styles.twoCol}>
            <FormInput label="Date" type="date" value={form.date} onChange={v => setForm(p => ({ ...p, date: v }))} />
            <FormInput label="Time" type="time" value={form.time} onChange={v => setForm(p => ({ ...p, time: v }))} />
          </div>

          <div className={styles.twoCol}>
            <FormInput label="Duration (min)" type="number" value={form.duration} onChange={v => setForm(p => ({ ...p, duration: v }))} placeholder="60" />
            <div className={styles.modalSection}>
              <div className={styles.modalSectionLabel}>Type</div>
              <Select fullWidth value={form.type} onChange={v => setForm(p => ({ ...p, type: v }))} options={TYPE_OPTIONS} />
            </div>
          </div>

          <FormInput label="Meet link (optional)" value={form.meetLink} onChange={v => setForm(p => ({ ...p, meetLink: v }))} placeholder="https://meet.google.com/..." />
          <FormInput label="Notes (optional)" value={form.notes} onChange={v => setForm(p => ({ ...p, notes: v }))} placeholder="Add notes..." />
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave}>Schedule</button>
        </div>
      </div>
    </div>
  )
}
