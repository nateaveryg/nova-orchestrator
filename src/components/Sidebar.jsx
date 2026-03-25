import AgentStatus from './AgentStatus';
import { Layers } from 'lucide-react';

export default function Sidebar({ agents }) {
  return (
    <aside style={{ width: '300px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px', borderRight: '1px solid var(--border-subtle)', background: 'linear-gradient(to bottom, var(--bg-surface), transparent)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--accent-glow)' }}>
          <Layers size={24} color="var(--accent-primary)" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Nova Orchestrator</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Agent Network</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px' }}>Active Core Agents</h3>
        {agents.map(agent => (
          <AgentStatus key={agent.id} agent={agent} />
        ))}
      </div>
    </aside>
  );
}
