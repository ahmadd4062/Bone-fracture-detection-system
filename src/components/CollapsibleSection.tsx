import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface CollapsibleSectionProps {
  title: string
  subtitle: string
  eyebrow: string
  children: ReactNode
  defaultOpen?: boolean
  pipeline?: boolean
}

export default function CollapsibleSection({
  title,
  subtitle,
  eyebrow,
  children,
  defaultOpen = false,
  pipeline = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <section
      style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        zIndex: 2,
        background: '#000000',
      }}
    >
      {/* Section Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: 'clamp(24px, 4vh, 40px) clamp(24px, 6vw, 80px)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.015)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        <div style={{ flex: 1 }}>
          {eyebrow && (
            <div
              className="font-mono-data"
              style={{
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.2em',
                marginBottom: '12px',
                textTransform: 'uppercase',
              }}
            >
              {eyebrow}
            </div>
          )}
          <h2
            className="font-geist-mono"
            style={{
              fontSize: 'clamp(1.4rem, 3vw, 2.4rem)',
              fontWeight: 500,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: '0 0 10px 0',
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.5,
              maxWidth: '600px',
              margin: 0,
              letterSpacing: '0.02em',
            }}
          >
            {subtitle}
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0,
            marginLeft: '24px',
            marginTop: '8px',
          }}
        >
          {pipeline && (
            <span
              className="font-mono-data"
              style={{
                fontSize: '0.55rem',
                color: 'rgba(220,50,50,0.7)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              7 Stages
            </span>
          )}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <ChevronDown size={14} color="rgba(255,255,255,0.5)" />
          </div>
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        style={{
          maxHeight: isOpen ? '5000px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          style={{
            padding: '0 clamp(24px, 6vw, 80px) clamp(40px, 6vh, 64px)',
          }}
        >
          {children}
        </div>
      </div>
    </section>
  )
}
