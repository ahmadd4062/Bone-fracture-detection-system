import { useState, useRef, useEffect } from 'react'
import { imageDataToDataURL, type ProcessResult, type PipelineStage } from '../lib/imageProcessing'
import { Maximize2, X } from 'lucide-react'

interface ProcessCardProps {
  result: ProcessResult | PipelineStage
  index: number
  isPipeline?: boolean
}

export default function ProcessCard({ result, index, isPipeline = false }: ProcessCardProps) {
  const [dataUrl, setDataUrl] = useState<string>('')
  const [expanded, setExpanded] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const url = imageDataToDataURL(result.imageData)
    setDataUrl(url)
    // Staggered fade-in
    const timer = setTimeout(() => setLoaded(true), index * 80)
    return () => clearTimeout(timer)
  }, [result, index])

  const handleExpand = () => setExpanded(true)
  const handleClose = () => setExpanded(false)

  const name = 'name' in result ? result.name : ''
  const description = 'description' in result ? result.description : ''
  const stageNum = isPipeline ? name.split('.')[0] : null

  return (
    <>
      <div
        ref={cardRef}
        style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '6px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.035)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
        }}
      >
        {/* Image container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1',
            background: '#080808',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
          onClick={handleExpand}
        >
          {dataUrl && (
            <img
              src={dataUrl}
              alt={name}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                imageRendering: 'auto',
              }}
            />
          )}
          {/* Expand button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleExpand()
            }}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '28px',
              height: '28px',
              borderRadius: '4px',
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: 0,
              transition: 'opacity 0.2s ease',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            <Maximize2 size={12} color="rgba(255,255,255,0.7)" />
          </button>
          {/* Stage number badge */}
          {isPipeline && stageNum && (
            <div
              className="font-geist-mono"
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                padding: '4px 10px',
                background: 'rgba(220,50,50,0.85)',
                borderRadius: '3px',
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                color: '#fff',
                fontWeight: 600,
              }}
            >
              STAGE {stageNum}
            </div>
          )}
        </div>

        {/* Text content */}
        <div
          style={{
            padding: '16px 14px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <h3
            className="font-geist-mono"
            style={{
              fontSize: 'clamp(0.72rem, 1vw, 0.85rem)',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: '0.03em',
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            {name}
          </h3>
          <p
            style={{
              fontSize: '0.72rem',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.4)',
              margin: 0,
              letterSpacing: '0.01em',
            }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Expanded modal */}
      {expanded && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(20px, 5vw, 60px)',
            cursor: 'pointer',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              cursor: 'default',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3
                className="font-geist-mono"
                style={{
                  fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.9)',
                  letterSpacing: '0.04em',
                  margin: 0,
                }}
              >
                {name}
              </h3>
              <button
                onClick={handleClose}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '4px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <X size={16} color="rgba(255,255,255,0.7)" />
              </button>
            </div>
            <div
              style={{
                flex: 1,
                background: '#080808',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxHeight: '70vh',
              }}
            >
              {dataUrl && (
                <img
                  src={dataUrl}
                  alt={name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '70vh',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              )}
            </div>
            <p
              style={{
                fontSize: '0.8rem',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.45)',
                margin: 0,
              }}
            >
              {description}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
