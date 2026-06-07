import { MagnifyingGlass, Plus } from '@phosphor-icons/react'
import styles from './PipelineToolbar.module.css'

interface Job {
  id: string
  title: string
}

interface PipelineToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  jobFilter: string
  onJobFilterChange: (value: string) => void
  jobs: Job[]
  onAddClick: () => void
}

export function PipelineToolbar({
  search,
  onSearchChange,
  jobFilter,
  onJobFilterChange,
  jobs,
  onAddClick,
}: PipelineToolbarProps) {
  return (
    <div className={styles.toolbar}>
      {jobs.length > 0 && (
        <div className={styles.jobTabs} role="tablist" aria-label="Filter by job">
          <button
            type="button"
            role="tab"
            aria-selected={jobFilter === 'all'}
            className={`${styles.jobTab} ${jobFilter === 'all' ? styles.jobTabActive : ''}`}
            onClick={() => onJobFilterChange('all')}
          >
            All jobs
          </button>
          {jobs.map(j => (
            <button
              key={j.id}
              type="button"
              role="tab"
              aria-selected={jobFilter === j.id}
              className={`${styles.jobTab} ${jobFilter === j.id ? styles.jobTabActive : ''}`}
              onClick={() => onJobFilterChange(j.id)}
            >
              {j.title}
            </button>
          ))}
        </div>
      )}

      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <MagnifyingGlass size={14} weight="bold" color="var(--c-ink-muted)" aria-hidden="true" />
          <input
            className={styles.searchInput}
            placeholder="Search candidates…"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            aria-label="Search candidates"
          />
        </div>

        <button type="button" className={styles.addBtn} onClick={onAddClick}>
          <Plus size={14} weight="bold" aria-hidden="true" />
          Add candidate
        </button>
      </div>
    </div>
  )
}
