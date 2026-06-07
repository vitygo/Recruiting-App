import { MagnifyingGlass, Plus } from '@phosphor-icons/react'
import { Select } from '../../../../components/ui/Select'
import { STATUS_OPTIONS, TYPE_OPTIONS } from '../../constants'
import styles from './JobToolbar.module.css'

type Props = {
  search: string
  onSearchChange: (v: string) => void
  statusFilter: string
  onStatusFilterChange: (v: string) => void
  typeFilter: string
  onTypeFilterChange: (v: string) => void
  onAddClick: () => void
}

export function JobToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  onAddClick,
}: Props) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.searchWrap}>
        <MagnifyingGlass size={14} weight="bold" color="var(--c-ink-muted)" />
        <input
          className={styles.searchInput}
          placeholder="Search jobs..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>

      <Select
        value={statusFilter}
        onChange={onStatusFilterChange}
        options={STATUS_OPTIONS}
      />

      <Select
        value={typeFilter}
        onChange={onTypeFilterChange}
        options={TYPE_OPTIONS}
      />

      <button className={styles.addBtn} onClick={onAddClick}>
        <Plus size={14} weight="bold" />
        Post a job
      </button>
    </div>
  )
}
