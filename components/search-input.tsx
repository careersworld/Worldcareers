'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

interface SearchInputProps {
  onSearch?: (jobTitle: string, location: string) => void
  variant?: 'hero' | 'default'
}

export function SearchInput({ onSearch, variant = 'default' }: SearchInputProps) {
  const [jobTitle, setJobTitle] = useState('')
  const [location, setLocation] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(jobTitle, location)
    }
  }

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="flex items-center bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <input
            type="text"
            placeholder="Job title or keyword"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="flex-1 px-4 py-3 bg-white focus:outline-none"
          />
          <div className="w-px h-6 bg-gray-300" />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 px-4 py-3 bg-white focus:outline-none"
          />
          <button 
            type="submit" 
            className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white transition-colors flex items-center gap-2 font-medium"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <input
          type="text"
          placeholder="Job title or keyword"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="flex-1 px-4 py-2 bg-white focus:outline-none text-sm min-w-0"
        />
        <div className="w-px h-6 bg-gray-300" />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 px-4 py-2 bg-white focus:outline-none text-sm min-w-0"
        />
        <button 
          type="submit" 
          className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white transition-colors flex items-center gap-2 text-sm font-medium shrink-0"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>
    </form>
  )
}
