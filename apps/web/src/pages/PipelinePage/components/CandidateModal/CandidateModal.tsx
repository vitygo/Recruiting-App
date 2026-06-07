import { useEffect, Fragment } from 'react'
import { X, Envelope, Phone, Sparkle, Trash, Check } from '@phosphor-icons/react'
import { STAGES } from '../../constants'
import { getInitials, getAvatarColor } from '../../utils'
import type { CandidateJob, PipelineStage } from '../../../../types'
import styles from './CandidateModal.module.css'

interface CandidateModalProps {
  item: CandidateJob
  onClose: () => void
  onStageChange: (stage: PipelineStage) => void
  onDelete?: (itemId: string) => void
}

export function CandidateModal({ item, onClose, onStageChange, onDelete }: CandidateModalProps) {
  const currentStageIdx = STAGES.findIndex(s => s.id === item.stage)
  const isRejected = item.stage === 'REJECTED'
  const initials = getInitials(item.candidate?.firstName, item.candidate?.lastName)
  const avatarColor = getAvatarColor(item.candidateId)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className={styles.modal} role="dialog" aria-modal="true" aria-label={`${item.candidate?.firstName} ${item.candidate?.lastName} profile`}>
      <div className={styles.modalOverlay} onClick={onClose} aria-hidden="true" />
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <div className={styles.modalAvatar} style={{ background: avatarColor }} aria-hidden="true">{initials}</div>
          <div>
            <div className={styles.modalName}>{item.candidate?.firstName} {item.candidate?.lastName}</div>
            <div className={styles.modalRole}>
              {item.job?.title && <span>{item.job.title} · </span>}
              {item.candidate?.location || 'No location'} · {item.candidate?.source}
            </div>
            {item.appliedAt && (
              <div className={styles.modalApplied}>{item.appliedAt}</div>
            )}
          </div>
          <div className={styles.modalActions}>
            {onDelete && (
              <button
                type="button"
                className={`${styles.modalActionBtn} ${styles.modalActionBtnDanger}`}
                onClick={() => onDelete(item.id)}
                aria-label="Remove from pipeline"
                title="Remove from pipeline"
              >
                <Trash size={15} weight="bold" aria-hidden="true" />
              </button>
            )}
            <button type="button" className={styles.modalCloseBtn} onClick={onClose} aria-label="Close">
              <X size={16} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalSection}>
            <div className={styles.modalSectionLabel}>Pipeline stage</div>

            <div className={styles.stepper} role="group" aria-label="Pipeline stages">
              {STAGES.map((stage, idx) => {
                const highlighted = !isRejected && idx <= currentStageIdx
                const isActive = idx === currentStageIdx && !isRejected
                const isRejectedNode = stage.id === 'REJECTED' && isRejected
                const segHighlighted = !isRejected && idx > 0 && (idx - 1) < currentStageIdx

                return (
                  <Fragment key={stage.id}>
                    {idx > 0 && (
                      <div
                        className={`${styles.stepSeg} ${segHighlighted ? styles.stepSegDone : ''}`}
                        aria-hidden="true"
                      />
                    )}
                    <button
                      type="button"
                      className={styles.stepItem}
                      onClick={() => onStageChange(stage.id as PipelineStage)}
                      aria-label={`Set stage to ${stage.label}`}
                      aria-pressed={isActive || isRejectedNode}
                    >
                      <div className={[
                        styles.stepNode,
                        isRejectedNode ? styles.stepNodeRejected :
                        isActive ? styles.stepNodeActive :
                        highlighted ? styles.stepNodeDone : '',
                      ].filter(Boolean).join(' ')}>
                        {isRejectedNode
                          ? <X size={7} weight="bold" />
                          : (highlighted && !isActive)
                            ? <Check size={7} weight="bold" />
                            : null
                        }
                      </div>
                      <span className={[
                        styles.stepLabel,
                        isRejectedNode ? styles.stepLabelRejected :
                        isActive ? styles.stepLabelActive :
                        highlighted ? styles.stepLabelDone : '',
                      ].filter(Boolean).join(' ')}>
                        {stage.label}
                      </span>
                    </button>
                  </Fragment>
                )
              })}
            </div>
          </div>

          <div className={styles.twoCol}>
            <div className={styles.modalSection}>
              <div className={styles.modalSectionLabel}>Contact</div>
              <div className={styles.infoRow}>
                <Envelope size={14} weight="fill" className={styles.infoIcon} aria-hidden="true" />
                {item.candidate?.email || '—'}
              </div>
              {item.candidate?.phone && (
                <div className={styles.infoRow}>
                  <Phone size={14} weight="fill" className={styles.infoIcon} aria-hidden="true" />
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
                  <Sparkle size={20} weight="fill" color="var(--c-orange)" aria-hidden="true" />
                </div>
                <div className={styles.aiBarWrap} aria-hidden="true">
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
