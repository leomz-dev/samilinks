import { useState, useEffect, useRef } from 'react'
import avatarSami from './assets/avatarsami.png'
import './App.css'

const SURPRISE_URL = 'https://aae-two.vercel.app/'
const CORRECT_ANSWER = 7
const FLOAT_SIZE = 52
const FLOAT_SPEED = 2.2
const EDGE_PADDING = 8

let safeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 }

function readSafeAreaInsets() {
  const probe = document.createElement('div')
  probe.style.cssText = `
    position: fixed;
    visibility: hidden;
    pointer-events: none;
    padding-top: env(safe-area-inset-top, 0px);
    padding-right: env(safe-area-inset-right, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    padding-left: env(safe-area-inset-left, 0px);
  `
  document.body.appendChild(probe)
  const style = getComputedStyle(probe)
  safeAreaInsets = {
    top: parseFloat(style.paddingTop) || 0,
    right: parseFloat(style.paddingRight) || 0,
    bottom: parseFloat(style.paddingBottom) || 0,
    left: parseFloat(style.paddingLeft) || 0,
  }
  document.body.removeChild(probe)
}

function getBounceBounds() {
  const viewport = window.visualViewport
  const offsetX = viewport?.offsetLeft ?? 0
  const offsetY = viewport?.offsetTop ?? 0
  const width = viewport?.width ?? window.innerWidth
  const height = viewport?.height ?? window.innerHeight

  const minX = offsetX + safeAreaInsets.left + EDGE_PADDING
  const minY = offsetY + safeAreaInsets.top + EDGE_PADDING
  const maxX = Math.max(minX, offsetX + width - FLOAT_SIZE - safeAreaInsets.right - EDGE_PADDING)
  const maxY = Math.max(minY, offsetY + height - FLOAT_SIZE - safeAreaInsets.bottom - EDGE_PADDING)

  return { minX, minY, maxX, maxY }
}

function clampPosition(pos) {
  const { minX, minY, maxX, maxY } = getBounceBounds()
  return {
    x: Math.min(maxX, Math.max(minX, pos.x)),
    y: Math.min(maxY, Math.max(minY, pos.y)),
  }
}

function randomPosition() {
  const { minX, minY, maxX, maxY } = getBounceBounds()
  return {
    x: minX + Math.random() * Math.max(0, maxX - minX),
    y: minY + Math.random() * Math.max(0, maxY - minY),
  }
}

function useDvdBounce(paused) {
  const [pos, setPos] = useState({ x: 80, y: 80 })
  const posRef = useRef({ x: 80, y: 80 })
  const velRef = useRef({ x: FLOAT_SPEED, y: FLOAT_SPEED * 0.85 })

  useEffect(() => {
    if (paused) return

    readSafeAreaInsets()
    posRef.current = randomPosition()
    setPos({ ...posRef.current })

    let frameId

    const tick = () => {
      const { minX, minY, maxX, maxY } = getBounceBounds()
      let { x, y } = posRef.current
      let { x: vx, y: vy } = velRef.current

      x += vx
      y += vy

      if (x <= minX) { x = minX; vx = Math.abs(vx) }
      else if (x >= maxX) { x = maxX; vx = -Math.abs(vx) }

      if (y <= minY) { y = minY; vy = Math.abs(vy) }
      else if (y >= maxY) { y = maxY; vy = -Math.abs(vy) }

      posRef.current = { x, y }
      velRef.current = { x: vx, y: vy }
      setPos({ x, y })
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)

    const handleViewportChange = () => {
      readSafeAreaInsets()
      posRef.current = clampPosition(posRef.current)
      setPos({ ...posRef.current })
    }

    window.addEventListener('resize', handleViewportChange)
    window.visualViewport?.addEventListener('resize', handleViewportChange)
    window.visualViewport?.addEventListener('scroll', handleViewportChange)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleViewportChange)
      window.visualViewport?.removeEventListener('resize', handleViewportChange)
      window.visualViewport?.removeEventListener('scroll', handleViewportChange)
    }
  }, [paused])

  return pos
}

function App() {
  const [showSurprise, setShowSurprise] = useState(false)
  const [monthsAnswer, setMonthsAnswer] = useState('')
  const [surpriseError, setSurpriseError] = useState('')
  const floatPos = useDvdBounce(showSurprise)

  const openSurprise = () => {
    setShowSurprise(true)
    setMonthsAnswer('')
    setSurpriseError('')
  }

  const handleSurpriseSubmit = (e) => {
    e.preventDefault()
    const trimmed = monthsAnswer.trim()

    if (!/^\d+$/.test(trimmed)) {
      setSurpriseError('Escribe solo el número')
      return
    }

    if (Number(trimmed) !== CORRECT_ANSWER) {
      setSurpriseError('Esa no es la respuesta correcta')
      return
    }

    window.location.href = SURPRISE_URL
  }

  const links = [
    { title: 'Pre-Ingles', url: 'https://platform.edu21-improve.com/planning', icon: '📚', color: 'var(--accent-purple)' },
    { title: 'Jóvenes Creativos', url: 'https://jovenes.tocaunavida.org/', icon: '🎨', color: 'var(--accent-pink)' },
    { title: 'Inglés', url: 'https://site3.q10.com/login?ReturnUrl=%2F&aplentId=6a3e4ee0-f9d7-4715-9c11-3e01e2fa932d', icon: '🌎', color: 'var(--accent-cyan)' },
    { title: 'Libro Ingles', url: 'https://learn.eltngl.com/dashboard/courses', icon: '📘', color: 'var(--accent-blue)' },
    { title: 'Sian', url: 'https://sian365.com.co/', icon: '📖', color: 'var(--accent-green)' },
  ];

  return (
    <div className="app-container bg-white">
      <main className="glass-card main-content">
        <header className="header">
          <div className="avatar-container">
            <img
              src={avatarSami}
              alt="Sami"
              className="avatar"
            />
          </div>
          <h1 className="title">
            <span className="greeting">Hola Sami,</span>
            <span className="question">¿A dónde vas ahora?</span>
          </h1>
        </header>

        <div className="links-container">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="link-btn"
              style={{ '--hover-color': link.color }}
            >
              <span className="link-icon">{link.icon}</span>
              <span className="link-title">{link.title}</span>
              <span className="link-arrow">→</span>
            </a>
          ))}
        </div>
      </main>

      <button
        type="button"
        className="surprise-float"
        style={{ left: floatPos.x, top: floatPos.y }}
        onClick={openSurprise}
        aria-label="Sorpresa"
      >
        🎁
      </button>

      {showSurprise && (
        <div className="surprise-overlay" onClick={() => setShowSurprise(false)}>
            <form
              className="surprise-modal"
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSurpriseSubmit}
            >
              <label className="surprise-label" htmlFor="months-answer">
                ¿Cuántos meses cumplimos hoy?
              </label>
              <input
                id="months-answer"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="surprise-input"
                value={monthsAnswer}
                onChange={(e) => {
                  setMonthsAnswer(e.target.value)
                  setSurpriseError('')
                }}
                placeholder="Solo el número"
                autoFocus
              />
              {surpriseError && <p className="surprise-error">{surpriseError}</p>}
              <div className="surprise-actions">
                <button type="button" className="surprise-cancel" onClick={() => setShowSurprise(false)}>
                  Cancelar
                </button>
                <button type="submit" className="surprise-confirm">
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        )}
    </div>
  )
}

export default App
