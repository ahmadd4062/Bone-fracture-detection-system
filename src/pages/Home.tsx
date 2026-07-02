import { useState, useCallback, useRef } from 'react'
import { processAll, fileToImageData, imageDataToDataURL, type AllResults } from '../lib/imageProcessing'
import { heroConfig, footerConfig } from '../config'
import ImageUploader from '../components/ImageUploader'
import ProcessCard from '../components/ProcessCard'
import CollapsibleSection from '../components/CollapsibleSection'
import { Activity, Bone, Scan, Microscope, Layers } from 'lucide-react'

export default function Home() {
  const [originalDataUrl, setOriginalDataUrl] = useState<string | null>(null)
  const [results, setResults] = useState<AllResults | null>(null)
  const [processing, setProcessing] = useState(false)
  const [heroVisible, setHeroVisible] = useState(true)
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleImageLoad = useCallback(async (file: File) => {
    setProcessing(true)
    try {
      const imageData = await fileToImageData(file)
      // Store original
      const origUrl = imageDataToDataURL(imageData)
      setOriginalDataUrl(origUrl)

      // Process all techniques
      const allResults = processAll(imageData)
      setResults(allResults)
      setHeroVisible(false)

      // Scroll to results after a brief delay
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    } catch (err) {
      console.error('Processing error:', err)
    } finally {
      setProcessing(false)
    }
  }, [])

  const handleClear = useCallback(() => {
    setOriginalDataUrl(null)
    setResults(null)
    setHeroVisible(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const hasFooter =
    !!footerConfig.brandText ||
    footerConfig.taglineLines.length > 0 ||
    footerConfig.navigationLinks.length > 0 ||
    footerConfig.contactLinks.length > 0 ||
    !!footerConfig.copyright

  return (
    <div style={{ minHeight: '100vh', background: '#000000' }}>
      {/* ─── Hero Section ─── */}
      <header
        style={{
          minHeight: heroVisible ? '100vh' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          padding: heroVisible
            ? 'clamp(40px, 8vh, 80px) clamp(24px, 6vw, 80px)'
            : 'clamp(32px, 5vh, 60px) clamp(24px, 6vw, 80px)',
          transition: 'all 0.6s ease',
          zIndex: 2,
          background: '#000000',
        }}
      >
        {/* Decorative grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '800px',
            width: '100%',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Eyebrow */}
          <div
            className="font-mono-data"
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: '24px',
              textTransform: 'uppercase',
            }}
          >
            {heroConfig.roomLabel}
          </div>

          {/* Title */}
          <h1
            className="font-geist-mono"
            style={{
              fontSize: 'clamp(2.4rem, 7vw, 5.5rem)',
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              margin: '0 0 28px 0',
              whiteSpace: 'pre-line',
            }}
          >
            {heroConfig.titleText}
          </h1>

          {/* Subtitle */}
          {heroVisible && (
            <div
              style={{
                fontSize: 'clamp(0.82rem, 1.1vw, 1rem)',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.45)',
                maxWidth: '560px',
                margin: '0 auto 40px',
                letterSpacing: '0.02em',
                transition: 'opacity 0.5s ease',
              }}
            >
              {heroConfig.subtitleLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < heroConfig.subtitleLines.length - 1 && <br />}
                </span>
              ))}
            </div>
          )}

          {/* Upload area */}
          <div
            style={{
              maxWidth: '520px',
              margin: '0 auto',
              transition: 'all 0.5s ease',
            }}
          >
            <ImageUploader
              onImageLoad={handleImageLoad}
              hasImage={!!originalDataUrl}
              onClear={handleClear}
              originalDataUrl={originalDataUrl}
            />
          </div>

          {/* Processing indicator */}
          {processing && (
            <div
              className="font-mono-data"
              style={{
                marginTop: '24px',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderTopColor: 'rgba(255,255,255,0.7)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              PROCESSING IMAGE...
            </div>
          )}
        </div>

        {/* Scroll hint */}
        {heroVisible && !originalDataUrl && (
          <div
            className="font-mono-data"
            style={{
              position: 'absolute',
              bottom: '32px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            Upload an image to begin
          </div>
        )}
      </header>

      {/* ─── Results Sections ─── */}
      {results && (
        <div ref={resultsRef} style={{ position: 'relative', zIndex: 2 }}>
          {/* Original image banner */}
          <div
            style={{
              background: 'rgba(255,255,255,0.015)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              padding: 'clamp(20px, 3vh, 32px) clamp(24px, 6vw, 80px)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            {originalDataUrl && (
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.12)',
                  flexShrink: 0,
                }}
              >
                <img
                  src={originalDataUrl}
                  alt="Original"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }}
                />
              </div>
            )}
            <div>
              <div
                className="font-geist-mono"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.7)',
                  letterSpacing: '0.06em',
                  marginBottom: '4px',
                }}
              >
                ORIGINAL X-RAY
              </div>
              <div
                className="font-mono-data"
                style={{
                  fontSize: '0.6rem',
                  color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.1em',
                }}
              >
                {results.pointProcessing.length} POINT OPS &nbsp;&middot;&nbsp; {results.neighborhoodFilters.length}{' '}
                FILTERS &nbsp;&middot;&nbsp; {results.edgeDetection.length} EDGE METHODS &nbsp;&middot;&nbsp;{' '}
                {results.morphologySegmentation.length} MORPHOLOGY OPS &nbsp;&middot;&nbsp;{' '}
                {results.fracturePipeline.length} PIPELINE STAGES
              </div>
            </div>
          </div>

          {/* Point Processing */}
          <div id="point-processing">
            <CollapsibleSection
              title="Point Processing"
              subtitle="Pixel-wise intensity transformations that enhance contrast, adjust brightness, and remap the tonal range to reveal fracture detail invisible to the naked eye."
              eyebrow="Category 01"
              defaultOpen={true}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '16px',
                }}
              >
                {results.pointProcessing.map((result, i) => (
                  <ProcessCard key={result.name} result={result} index={i} />
                ))}
              </div>
            </CollapsibleSection>
          </div>

          {/* Neighborhood Filters */}
          <div id="neighborhood-filters">
            <CollapsibleSection
              title="Neighborhood Filters"
              subtitle="Convolution-based spatial filters that smooth noise, sharpen edges, and extract gradient information using kernel operations across local pixel neighborhoods."
              eyebrow="Category 02"
              defaultOpen={true}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '16px',
                }}
              >
                {results.neighborhoodFilters.map((result, i) => (
                  <ProcessCard key={result.name} result={result} index={i} />
                ))}
              </div>
            </CollapsibleSection>
          </div>

          {/* Edge Detection */}
          <div id="edge-detection">
            <CollapsibleSection
              title="Edge Detection"
              subtitle="First and second-order derivative operators that identify intensity discontinuities in bone structure, the primary visual signature of fractures in X-ray imagery."
              eyebrow="Category 03"
              defaultOpen={true}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '16px',
                }}
              >
                {results.edgeDetection.map((result, i) => (
                  <ProcessCard key={result.name} result={result} index={i} />
                ))}
              </div>
            </CollapsibleSection>
          </div>

          {/* Morphology & Segmentation */}
          <div id="morphology-segmentation">
            <CollapsibleSection
              title="Morphology & Segmentation"
              subtitle="Binary and grayscale morphological operations that isolate bone regions, clean noise, and extract the topological skeleton for structural fracture pattern analysis."
              eyebrow="Category 04"
              defaultOpen={true}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '16px',
                }}
              >
                {results.morphologySegmentation.map((result, i) => (
                  <ProcessCard key={result.name} result={result} index={i} />
                ))}
              </div>
            </CollapsibleSection>
          </div>

          {/* Fracture Detection Pipeline */}
          <div id="fracture-pipeline">
            <CollapsibleSection
              title="Fracture Detection Pipeline"
              subtitle="An integrated multi-stage pipeline combining the most effective techniques: contrast enhancement, noise reduction, sharpening, edge detection, skeletonization, line detection, and final overlay."
              eyebrow="Category 05 // Integrated"
              defaultOpen={true}
              pipeline={true}
            >
              {/* Pipeline flow visualization */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '24px',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  overflowX: 'auto',
                  flexWrap: 'wrap',
                }}
              >
                {results.fracturePipeline.map((stage, i) => (
                  <div key={stage.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => scrollToSection(`pipeline-stage-${i}`)}
                      className="font-mono-data"
                      style={{
                        fontSize: '0.6rem',
                        letterSpacing: '0.08em',
                        color: 'rgba(255,255,255,0.5)',
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '3px',
                        padding: '4px 10px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(220,50,50,0.5)'
                        e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                        e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                      }}
                    >
                      {stage.name.split('.')[1]?.trim() || stage.name}
                    </button>
                    {i < results.fracturePipeline.length - 1 && (
                      <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.7rem' }}>&rarr;</span>
                    )}
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '20px',
                }}
              >
                {results.fracturePipeline.map((stage, i) => (
                  <div key={stage.name} id={`pipeline-stage-${i}`}>
                    <ProcessCard result={stage} index={i} isPipeline={true} />
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          </div>
        </div>
      )}

      {/* ─── Navigation Sidebar (visible when results exist) ─── */}
      {results && (
        <nav
          style={{
            position: 'fixed',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {[
            { id: 'point-processing', icon: Activity, label: 'PP' },
            { id: 'neighborhood-filters', icon: Layers, label: 'NF' },
            { id: 'edge-detection', icon: Scan, label: 'ED' },
            { id: 'morphology-segmentation', icon: Microscope, label: 'MS' },
            { id: 'fracture-pipeline', icon: Bone, label: 'FD' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              title={item.id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              }}
            >
              <item.icon size={14} color="rgba(255,255,255,0.5)" />
            </button>
          ))}
        </nav>
      )}

      {/* ─── Footer ─── */}
      {hasFooter && (
        <footer
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            background: '#000000',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: 'clamp(48px, 8vh, 100px) clamp(24px, 6vw, 80px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '48px',
              maxWidth: '1400px',
              margin: '0 auto',
            }}
          >
            <div style={{ maxWidth: '400px' }}>
              {footerConfig.brandText && (
                <div
                  className="font-geist-mono"
                  style={{
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                    fontWeight: 500,
                    color: '#ffffff',
                    marginBottom: '16px',
                    letterSpacing: '0.02em',
                  }}
                >
                  {footerConfig.brandText}
                </div>
              )}
              {footerConfig.taglineLines.length > 0 && (
                <div
                  className="font-mono-data"
                  style={{
                    fontSize: '0.65rem',
                    color: 'rgba(255,255,255,0.3)',
                    lineHeight: 1.8,
                    letterSpacing: '0.08em',
                  }}
                >
                  {footerConfig.taglineLines.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
            </div>

            {(footerConfig.navigationLinks.length > 0 || footerConfig.contactLinks.length > 0) && (
              <div
                style={{
                  display: 'flex',
                  gap: 'clamp(32px, 6vw, 80px)',
                  flexWrap: 'wrap',
                }}
              >
                {footerConfig.navigationLinks.length > 0 && (
                  <div>
                    {footerConfig.navigationHeading && (
                      <div
                        className="font-mono-data"
                        style={{
                          fontSize: '0.6rem',
                          color: 'rgba(255,255,255,0.25)',
                          letterSpacing: '0.2em',
                          marginBottom: '16px',
                        }}
                      >
                        {footerConfig.navigationHeading}
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {footerConfig.navigationLinks.map((link) => (
                        <button
                          key={link.label}
                          onClick={() => scrollToSection(link.label.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '').replace(/--+/g, '-').replace(/-$/, ''))}
                          style={{
                            fontSize: '0.8rem',
                            color: 'rgba(255,255,255,0.45)',
                            letterSpacing: '0.06em',
                            fontWeight: 300,
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            textAlign: 'left',
                            transition: 'color 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
                          }}
                        >
                          {link.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {footerConfig.contactLinks.length > 0 && (
                  <div>
                    {footerConfig.contactHeading && (
                      <div
                        className="font-mono-data"
                        style={{
                          fontSize: '0.6rem',
                          color: 'rgba(255,255,255,0.25)',
                          letterSpacing: '0.2em',
                          marginBottom: '16px',
                        }}
                      >
                        {footerConfig.contactHeading}
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {footerConfig.contactLinks.map((link) => (
                        <span
                          key={link.label}
                          className="font-mono-data"
                          style={{
                            fontSize: '0.7rem',
                            color: 'rgba(255,255,255,0.35)',
                            letterSpacing: '0.06em',
                          }}
                        >
                          {link.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {(footerConfig.copyright || footerConfig.creditText) && (
            <div
              style={{
                marginTop: 'clamp(40px, 6vh, 64px)',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                maxWidth: '1400px',
                margin: 'clamp(40px, 6vh, 64px) auto 0',
              }}
            >
              {footerConfig.copyright && (
                <div
                  className="font-mono-data"
                  style={{
                    fontSize: '0.6rem',
                    color: 'rgba(255,255,255,0.2)',
                    letterSpacing: '0.12em',
                  }}
                >
                  {footerConfig.copyright}
                </div>
              )}
              {footerConfig.creditText && (
                <div
                  className="font-mono-data"
                  style={{
                    fontSize: '0.6rem',
                    color: 'rgba(255,255,255,0.15)',
                    letterSpacing: '0.12em',
                  }}
                >
                  {footerConfig.creditText}
                </div>
              )}
            </div>
          )}
        </footer>
      )}

      {/* Global styles */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
