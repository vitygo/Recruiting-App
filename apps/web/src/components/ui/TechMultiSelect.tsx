import { useState, useRef, useEffect } from 'react'
import { X, CaretDown } from '@phosphor-icons/react'
import styles from './TechMultiSelect.module.css'

interface Props {
  label?: string
  selected: string[]
  options: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
}

export function TechMultiSelect({
  label,
  selected,
  options,
  onChange,
  placeholder = 'Search technologies…',
}: Props) {
  const [search,  setSearch]  = useState('')
  const [isOpen,  setIsOpen]  = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef     = useRef<HTMLInputElement>(null)

  const filtered = options.filter(
    opt => opt.toLowerCase().includes(search.toLowerCase()) && !selected.includes(opt),
  )

  const add = (tech: string) => {
    onChange([...selected, tech])
    setSearch('')
    inputRef.current?.focus()
  }

  const remove = (tech: string) => {
    onChange(selected.filter(t => t !== tech))
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { setIsOpen(false); setSearch('') }
    if (e.key === 'Enter' && filtered.length > 0) { e.preventDefault(); add(filtered[0]) }
    if (e.key === 'Backspace' && search === '' && selected.length > 0) {
      remove(selected[selected.length - 1])
    }
  }

  return (
    <div className={styles.wrapper} ref={containerRef}>
      {label && (
        <div className={styles.label} id={`${label}-label`}>
          {label}
        </div>
      )}

      <div
        className={`${styles.control} ${isOpen ? styles.controlOpen : ''}`}
        onClick={() => { setIsOpen(true); inputRef.current?.focus() }}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={label ? `${label}-label` : undefined}
      >
        <div className={styles.tagsAndInput}>
          {selected.map(tech => (
            <span key={tech} className={styles.tag}>
              {tech}
              <button
                type="button"
                className={styles.tagRemove}
                onClick={e => { e.stopPropagation(); remove(tech) }}
                aria-label={`Remove ${tech}`}
              >
                <X size={10} weight="bold" aria-hidden="true" />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            className={styles.searchInput}
            value={search}
            onChange={e => { setSearch(e.target.value); setIsOpen(true) }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={selected.length === 0 ? placeholder : ''}
            aria-label={label || 'Select technologies'}
            aria-autocomplete="list"
          />
        </div>
        <CaretDown
          size={14}
          weight="bold"
          className={`${styles.caret} ${isOpen ? styles.caretOpen : ''}`}
          aria-hidden="true"
        />
      </div>

      {isOpen && filtered.length > 0 && (
        <div className={styles.dropdown} role="listbox" aria-label="Technology options">
          {filtered.map(tech => (
            <button
              key={tech}
              type="button"
              className={styles.option}
              role="option"
              aria-selected={false}
              onMouseDown={e => { e.preventDefault(); add(tech) }}
            >
              {tech}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
