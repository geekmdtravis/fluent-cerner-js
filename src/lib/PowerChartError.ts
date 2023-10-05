export class PowerChartError implements Error {
  name: string;
  message: string;
  stack?: string | undefined;
  cause?: unknown;
  constructor(message: string) {
    this.name = 'PowerChartError';
    this.message = message;
    this.stack = new Error().stack;
    this.cause =
      'A call to a Cerner Discern native function or COM object was attempted outside of the PowerChart context.';
  }
  toString() {
    return `${this.name}: ${this.message}`;
  }
}
