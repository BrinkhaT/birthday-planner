// Test utility: mockFetch
export const mockFetchSuccess = (data: any) => {
  const mockFn = global.fetch as jest.MockedFunction<typeof global.fetch>;
  return jest.spyOn(global as any, 'fetch').mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => data,
  } as Response);
};

export const mockFetchError = (status: number, error: string) => {
  const mockFn = global.fetch as jest.MockedFunction<typeof global.fetch>;
  return jest.spyOn(global as any, 'fetch').mockResolvedValue({
    ok: false,
    status,
    json: async () => ({ error }),
  } as Response);
};

export const mockFetchNetworkError = () => {
  const mockFn = global.fetch as jest.MockedFunction<typeof global.fetch>;
  return jest.spyOn(global as any, 'fetch').mockRejectedValue(new Error('Network error'));
};
