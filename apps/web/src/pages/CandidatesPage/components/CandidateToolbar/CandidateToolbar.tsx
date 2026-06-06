import { MagnifyingGlass, Plus } from '@phosphor-icons/react'
import { Select } from '../../../../components/ui/Select'
import { SOURCE_OPTIONS, STAGE_OPTIONS } from '../../constants'
import styles from './CandidateToolbar.module.css'

interface CandidateToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  sourceFilter: string
  onSourceFilterChange: (value: string) => void
  stageFilter: string
  onStageFilterChange: (value: string) => void
  onAddClick: () => void
}

export function CandidateToolbar({
  search,
  onSearchChange,
  sourceFilter,
  onSourceFilterChange,
  stageFilter,
  onStageFilterChange,
  onAddClick,
}: CandidateToolbarProps) {
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
        value={sourceFilter}
        onChange={onSourceFilterChange}
        options={[{ value: 'All', label: 'All sources' }, ...SOURCE_OPTIONS]}
      />

      <Select
        value={stageFilter}
        onChange={onStageFilterChange}
        options={STAGE_OPTIONS}
      />

      <button className={styles.addBtn} onClick={onAddClick}>
        <Plus size={14} weight="bold" />
        Add candidate
      </button>
    </div>
  )
}
