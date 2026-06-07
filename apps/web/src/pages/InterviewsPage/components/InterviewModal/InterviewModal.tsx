import { useState } from 'react'
import { X, GoogleLogo, Trash } from '@phosphor-icons/react'
import { Select } from '../../../../components/ui/Select'
import { FormInput } from '../../../../components/ui/FormInput'
import type { Interview } from '../../../../types'
import { TYPE_OPTIONS, STATUS_OPTIONS } from '../../constants'
import { getInitials } from '../../utils/avatar'
import { openGoogleCalendar } from '../../utils/calendar'
import styles from './InterviewModal.module.css'

export function InterviewModal({ interview, onClose, onSave, onDelete }: {
  interview: Interview
  onClose: () => void
  onSave: (data: Partial<Interview>) => void
  onDelete: (id: string) => void
}) {
  const d = new Date(interview.scheduledAt)
  const [form, setForm] = useState({
    date: d.toISOString().split('T')[0],
    time: d.toTimeString().slice(0, 5),
    duration: String(interview.duration || 60),
    type: interview.type || 'VIDEO',
    status: interview.status || 'SCHEDULED',
    notes: interview.notes || '',
    meetLink: interview.meetLink || '',
  })

  const handleSave = () => {
    const scheduledAt = new Date(`${form.date}T${form.time}`).toISOString()
    onSave({
      scheduledAt,
      duration: Number(form.duration),
      type: form.type as Interview['type'],
      status: form.status as Interview['status'],
      notes: form.notes,
      meetLink: form.meetLink || undefined,
    })
    onClose()
  }

  const initials = getInitials(interview.candidate?.firstName, interview.candidate?.lastName)

  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <div className={styles.modalAvatar}>{initials}</div>
          <div>
            <div className={styles.modalName}>
              {interview.candidate?.firstName} {interview.candidate?.lastName}
            </div>
            <div className={styles.modalRole}>{interview.candidate?.email}</div>
          </div>
          <div className={styles.modalActions}>
            <button className={styles.gcalActionBtn} onClick={() => openGoogleCalendar(interview)}>
              <GoogleLogo size={14} weight="fill" />
              Add to Google Calendar
            </button>
            <button className={styles.modalCloseBtn} onClick={onClose}>
              <X size={16} weight="bold" />
            </button>
          </div>
        </div>

        <div className={styles.modalBody}>
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

          <div className={styles.modalSection}>
            <div className={styles.modalSectionLabel}>Status</div>
            <Select fullWidth value={form.status} onChange={v => setForm(p => ({ ...p, status: v }))} options={STATUS_OPTIONS} />
          </div>

          <FormInput label="Meet link" value={form.meetLink} onChange={v => setForm(p => ({ ...p, meetLink: v }))} placeholder="https://meet.google.com/..." />
          <FormInput label="Notes" value={form.notes} onChange={v => setForm(p => ({ ...p, notes: v }))} placeholder="Add notes about this interview..." />
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.deleteBtn} onClick={() => { onDelete(interview.id); onClose() }}>
            <Trash size={14} weight="fill" />
            Delete
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave}>Save changes</button>
        </div>
      </div>
    </div>
  )
}
