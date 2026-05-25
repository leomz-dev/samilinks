import { useState } from 'react'
import avatarSami from './assets/avatarsami.png'
import './App.css'

function App() {
  const links = [
    { title: 'Pre-Ingles', url: 'https://platform.edu21-improve.com/planning', icon: '📚', color: 'var(--accent-purple)' },
    { title: 'Jóvenes Creativos', url: 'https://jovenes.tocaunavida.org/', icon: '🎨', color: 'var(--accent-pink)' },
    { title: 'Inglés', url: 'https://site3.q10.com/login?ReturnUrl=%2F&aplentId=6a3e4ee0-f9d7-4715-9c11-3e01e2fa932d', icon: '🌎', color: 'var(--accent-cyan)' },
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
    </div>
  )
}

export default App
