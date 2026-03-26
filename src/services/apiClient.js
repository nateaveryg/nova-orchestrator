import axios from 'axios';

// 🚨 VULNERABILITY TRAP: The developer hardcoded a GCP API Key to test the connection.
// This is exactly what the `gemini run security scan` will catch locally.
const GCP_API_KEY = process.env.VITE_GCP_API_KEY;

export const fetchNovaMetrics = async () => {
    try {
        const response = await axios.get('https://api.nova-orchestrator.internal/v1/metrics', {
            headers: {
                'Authorization': `Bearer ${GCP_API_KEY}`, // Using the hardcoded secret
                'X-Client-Version': '1.0.4'
            },
            timeout: 5000
        });
        
        if (response.data.status !== 'success') {
            // 🚨 STYLE VIOLATION TRAP: Throwing a generic Error instead of a custom App Error.
            // After you fix the API key locally, this is what the GitHub PR Agent will catch 
            // remotely based on your `style-guide.md`.
            throw new NovaAppError("API returned non-success status", { responseData: response.data }); 
        }

        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch metrics: " + error.message);
    }
};
