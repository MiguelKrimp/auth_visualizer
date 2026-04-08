export class EventHandler<T> {
  private listeners: ((data: T) => void)[] = [];

  subscribe(listener: (data: T) => void): void {
    this.listeners.push(listener);
  }

  unsubscribe(listener: (data: T) => void): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  emit(data: T): void {
    this.listeners.forEach((listener) => listener(data));
  }
}
