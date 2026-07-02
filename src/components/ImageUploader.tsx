import { useState, useRef, useCallback } from 'react'
import { Upload, X, ImagePlus } from 'lucide-react'

interface ImageUploaderProps {
  onImageLoad: (file: File) => void
  hasImage: boolean
  onClear: () => void
  originalDataUrl: string | null
}

export default function ImageUploader({ onImageLoad, hasImage, onClear, originalDataUrl }: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) {
        onImageLoad(file)
      }
    },
    [onImageLoad],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onImageLoad(file)
      }
    },
    [onImageLoad],
  )

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div style={{ width: '100%' }}>
      {!hasImage ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          style={{
            border: `2px dashed ${isDragOver ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'}`,
            borderRadius: '8px',
            padding: 'clamp(48px, 8vh, 80px) clamp(24px, 4vw, 60px)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            background: isDragOver ? 'rgba(255,255,255,0.04)' : 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              transition: 'all 0.3s ease',
            }}
          >
            <Upload size={28} strokeWidth={1.2} style={{ color: 'rgba(255,255,255,0.5)' }} />
          </div>
          <div
            className="font-geist-mono"
            style={{
              fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.08em',
              marginBottom: '12px',
            }}
          >
            DRAG & DROP YOUR X-RAY IMAGE
          </div>
          <div
            style={{
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.04em',
              lineHeight: 1.6,
              maxWidth: '380px',
              margin: '0 auto',
            }}
          >
            Supports JPG, PNG, BMP, WebP
            <br />
            Grayscale X-ray images recommended for optimal fracture detection
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div
          style={{
            position: 'relative',
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '6px',
              overflow: 'hidden',
              maxWidth: 'min(400px, 80vw)',
              maxHeight: '400px',
            }}
          >
            {originalDataUrl && (
              <img
                src={originalDataUrl}
                alt="Original X-ray"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  maxHeight: '400px',
                  filter: 'grayscale(100%)',
                }}
              />
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={handleClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '4px',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                fontFamily: '"Geist Mono", monospace',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
              }}
            >
              <ImagePlus size={14} />
              NEW IMAGE
            </button>
            <button
              onClick={onClear}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                fontFamily: '"Geist Mono", monospace',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
            >
              <X size={14} />
              CLEAR
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
  )
}
