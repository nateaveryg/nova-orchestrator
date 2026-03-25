# Nova Orchestrator Architecture

This document contains visual diagrams detailing the application component architecture and the hypothetical agent processes driving the Agent-First workflow.

## Component Architecture

```mermaid
graph TD
    App["App Container"]
    Sidebar["Agent Roster (Sidebar)"]
    AgentStatus["Agent Status Indicator"]
    Dashboard["Main Dashboard Hub"]
    EventStream["Real-Time Event Stream"]

    App --> Sidebar
    Sidebar --> AgentStatus
    App --> Dashboard
    Dashboard --> EventStream
```

## Agent Network Workflow Loop

```mermaid
sequenceDiagram
    participant System as Orchestrator Core
    participant Architect as System Architect
    participant Coder as UI Developer
    participant QA as QA Validator

    System->>Architect: Initiate Capability #12 Spec-Driven Workflow
    Architect-->>System: Analyze Requirements & State
    Architect->>Coder: Issue Validated Build Specification
    Coder-->>System: Scaffold Asynchronous Output
    Coder->>QA: Dispatch for Review
    QA-->>System: Validate Tests (Capability #7)
    QA->>System: Workflow Success
```
