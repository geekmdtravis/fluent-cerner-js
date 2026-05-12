import type { vi } from 'vitest';

declare global {
  // eslint-disable-next-line no-var
  var jest: {
    fn: typeof vi.fn;
    spyOn: typeof vi.spyOn;
    mockImplementation: typeof vi.mockImplementation;
    mockReturnValue: typeof vi.mockReturnValue;
    mockResolvedValue: typeof vi.mockResolvedValue;
    mockRejectedValue: typeof vi.mockRejectedValue;
    mockImplementationOnce: typeof vi.mockImplementationOnce;
  };
}

export {};
