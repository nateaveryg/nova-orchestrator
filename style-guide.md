# Nova Orchestrator - Engineering Style Guide

## 1. Security First
*   Never hardcode secrets. Always use `process.env`.
*   Avoid `eval()` or dynamic code execution.

## 2. Code Quality & Readability
*   **Strict Cyclomatic Complexity:** Functions must not contain more than 3 nested `if/else` statements.
*   **Error Handling:** Do not throw generic `Error` objects. You must use the custom `NovaAppError` class to ensure proper telemetry formatting.
