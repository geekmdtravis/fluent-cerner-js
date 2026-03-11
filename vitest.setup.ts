import { vi } from 'vitest';

(global as any).jest = {
  fn: vi.fn(),
  spyOn: vi.spyOn,
  mockImplementation: vi.mockImplementation,
  mockReturnValue: vi.mockReturnValue,
  mockResolvedValue: vi.mockResolvedValue,
  mockRejectedValue: vi.mockRejectedValue,
  mockImplementationOnce: vi.mockImplementationOnce,
  fn: vi.fn,
  spyOn: vi.spyOn,
};
