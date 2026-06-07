export const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  REMOTE: 'Remote',
}

export const STATUS_OPTIONS = [
  { value: 'All', label: 'All statuses' },
  { value: 'OPEN', label: 'Open' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'REVIEWING', label: 'Reviewing' },
  { value: 'ENDED', label: 'Ended' },
]

export const JOB_STATUS_EDIT_OPTIONS = [
  { value: 'OPEN', label: 'Open' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'REVIEWING', label: 'Reviewing' },
  { value: 'ENDED', label: 'Ended (Archived)' },
]

export const ACTIVE_STATUSES = new Set(['OPEN', 'ACTIVE', 'REVIEWING'])

export const TYPE_OPTIONS = [
  { value: 'All', label: 'All types' },
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'REMOTE', label: 'Remote' },
]

export const JOB_TYPE_OPTIONS = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'REMOTE', label: 'Remote' },
]
