import { Facebook, Github, Linkedin, Mail, ScanFace, Sparkles, Users } from 'lucide-react'

type TeamMember = {
  name: string
  role: string
  accent: string
  image: string
  socials: {
    linkedin: string
    github: string
    facebook: string
    email: string
  }
}

const teamMembers: TeamMember[] = [
  {
    name: 'Azmir Zahid',
    role: 'Project Manager',
    accent: '#9cc9ff',
    image: '/images/team-azmir.jpg',
    socials: {
      linkedin: '#',
      github: '#',
      facebook: '#',
      email: 'mailto:azmir.zahid@example.com',
    },
  },
  {
    name: 'Ammar Arshad',
    role: 'AI Engineer',
    accent: '#e7f0ff',
    image: '/images/team-ammar.jpg',
    socials: {
      linkedin: 'https://www.linkedin.com/in/ammar-arshad2/',
      github: 'https://github.com/malikammar1046',
      facebook: 'https://www.facebook.com/malikammar1046',
      email: 'mailto:malikammar1046@gmail.com',
    },
  },
  {
    name: 'Ahmad Arshad',
    role: 'ML Engineer',
    accent: '#b9e3d6',
    image: '/images/team-ahmad.jpg',
    socials: {
      linkedin: '#',
      github: '#',
      facebook: '#',
      email: 'mailto:ahmad.arshad@example.com',
    },
  },
  {
    name: 'Hamza Ahmed',
    role: 'UI/UX Developer',
    accent: '#f5d28d',
    image: '/images/team-hamza.jpg',
    socials: {
      linkedin: '#',
      github: '#',
      facebook: '#',
      email: 'mailto:hamza.ahmed@example.com',
    },
  },
]

const socialItems = [
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { key: 'github', label: 'GitHub', icon: Github },
  { key: 'facebook', label: 'Facebook', icon: Facebook },
  { key: 'email', label: 'Email', icon: Mail },
] as const

export default function Team() {
  return (
    <main style={{ minHeight: '100vh', background: '#000000', color: '#ffffff', overflow: 'hidden' }}>
      <section
        style={{
          position: 'relative',
          minHeight: '72vh',
          display: 'flex',
          alignItems: 'center',
          padding: 'clamp(112px, 16vh, 160px) clamp(24px, 6vw, 80px) clamp(56px, 9vh, 96px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.52) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.52) 1px, transparent 1px)',
            backgroundSize: '58px 58px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 50% 12%, rgba(28,74,150,0.28), transparent 36%), linear-gradient(180deg, rgba(0,0,0,0.06), #000000 92%)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1180px', margin: '0 auto' }}>
          <div
            className="font-mono-data"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              color: 'rgba(255,255,255,0.42)',
              fontSize: '0.62rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: '26px',
            }}
          >
            <Sparkles size={14} />
            Team Amigos Branding
          </div>

          <h1
            className="font-geist-mono"
            style={{
              maxWidth: '920px',
              margin: 0,
              color: '#ffffff',
              fontSize: 'clamp(2.55rem, 8vw, 6.6rem)',
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: 0,
            }}
          >
            Meet Team Amigos
          </h1>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.2fr) minmax(240px, 0.8fr)',
              gap: 'clamp(28px, 7vw, 80px)',
              alignItems: 'end',
              marginTop: '34px',
            }}
            className="team-hero-grid"
          >
            <p
              style={{
                margin: 0,
                maxWidth: '680px',
                color: 'rgba(255,255,255,0.58)',
                fontSize: 'clamp(0.94rem, 1.4vw, 1.08rem)',
                lineHeight: 1.8,
              }}
            >
              The team behind the fracture detection lab combines project leadership, AI engineering, DevOps
              reliability, and product thinking to turn medical image processing concepts into a focused,
              usable learning system.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '10px',
              }}
            >
              {[
                { icon: Users, label: '4 Members' },
                { icon: ScanFace, label: 'DIP Focused' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="font-mono-data"
                  style={{
                    minHeight: '86px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.035)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '16px',
                    color: 'rgba(255,255,255,0.62)',
                    fontSize: '0.68rem',
                    letterSpacing: '0.08em',
                  }}
                >
                  <item.icon size={18} color="rgba(255,255,255,0.72)" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(54px, 9vh, 100px) clamp(24px, 6vw, 80px)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end',
              gap: '28px',
              flexWrap: 'wrap',
              marginBottom: '30px',
            }}
          >
            <div>
              <div
                className="font-mono-data"
                style={{
                  color: 'rgba(255,255,255,0.28)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                Team Introduction
              </div>
              <h2
                className="font-geist-mono"
                style={{
                  margin: 0,
                  fontSize: 'clamp(1.45rem, 3vw, 2.55rem)',
                  fontWeight: 500,
                  letterSpacing: 0,
                }}
              >
                Built with clear ownership and shared craft.
              </h2>
            </div>
            <p
              style={{
                maxWidth: '420px',
                margin: 0,
                color: 'rgba(255,255,255,0.46)',
                lineHeight: 1.7,
                fontSize: '0.92rem',
              }}
            >
              Each role supports a different layer of the product, from planning and AI workflows to delivery,
              infrastructure, and the final user experience.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(245px, 1fr))',
              gap: '18px',
            }}
          >
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="team-card"
                style={{
                  position: 'relative',
                  minHeight: '388px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.062), rgba(255,255,255,0.022))',
                  padding: '24px',
                  overflow: 'hidden',
                  transition: 'transform 0.24s ease, border-color 0.24s ease, background 0.24s ease',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: member.accent,
                    opacity: 0.85,
                  }}
                />

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    marginTop: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '136px',
                      height: '136px',
                      borderRadius: '50%',
                      padding: '5px',
                      border: '1px solid rgba(255,255,255,0.18)',
                      background: `linear-gradient(145deg, ${member.accent}, rgba(255,255,255,0.1) 44%, rgba(0,0,0,0.8))`,
                    }}
                  >
                    <img
                      src={member.image}
                      alt={`${member.name} profile`}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        display: 'block',
                        border: '1px solid rgba(0,0,0,0.46)',
                      }}
                    />
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <h3
                    className="font-geist-mono"
                    style={{
                      margin: '0 0 9px',
                      color: '#ffffff',
                      fontSize: '1.18rem',
                      fontWeight: 500,
                      letterSpacing: 0,
                    }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="font-mono-data"
                    style={{
                      margin: 0,
                      color: 'rgba(255,255,255,0.42)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {member.role}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '9px',
                    marginTop: '26px',
                    flexWrap: 'wrap',
                  }}
                >
                  {socialItems.map((item) => {
                    const Icon = item.icon
                    const href = member.socials[item.key]

                    return (
                      <a
                        key={item.key}
                        href={href}
                        aria-label={`${member.name} ${item.label}`}
                        title={item.label}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.12)',
                          background: 'rgba(255,255,255,0.045)',
                          color: 'rgba(255,255,255,0.68)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Icon size={16} />
                      </a>
                    )
                  })}
                </div>

                <a
                  className="font-mono-data contact-button"
                  href={member.socials.email}
                  style={{
                    width: '100%',
                    minHeight: '42px',
                    marginTop: '22px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.82)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '9px',
                    textDecoration: 'none',
                    fontSize: '0.68rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Mail size={15} />
                  Contact
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer
        className="font-mono-data"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '30px clamp(24px, 6vw, 80px)',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.34)',
          fontSize: '0.68rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        Developed by Team Amigos
      </footer>

      <style>{`
        .team-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,0.22) !important;
          background: linear-gradient(180deg, rgba(255,255,255,0.088), rgba(255,255,255,0.032)) !important;
        }

        .team-card a:hover {
          color: #ffffff !important;
          border-color: rgba(255,255,255,0.3) !important;
          background: rgba(255,255,255,0.12) !important;
        }

        @media (max-width: 760px) {
          .team-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  )
}
