/* eslint-disable @typescript-eslint/no-explicit-any */
// Test utility: mockFetch
export const mockFetchSuccess = (data: any) => {
  return jest.spyOn(global as any, 'fetch').mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => data,
  } as Response);
};

export const mockFetchError = (status: number, error: string) => {
  return jest.spyOn(global as any, 'fetch').mockResolvedValue({
    ok: false,
    status,
    json: async () => ({ error }),
  } as Response);
};

export const mockFetchNetworkError = () => {
  return jest.spyOn(global as any, 'fetch').mockRejectedValue(new Error('Network error'));
};
