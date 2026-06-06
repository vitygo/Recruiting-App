import { X, Envelope, CalendarBlank, Sparkle } from '@phosphor-icons/react'
import { STAGES } from '../../constants'
import { getInitials } from '../../utils'
import type { CandidateJob, PipelineStage } from '../../../../types'
import styles from './CandidateModal.module.css'

interface CandidateModalProps {
  item: CandidateJob
  onClose: () => void
  onStageChange: (stage: PipelineStage) => void
}

export function CandidateModal({ item, onClose, onStageChange }: CandidateModalProps) {
  const currentStageIdx = STAGES.findIndex(s => s.id === item.stage)
  const initials = getInitials(item.candidate?.firstName, item.candidate?.lastName)

  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <div className={styles.modalAvatar}>{initials}</div>
          <div>
            <div className={styles.modalName}>{item.candidate?.firstName} {item.candidate?.lastName}</div>
            <div className={styles.modalRole}>{item.candidate?.location || 'No location'} · {item.candidate?.source}</div>
          </div>
          <div className={styles.modalActions}>
            <button className={styles.modalActionBtn}><Envelope size={16} weight="fill" /></button>
            <button className={styles.modalActionBtn}><CalendarBlank size={16} weight="fill" /></button>
            <button className={styles.modalCloseBtn} onClick={onClose}><X size={16} weight="bold" /></button>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalSection}>
            <div className={styles.modalSectionLabel}>Pipeline stage</div>
            <div className={styles.stagePills}>
              {STAGES.map((stage, idx) => (
                <button
                  key={stage.id}
                  className={`${styles.stagePill} ${stage.id === item.stage ? styles.stagePillActive : ''} ${idx < currentStageIdx ? styles.stagePillDone : ''}`}
                  onClick={() => onStageChange(stage.id)}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.twoCol}>
            <div className={styles.modalSection}>
              <div className={styles.modalSectionLabel}>Contact</div>
              <div className={styles.infoRow}>
                <Envelope size={14} weight="fill" className={styles.infoIcon} />
                {item.candidate?.email || '—'}
              </div>
              {item.candidate?.phone && (
                <div className={styles.infoRow}>
                  <Sparkle size={14} weight="fill" className={styles.infoIcon} />
                  {item.candidate.phone}
                </div>
              )}
            </div>

            <div className={styles.modalSection}>
              <div className={styles.modalSectionLabel}>AI Score</div>
              <div className={styles.aiScoreBox}>
                <div className={styles.aiScoreTop}>
                  <div>
                    <div className={styles.aiScoreVal}>{item.aiScore ? `${item.aiScore}%` : '—'}</div>
                    <div className={styles.aiScoreLabel}>match score</div>
                  </div>
                  <Sparkle size={20} weight="fill" color="var(--c-orange)" />
                </div>
                <div className={styles.aiBarWrap}>
                  <div className={styles.aiBar} style={{ width: `${item.aiScore || 0}%` }} />
                </div>
                {item.aiReason && (
                  <div className={styles.aiTags}>
                    <span className={styles.aiTag}>{item.aiReason}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
