"use client";

import { useMemo, useState } from 'react'
import { ArrowDown, ArrowDownUp, ArrowLeft, ArrowRight, Check, ChevronDown, ChevronRight, Download, Search, SlidersHorizontal, UsersRound, X } from 'lucide-react'
import { formatDate, matchesPeriod, type Buyer, type LeadStatus } from '@/lib/data'
import { useApp } from '@/lib/store'
import { Avatar, Code, EmptyState, StatusBadge } from './Ui'

interface Props {
  onSelect: (buyer: Buyer) => void
  query: string
  onQueryChange: (value: string) => void
  initialStatus?: LeadStatus | 'all'
  period: string
}

export default function BuyerTable({ onSelect, query, onQueryChange, initialStatus = 'all', period }: Props) {
  const { buyers, exportBuyers } = useApp()
  const [status, setStatus] = useState<LeadStatus | 'all'>(initialStatus)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [withCode, setWithCode] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  const filtered = useMemo(() => buyers.filter(buyer => {
    const textMatches = !query || `${buyer.name} ${buyer.email} ${buyer.phone} ${buyer.referredBy ?? ''}`.toLowerCase().includes(query.toLowerCase())
    const statusMatches = status === 'all' || buyer.status === status
    const dateMatches = matchesPeriod(buyer, period)
    return textMatches && statusMatches && dateMatches && (!withCode || !!buyer.referredBy)
  }).sort((a, b) => sort === 'newest' ? +new Date(b.date) - +new Date(a.date) : +new Date(a.date) - +new Date(b.date)), [buyers, query, status, sort, withCode, period])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const allSelected = visible.length > 0 && visible.every(buyer => selected.includes(buyer.id))
  const tabs: { value: LeadStatus | 'all'; label: string; short: string }[] = [{ value: 'all', label: 'All buyers', short: 'All' }, { value: 'verified', label: 'Payment verified', short: 'Verified' }, { value: 'pending', label: 'Pending payment', short: 'Pending' }, { value: 'registered', label: 'Registered', short: 'Registered' }]

  function resetFilters() { setStatus('all'); setWithCode(false); onQueryChange(''); setPage(1) }
  function toggleSelected(id: string) { setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]) }
  function toggleAll() { setSelected(current => allSelected ? current.filter(id => !visible.some(buyer => buyer.id === id)) : [...new Set([...current, ...visible.map(buyer => buyer.id)])]) }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1).filter(num => num === 1 || num === totalPages || Math.abs(currentPage - num) <= 1)

  return <section className="lead-table-card" aria-labelledby="buyers-heading">
    <div className="table-title-row"><div><div className="section-title-line"><h2 id="buyers-heading">Registered buyers</h2><span className="count-pill">{buyers.length} total</span></div><p>A closer look at your community and the connections behind it.</p></div><span className="live-label"><span />Live updates</span></div>
    <div className="table-toolbar"><div className="table-tabs" role="tablist" aria-label="Filter by payment status">{tabs.map(tab => <button key={tab.value} role="tab" aria-selected={status === tab.value} className={`table-tab ${status === tab.value ? 'table-tab-active' : ''}`} onClick={() => { setStatus(tab.value); setPage(1); setSelected([]) }}><span className="tab-full-label">{tab.label}</span><span className="tab-short-label">{tab.short}</span><span>{tab.value === 'all' ? buyers.length : buyers.filter(buyer => buyer.status === tab.value).length}</span></button>)}</div><div className="table-tools">{selected.length > 0 ? <><button className="button button-small button-light" onClick={() => exportBuyers(buyers.filter(buyer => selected.includes(buyer.id)))}><Download size={14} />Export {selected.length} selected</button><button className="icon-button" aria-label="Clear selection" onClick={() => setSelected([])}><X size={15} /></button></> : <><label className="table-search"><Search size={16} /><input aria-label="Search buyers" placeholder="Search buyers..." value={query} onChange={event => { onQueryChange(event.target.value); setPage(1) }} />{query && <button aria-label="Clear search" onClick={() => onQueryChange('')}><X size={13} /></button>}</label><div className="filter-container"><button className={`button button-small button-white filter-trigger ${withCode ? 'has-filter' : ''}`} onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen}><SlidersHorizontal size={15} />Filters{withCode && <span className="filter-count">1</span>}</button>{filtersOpen && <><div className="popover-scrim" onClick={() => setFiltersOpen(false)} /><div className="filter-popover"><div className="popover-heading">Filter buyers<button className="icon-button" aria-label="Close filters" onClick={() => setFiltersOpen(false)}><X size={15} /></button></div><label className="check-label"><input type="checkbox" checked={withCode} onChange={event => { setWithCode(event.target.checked); setPage(1) }} />Has a referral code</label><label className="field-label" htmlFor="sort-buyers">Registration date</label><select id="sort-buyers" value={sort} onChange={event => { setSort(event.target.value as 'newest' | 'oldest'); setPage(1) }}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select><div className="filter-actions"><button className="text-button" onClick={resetFilters}>Reset</button><button className="button button-primary button-small" onClick={() => setFiltersOpen(false)}><Check size={14} />Done</button></div></div></>}</div></>}</div></div>
    <div className="table-scroll"><table className="leads-table"><thead><tr><th className="checkbox-cell"><input type="checkbox" aria-label="Select all buyers on this page" checked={allSelected} onChange={toggleAll} /></th><th>User name</th><th>Email address</th><th>Phone</th><th>Referral code used</th><th><button className="th-sort" onClick={() => { setSort(sort === 'newest' ? 'oldest' : 'newest'); setPage(1) }}>Date registered{sort === 'newest' ? <ArrowDown size={12} /> : <ArrowDownUp size={12} />}</button></th><th>Status</th><th aria-label="View details" /></tr></thead><tbody>{visible.map(buyer => <tr key={buyer.id} className={selected.includes(buyer.id) ? 'row-selected' : ''} tabIndex={0} onClick={() => onSelect(buyer)} onKeyDown={event => { if (event.key === 'Enter' && event.target === event.currentTarget) onSelect(buyer) }} aria-label={`View ${buyer.name}'s details`}><td className="checkbox-cell" onClick={event => event.stopPropagation()}><input type="checkbox" aria-label={`Select ${buyer.name}`} checked={selected.includes(buyer.id)} onChange={() => toggleSelected(buyer.id)} /></td><td><div className="user-cell"><Avatar lead={buyer} size="small" /><span>{buyer.name}</span></div></td><td className="email-cell">{buyer.email}</td><td>{buyer.phone}</td><td>{buyer.referredBy ? <Code muted>{buyer.referredBy}</Code> : <span className="no-referral">— <span>Direct signup</span></span>}</td><td className="date-cell">{formatDate(buyer.date)}</td><td><StatusBadge status={buyer.status} /></td><td className="row-arrow"><ChevronRight size={16} /></td></tr>)}</tbody></table>{visible.length === 0 && <EmptyState onReset={resetFilters} />}</div>
    <div className="table-footer"><div className="table-result-count">Showing <strong>{filtered.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> buyers</div><div className="pagination"><button className="page-arrow" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ArrowLeft size={15} /><span>Previous</span></button><div className="page-numbers">{pageNumbers.map((num, index) => <span key={num}>{index > 0 && num - pageNumbers[index - 1] > 1 && <span className="pagination-ellipsis">…</span>}<button aria-label={`Page ${num}`} aria-current={currentPage === num ? 'page' : undefined} className={`page-number ${currentPage === num ? 'page-current' : ''}`} onClick={() => setPage(num)}>{num}</button></span>)}</div><button className="page-arrow" aria-label="Next page" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}><span>Next</span><ArrowRight size={15} /></button></div><label className="page-size-label"><span>Rows per page</span><select aria-label="Rows per page" value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setPage(1) }}><option value={6}>6</option><option value={12}>12</option><option value={24}>24</option></select><ChevronDown size={12} /></label></div>
    <div className="table-hint"><UsersRound size={13} /><span>Select a buyer to verify payments.</span></div>
  </section>
}
