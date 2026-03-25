import EventStream from './EventStream';
import { Play, Loader2 } from 'lucide-react';

export default function Dashboard({ events, onLaunch, isProcessing }) {
  return (
    <main style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 60%)', opacity: 0.15, zIndex: 0, pointerEvents: 'none' }} />

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Orchestration Hub</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Monitoring the Agent-First Application Development workflow.</p>
        </div>
        <button 
          onClick={onLaunch}
          disabled={isProcessing}
          style={{
            background: isProcessing ? 'var(--bg-surface-hover)' : 'var(--accent-primary)',
            color: isProcessing ? 'var(--text-muted)' : '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: isProcessing ? 'none' : '0 4px 14px var(--accent-glow)',
            transition: 'all 0.2s ease'
          }}
        >
          {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
          {isProcessing ? 'Workflow Active' : 'Launch Workflow'}
        </button>
      </header>

      <div style={{ flex: 1, zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        <EventStream events={events} />
      </div>
    </main>
  );
}
