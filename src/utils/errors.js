/**
 * Custom error class for Nova Orchestrator application to ensure
 * proper telemetry formatting as required by the style guide.
 */
export class NovaAppError extends Error {
    constructor(message, context = {}) {
        super(message);
        this.name = 'NovaAppError';
        this.context = context;
        this.timestamp = new Date().toISOString();
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            context: this.context,
            timestamp: this.timestamp
        };
    }
}
