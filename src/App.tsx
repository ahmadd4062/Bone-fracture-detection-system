import { Link, Route, Routes, useLocation } from 'react-router'
import Home from './pages/Home'
import Team from './pages/Team'

export default function App() {
  const location = useLocation()
  const isTeamPage = location.pathname === '/team'

  return (
    <>
      <nav
        className="font-mono-data"
        style={{
          position: 'fixed',
          top: '18px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px',
          background: 'rgba(0,0,0,0.72)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          backdropFilter: 'blur(18px)',
          boxShadow: '0 18px 60px rgba(0,0,0,0.32)',
        }}
        aria-label="Primary navigation"
      >
        <Link
          to="/"
          style={{
            color: !isTeamPage ? '#ffffff' : 'rgba(255,255,255,0.48)',
            textDecoration: 'none',
            fontSize: '0.68rem',
            letterSpacing: '0.08em',
            padding: '9px 13px',
            borderRadius: '6px',
            background: !isTeamPage ? 'rgba(255,255,255,0.1)' : 'transparent',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
          }}
        >
          Lab
        </Link>
        <Link
          to="/team"
          style={{
            color: isTeamPage ? '#ffffff' : 'rgba(255,255,255,0.48)',
            textDecoration: 'none',
            fontSize: '0.68rem',
            letterSpacing: '0.08em',
            padding: '9px 13px',
            borderRadius: '6px',
            background: isTeamPage ? 'rgba(255,255,255,0.1)' : 'transparent',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
          }}
        >
          Meet Team Amigos
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<Team />} />
      </Routes>
    </>
  )
}
