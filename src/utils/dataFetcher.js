
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Configuration for retry logic
const MAX_RETRIES = 5;
const INITIAL_DELAY_MS = 1000; // 1 second
const MAX_DELAY_MS = 30000; // 30 seconds

class RetryableError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'RetryableError';
    this.status = status;
  }
}

/**
 * Generic data fetching utility for Nova Orchestrator backend.
 */
const dataFetcher = {
  /**
   * Performs a GET request to the specified endpoint.
   * @param {string} endpoint - The API endpoint relative to BASE_URL.
   * @param {object} options - Fetch options (e.g., headers).
   * @returns {Promise<any>} - The JSON response from the server.
   */
  async get(endpoint, options = {}) {
    return this._retryFetch(async () => {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        ...options,
      });
      return this._handleResponse(response);
    });
  },

  /**
   * Performs a POST request to the specified endpoint.
   * @param {string} endpoint - The API endpoint relative to BASE_URL.
   * @param {object} data - The data to send in the request body.
   * @param {object} options - Fetch options (e.g., headers).
   * @returns {Promise<any>} - The JSON response from the server.
   */
  async post(endpoint, data, options = {}) {
    return this._retryFetch(async () => {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });
      return this._handleResponse(response);
    });
  },

  /**
   * Handles the API response, checking for errors and parsing JSON.
   * Throws RetryableError for specific status codes.
   * @param {Response} response - The fetch API response object.
   * @returns {Promise<any>} - The JSON response.
   * @throws {Error} - Throws a regular Error if the response is not OK and not retryable.
   * @throws {RetryableError} - Throws a RetryableError if the response is not OK and is retryable.
   */
  async _handleResponse(response) {
    if (!response.ok) {
      const isRetryable = [429, 500, 502, 503, 504].includes(response.status);
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      const errorMessage = errorData.message || 'Something went wrong with the request.';

      if (isRetryable) {
        throw new RetryableError(errorMessage, response.status);
      } else {
        throw new Error(errorMessage);
      }
    }
    return response.json();
  },

  /**
   * Retries a given fetch operation with exponential backoff and jitter.
   * @param {function} fetchOperation - A function that returns a Promise for the fetch call.
   * @param {number} retries - Current retry count (internal).
   * @param {number} delay - Current delay in milliseconds (internal).
   * @returns {Promise<any>} - The successful response from the fetch operation.
   * @throws {Error} - Throws if the operation fails after all retries or with a non-retryable error.
   */
  async _retryFetch(fetchOperation, retries = 0, delay = INITIAL_DELAY_MS) {
    try {
      return await fetchOperation();
    } catch (error) {
      if (error instanceof RetryableError && retries < MAX_RETRIES) {
        // Apply exponential backoff with jitter
        const jitter = Math.random() * delay; // Add random jitter
        const backoffDelay = Math.min(delay * 2 + jitter, MAX_DELAY_MS);
        
        console.warn(`Retrying (attempt ${retries + 1}/${MAX_RETRIES}) after ${backoffDelay.toFixed(0)}ms: ${error.message}`);
        
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        return this._retryFetch(fetchOperation, retries + 1, backoffDelay);
      } else {
        throw error; // Re-throw non-retryable errors or if max retries reached
      }
    }
  },
};

export default dataFetcher;
