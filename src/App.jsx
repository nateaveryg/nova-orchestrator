import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

function App() {
  const [agents, setAgents] = useState([
    { id: '1', name: 'Architect', status: 'idle', role: 'System Planner', color: 'indigo' },
    { id: '2', name: 'UI Developer', status: 'idle', role: 'Frontend Coder', color: 'emerald' },
    { id: '3', name: 'QA Reviewer', status: 'idle', role: 'Validator', color: 'amber' }
  ]);

  const [events, setEvents] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const logEvent = (message, agentName, type = 'info') => {
    setEvents(prev => [...prev, { id: Date.now() + Math.random(), message, agentName, type, timestamp: new Date() }]);
  };

  const launchWorkflow = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setEvents([]); // Clear previous events
    
    logEvent("Initiating 'Agent-First Application Development' workflow...", "System", "system");
    
    // Step 1: Architect
    setTimeout(() => {
      setAgents(prev => prev.map(a => a.name === 'Architect' ? { ...a, status: 'thinking' } : a));
      logEvent("Analyzing requirements for 'Nova Orchestrator' demo.", "Architect", "thought");
    }, 1000);

    setTimeout(() => {
      logEvent("Drafting Gartner Capability #12 Spec-Driven Architecture.", "Architect", "action");
    }, 2500);

    // Step 2: UI Developer
    setTimeout(() => {
      setAgents(prev => prev.map(a => a.name === 'Architect' ? { ...a, status: 'idle' } : a));
      setAgents(prev => prev.map(a => a.name === 'UI Developer' ? { ...a, status: 'coding' } : a));
      logEvent("Architecture approved. Scaffolding React Vite application.", "UI Developer", "action");
    }, 4500);

    setTimeout(() => {
      logEvent("Implementing premium dark mode CSS and glassmorphism styling.", "UI Developer", "thought");
    }, 6000);

    // Step 3: Reviewer
    setTimeout(() => {
      setAgents(prev => prev.map(a => a.name === 'UI Developer' ? { ...a, status: 'idle' } : a));
      logEvent("Component synthesis complete.", "UI Developer", "success");
      setAgents(prev => prev.map(a => a.name === 'QA Reviewer' ? { ...a, status: 'reviewing' } : a));
      logEvent("Beginning Capability #7 Verification Protocol.", "QA Reviewer", "action");
    }, 8500);

    // Completion
    setTimeout(() => {
      logEvent("All tests passing. Aesthetic standards met.", "QA Reviewer", "success");
      setAgents(prev => prev.map(a => a.name === 'QA Reviewer' ? { ...a, status: 'idle' } : a));
      logEvent("Workflow completed successfully.", "System", "system");
      setIsProcessing(false);
    }, 11500);
  };

  return (
    <div className="app-container">
      <Sidebar agents={agents} />
      <Dashboard events={events} onLaunch={launchWorkflow} isProcessing={isProcessing} />
    </div>
  );
}

export default App;
