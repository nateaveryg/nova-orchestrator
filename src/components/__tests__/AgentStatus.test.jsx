import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AgentStatus from '../AgentStatus';
import React from 'react';

describe('AgentStatus Component', () => {
  it('renders idle agent correctly', () => {
    const agent = { id: '1', name: 'Architect', status: 'idle', role: 'System Planner' };
    render(<AgentStatus agent={agent} />);
    
    expect(screen.getByText('Architect')).toBeInTheDocument();
    expect(screen.getByText('idle')).toBeInTheDocument();
  });

  it('renders busy agent correctly', () => {
    const agent = { id: '2', name: 'UI Developer', status: 'coding', role: 'Frontend Coder' };
    const { container } = render(<AgentStatus agent={agent} />);
    
    expect(screen.getByText('UI Developer')).toBeInTheDocument();
    expect(screen.getByText('coding')).toBeInTheDocument();
    // Assuming animate-pulse is applied when busy
    expect(container.firstChild).toHaveClass('animate-pulse');
  });
});
