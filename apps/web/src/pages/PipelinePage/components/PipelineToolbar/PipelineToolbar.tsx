import { MagnifyingGlass, Plus } from '@phosphor-icons/react'
import { Select } from '../../../../components/ui/Select'
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
      <div className={styles.searchWrap}>
        <MagnifyingGlass size={14} weight="bold" color="var(--c-ink-muted)" />
        <input
          className={styles.searchInput}
          placeholder="Search candidates..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>

      <Select
        value={jobFilter}
        onChange={onJobFilterChange}
        options={[
          { value: 'all', label: 'All jobs' },
          ...jobs.map(j => ({ value: j.id, label: j.title })),
        ]}
      />

      <button className={styles.addBtn} onClick={onAddClick}>
        <Plus size={14} weight="bold" />
        Add candidate
      </button>
    </div>
  )
}
