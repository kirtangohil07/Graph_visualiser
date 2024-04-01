export class PriorityQueue<T> {
  private elements: { element: T, priority: number }[] = [];

  enqueue(element: T, priority: number): void {
    this.elements.push({ element, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): T | undefined {
    const element = this.elements.shift();
    return element ? element.element : undefined;
  }

  isEmpty(): boolean {
    return this.elements.length === 0;
  }
}