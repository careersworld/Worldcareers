'use client'

import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react'
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Space, CornerDownLeft } from 'lucide-react'

export interface RichTextHandle {
  getHTML: () => string
  setHTML: (html: string) => void
}

const RichText = forwardRef<RichTextHandle, { initial?: string; placeholder?: string }>(function RichText({ initial, placeholder = 'Start typing...' }, ref) {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const [isEmpty, setIsEmpty] = useState(!initial)
  const [lineHeight, setLineHeight] = useState('1.5')
  const isInitialized = useRef(false)

  useEffect(() => {
    // Only set initial content once
    if (editorRef.current && initial && !isInitialized.current) {
      editorRef.current.innerHTML = initial
      setIsEmpty(false)
      isInitialized.current = true
    }
  }, [initial])

  useImperativeHandle(ref, () => ({
    getHTML: () => {
      if (!editorRef.current) return ''
      const html = editorRef.current.innerHTML
      // Return empty string if only contains placeholder tags
      if (html === '<br>' || html === '<div><br></div>' || html.trim() === '') return ''
      return html
    },
    setHTML: (html: string) => {
      if (editorRef.current) {
        editorRef.current.innerHTML = html
        setIsEmpty(!html || html === '<br>')
      }
    },
  }))

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const insertLink = () => {
    const url = prompt('Enter URL')
    if (url) exec('createLink', url)
  }

  const insertLineBreak = () => {
    exec('insertHTML', '<br><br>')
  }

  const changeLineHeight = (height: string) => {
    setLineHeight(height)
    if (editorRef.current) {
      editorRef.current.style.lineHeight = height
    }
  }

  const handleInput = () => {
    if (!editorRef.current) return
    const content = editorRef.current.innerHTML
    setIsEmpty(!content || content === '<br>' || content === '<div><br></div>' || content.trim() === '')
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-1 items-center p-2 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
        <button 
          type="button" 
          className="p-2 rounded hover:bg-gray-200 transition-colors" 
          onClick={() => exec('bold')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button 
          type="button" 
          className="p-2 rounded hover:bg-gray-200 transition-colors" 
          onClick={() => exec('italic')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button 
          type="button" 
          className="p-2 rounded hover:bg-gray-200 transition-colors" 
          onClick={() => exec('underline')}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button 
          type="button" 
          className="p-2 rounded hover:bg-gray-200 transition-colors" 
          onClick={() => exec('insertUnorderedList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button 
          type="button" 
          className="p-2 rounded hover:bg-gray-200 transition-colors" 
          onClick={() => exec('insertOrderedList')}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button 
          type="button" 
          className="p-2 rounded hover:bg-gray-200 transition-colors" 
          onClick={insertLink}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button 
          type="button" 
          className="p-2 rounded hover:bg-gray-200 transition-colors" 
          onClick={insertLineBreak}
          title="Line Break"
        >
          <CornerDownLeft className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <div className="flex items-center gap-2">
          <Space className="w-4 h-4 text-gray-600" />
          <select 
            value={lineHeight}
            onChange={(e) => changeLineHeight(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            title="Line Spacing"
          >
            <option value="1">1.0</option>
            <option value="1.15">1.15</option>
            <option value="1.5">1.5</option>
            <option value="2">2.0</option>
            <option value="2.5">2.5</option>
            <option value="3">3.0</option>
          </select>
        </div>
      </div>
      <div className="relative">
        {isEmpty && (
          <div className="absolute top-4 left-4 text-gray-400 pointer-events-none select-none">
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          suppressHydrationWarning
          onInput={handleInput}
          onPaste={handlePaste}
          style={{ lineHeight }}
          className="min-h-[300px] p-4 border-2 border-gray-200 rounded-lg prose prose-sm max-w-none bg-white focus:outline-none focus:border-[#D4AF37] transition-colors"
        />
      </div>
    </div>
  )
})

export default RichText
