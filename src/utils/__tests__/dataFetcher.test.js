import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest';
import dataFetcher from '../dataFetcher';

// Mock the global fetch function
global.fetch = vi.fn();

// Import the constants to mock them, or ensure they are accessible
const MAX_RETRIES = 5; // Assuming the constant from dataFetcher.js
const INITIAL_DELAY_MS = 1000; // Assuming the constant from dataFetcher.js
const MAX_DELAY_MS = 30000; // Assuming the constant from dataFetcher.js

describe('dataFetcher', () => {
  const MOCK_BASE_URL = 'http://localhost:3000/api';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_API_BASE_URL', MOCK_BASE_URL);
    vi.useFakeTimers(); // Mock timers for exponential backoff
  });

  afterEach(() => {
    // Restore real timers and mocks after each test
    vi.runOnlyPendingTimers(); // Ensure all pending timers are cleared
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  afterAll(() => {
    vi.unstubAllEnvs(); // Clean up environment stubs after all tests
  });

  // Helper to create a mock response
  const createMockResponse = (body, { ok = true, status = 200, statusText = 'OK' } = {}) => ({
    ok,
    status,
    statusText,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  });

  describe('get method', () => {
    it('should successfully fetch data from an endpoint', async () => {
      const mockData = { id: 1, name: 'Test Item' };
      fetch.mockResolvedValueOnce(createMockResponse(mockData));

      const result = await dataFetcher.get('/items/1');
      await vi.runOnlyPendingTimersAsync(); // Ensure any microtasks from fetch are resolved

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(`${MOCK_BASE_URL}/items/1`, { method: 'GET' });
      expect(result).toEqual(mockData);
    });

    it('should throw an error if the GET request fails with a non-retryable error', async () => {
      const errorResponse = { message: 'Unauthorized' };
      fetch.mockResolvedValueOnce(createMockResponse(errorResponse, { ok: false, status: 401, statusText: 'Unauthorized' }));

      await expect(dataFetcher.get('/items/999')).rejects.toThrow('Unauthorized');
      await vi.runOnlyPendingTimersAsync(); // Ensure any microtasks from fetch are resolved
      expect(fetch).toHaveBeenCalledTimes(1); // Should not retry
    });

    it('should retry on retryable errors and eventually succeed', async () => {
      const mockData = { id: 1, name: 'Test Item' };
      // First 2 attempts fail with a retryable error, third succeeds
      fetch.mockResolvedValueOnce(createMockResponse({ message: 'Service Unavailable' }, { ok: false, status: 503, statusText: 'Service Unavailable' }));
      fetch.mockResolvedValueOnce(createMockResponse({ message: 'Too Many Requests' }, { ok: false, status: 429, statusText: 'Too Many Requests' }));
      fetch.mockResolvedValueOnce(createMockResponse(mockData));

      const promise = dataFetcher.get('/retry-item');

      // Manually advance timers for each retry
      for (let i = 0; i < 2; i++) { // We expect 2 retries before success
        await vi.advanceTimersByTimeAsync(MAX_DELAY_MS + 100); // Advance enough to cover max possible backoff for this attempt
      }

      const result = await promise; // Await the final successful promise

      expect(fetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual(mockData);
    });

    it('should throw an error if all retries fail', async () => {
      // All attempts fail with a retryable error
      for (let i = 0; i < MAX_RETRIES + 1; i++) { // +1 for the initial attempt
        fetch.mockResolvedValueOnce(createMockResponse({ message: 'Service Unavailable' }, { ok: false, status: 503, statusText: 'Service Unavailable' }));
      }

      const promise = dataFetcher.get('/failing-item');

      // Advance timers for all retries
      for (let i = 0; i < MAX_RETRIES; i++) {
        await vi.advanceTimersByTimeAsync(MAX_DELAY_MS + 100); // Advance enough to cover max possible backoff for each attempt
      }

      await expect(promise).rejects.toThrow('Service Unavailable');
      expect(fetch).toHaveBeenCalledTimes(MAX_RETRIES + 1); // Initial attempt + MAX_RETRIES
    });
  });

  describe('post method', () => {
    it('should successfully post data to an endpoint', async () => {
      const postData = { name: 'New Item' };
      const mockResponseData = { id: 2, name: 'New Item' };
      fetch.mockResolvedValueOnce(createMockResponse(mockResponseData));

      const result = await dataFetcher.post('/items', postData);
      await vi.runOnlyPendingTimersAsync();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(`${MOCK_BASE_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      expect(result).toEqual(mockResponseData);
    });

    it('should throw an error if the POST request fails with a non-retryable error', async () => {
      const postData = { name: 'Invalid Item' };
      const errorResponse = { message: 'Bad Request' };
      fetch.mockResolvedValueOnce(createMockResponse(errorResponse, { ok: false, status: 400, statusText: 'Bad Request' }));

      await expect(dataFetcher.post('/items', postData)).rejects.toThrow('Bad Request');
      await vi.runOnlyPendingTimersAsync();
      expect(fetch).toHaveBeenCalledTimes(1); // Should not retry
    });

    it('should retry on retryable errors for POST and eventually succeed', async () => {
      const postData = { name: 'Retryable Item' };
      const mockResponseData = { id: 3, name: 'Retryable Item' };
      // First 2 attempts fail with a retryable error, third succeeds
      fetch.mockResolvedValueOnce(createMockResponse({ message: 'Gateway Timeout' }, { ok: false, status: 504, statusText: 'Gateway Timeout' }));
      fetch.mockResolvedValueOnce(createMockResponse({ message: 'Internal Server Error' }, { ok: false, status: 500, statusText: 'Internal Server Error' }));
      fetch.mockResolvedValueOnce(createMockResponse(mockResponseData));

      const promise = dataFetcher.post('/retry-post', postData);

      // Manually advance timers for each retry
      for (let i = 0; i < 2; i++) { // We expect 2 retries before success
        await vi.advanceTimersByTimeAsync(MAX_DELAY_MS + 100); // Advance enough to cover max possible backoff for this attempt
      }

      const result = await promise;

      expect(fetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual(mockResponseData);
    });

    it('should throw an error if all POST retries fail', async () => {
      const postData = { name: 'Failing Item' };
      // All attempts fail with a retryable error
      for (let i = 0; i < MAX_RETRIES + 1; i++) {
        fetch.mockResolvedValueOnce(createMockResponse({ message: 'Service Unavailable' }, { ok: false, status: 503, statusText: 'Service Unavailable' }));
      }

      const promise = dataFetcher.post('/failing-post', postData);

      // Advance timers for all retries
      for (let i = 0; i < MAX_RETRIES; i++) {
        await vi.advanceTimersByTimeAsync(MAX_DELAY_MS + 100); // Advance enough to cover max possible backoff for each attempt
      }

      await expect(promise).rejects.toThrow('Service Unavailable');
      expect(fetch).toHaveBeenCalledTimes(MAX_RETRIES + 1);
    });
  });
});
