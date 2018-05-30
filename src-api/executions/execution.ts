export class Execution {
  public id: string;
  public failed: boolean;
  public succeeded: boolean;
  public completed: boolean;
  public startDate: Date;
  public endDate: Date;

  constructor() {
    this.id = generateId();
    this.completed = false;
    this.succeeded = false;
    this.failed = false;
    this.startDate = new Date();
  }

  public complete(error: Error = null): void {
    this.completed = true;
    this.endDate = new Date();
    if (error) {
      this.failed = true;
    } else {
      this.succeeded = true;
    }
  }
}

function generateId(length: number = 20): string {
  let id = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    id += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return id;
}
