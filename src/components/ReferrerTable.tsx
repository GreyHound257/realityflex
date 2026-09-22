"use client";

import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Download, Search, X } from 'lucide-react'
import { type Referrer } from '@/lib/data'
import { useApp } from '@/lib/store'
import { Code, EmptyState } from './Ui'

interface Props {
  query: string
  onQueryChange: (value: string) => void
}

export default function ReferrerTable({ query, onQueryChange }: Props) {
  const { referrers, buyers, exportReferrers } = useApp()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [selected, setSelected] = useState<string[]>([])

  const filtered = useMemo(() => referrers.filter(referrer => {
    return !query || `${referrer.name} ${referrer.email} ${referrer.phone} ${referrer.code}`.toLowerCase().includes(query.toLowerCase())
  }), [referrers, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const allSelected = visible.length > 0 && visible.every(referrer => selected.includes(referrer.id))

  function toggleSelected(id: string) { setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]) }
  function toggleAll() { setSelected(current => allSelected ? current.filter(id => !visible.some(referrer => referrer.id === id)) : [...new Set([...current, ...visible.map(referrer => referrer.id)])]) }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1).filter(num => num === 1 || num === totalPages || Math.abs(currentPage - num) <= 1)

  return <section className="lead-table-card" aria-labelledby="referrers-heading">
    <div className="table-title-row"><div><div className="section-title-line"><h2 id="referrers-heading">Registered referrers</h2><span className="count-pill">{referrers.length} total</span></div><p>The advocates building your community.</p></div></div>
    <div className="table-toolbar">
      <div className="table-tools" style={{marginLeft: 'auto'}}>
        {selected.length > 0 ? (
          <>
            <button className="button button-small button-light" onClick={() => exportReferrers(referrers.filter(referrer => selected.includes(referrer.id)))}><Download size={14} />Export {selected.length} selected</button>
            <button className="icon-button" aria-label="Clear selection" onClick={() => setSelected([])}><X size={15} /></button>
          </>
        ) : (
          <label className="table-search">
            <Search size={16} />
            <input aria-label="Search referrers" placeholder="Search referrers..." value={query} onChange={event => { onQueryChange(event.target.value); setPage(1) }} />
            {query && <button aria-label="Clear search" onClick={() => onQueryChange('')}><X size={13} /></button>}
          </label>
        )}
      </div>
    </div>
    <div className="table-scroll">
      <table className="leads-table">
        <thead>
          <tr>
            <th className="checkbox-cell"><input type="checkbox" aria-label="Select all referrers on this page" checked={allSelected} onChange={toggleAll} /></th>
            <th>Name</th>
            <th>Email address</th>
            <th>Phone</th>
            <th>Referral code</th>
            <th>Buyers Using Code</th>
          </tr>
        </thead>
        <tbody>
          {visible.map(referrer => {
            const buyersCount = buyers.filter(b => b.referredBy === referrer.code).length;
            return (
              <tr key={referrer.id} className={selected.includes(referrer.id) ? 'row-selected' : ''}>
                <td className="checkbox-cell"><input type="checkbox" aria-label={`Select ${referrer.name}`} checked={selected.includes(referrer.id)} onChange={() => toggleSelected(referrer.id)} /></td>
                <td><strong>{referrer.name}</strong></td>
                <td className="email-cell">{referrer.email}</td>
                <td>{referrer.phone}</td>
                <td><Code>{referrer.code}</Code></td>
                <td>{buyersCount}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {visible.length === 0 && <EmptyState onReset={() => onQueryChange('')} />}
    </div>
    <div className="table-footer">
      <div className="table-result-count">Showing <strong>{filtered.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> referrers</div>
      <div className="pagination">
        <button className="page-arrow" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ArrowLeft size={15} /><span>Previous</span></button>
        <div className="page-numbers">{pageNumbers.map((num, index) => <span key={num}>{index > 0 && num - pageNumbers[index - 1] > 1 && <span className="pagination-ellipsis">…</span>}<button aria-label={`Page ${num}`} aria-current={currentPage === num ? 'page' : undefined} className={`page-number ${currentPage === num ? 'page-current' : ''}`} onClick={() => setPage(num)}>{num}</button></span>)}</div>
        <button className="page-arrow" aria-label="Next page" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}><span>Next</span><ArrowRight size={15} /></button>
      </div>
      <label className="page-size-label"><span>Rows per page</span><select aria-label="Rows per page" value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setPage(1) }}><option value={6}>6</option><option value={12}>12</option><option value={24}>24</option></select><ChevronDown size={12} /></label>
    </div>
  </section>
}
