import { Terminal, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

export default function EventStream({ events }) {
  const getIcon = (type) => {
    switch(type) {
      case 'action': return <ChevronRight size={16} color="var(--accent-primary)" />;
      case 'thought': return <Terminal size={16} color="var(--accent-warning)" />;
      case 'success': return <CheckCircle2 size={16} color="var(--accent-success)" />;
      case 'system': return <AlertCircle size={16} color="var(--text-muted)" />;
      default: return <ChevronRight size={16} />;
    }
  };

  return (
    <div className="glass-panel" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
      <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', margin: 0 }}>Activity Stream</h3>
      
      {events.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Awaiting orchestration triggers...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {events.map((evt, i) => (
            <div key={evt.id} className="animate-fade-in" style={{ display: 'flex', gap: '16px', background: 'var(--bg-surface-hover)', padding: '16px', borderRadius: '8px', animationFillMode: 'both' }}>
              <div style={{ marginTop: '2px' }}>
                {getIcon(evt.type)}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{evt.agentName}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{evt.timestamp.toLocaleTimeString()}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {evt.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
