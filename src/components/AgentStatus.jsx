import { BrainCircuit, Code, SearchCheck, Loader2 } from 'lucide-react';

export default function AgentStatus({ agent }) {
  const isBusy = agent.status !== 'idle';
  
  const getIcon = () => {
    switch(agent.name) {
      case 'Architect': return <BrainCircuit size={18} />;
      case 'UI Developer': return <Code size={18} />;
      case 'QA Reviewer': return <SearchCheck size={18} />;
      default: return <BrainCircuit size={18} />;
    }
  };

  const getStatusColor = () => {
    switch(agent.status) {
      case 'thinking': return 'var(--accent-warning)';
      case 'coding': return 'var(--accent-primary)';
      case 'reviewing': return 'var(--accent-success)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className={`glass-panel ${isBusy ? 'animate-pulse' : ''}`} style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: isBusy ? `3px solid ${getStatusColor()}` : '3px solid transparent', transition: 'all 0.3s ease' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `var(--bg-surface-hover)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: getStatusColor() }}>
        {getIcon()}
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '0.9rem', margin: '0 0 4px 0' }}>{agent.name}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          {isBusy && <Loader2 size={12} className="animate-spin" />}
          <span style={{ textTransform: 'capitalize' }}>{agent.status}</span>
        </div>
      </div>
    </div>
  );
}
