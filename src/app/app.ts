import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

interface HelloResponse {
  message: string;
  connected: boolean;
  server?: string;
  database?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly http = inject(HttpClient);

  protected readonly message = signal('Hello');
  protected readonly status = signal('Connecting to the backend...');

  constructor() {
    this.http.get<HelloResponse>('/api/hello').subscribe({
      next: (response) => {
        this.message.set(response.message);
        this.status.set(
          response.connected
            ? `Connected to ${response.server} / ${response.database}`
            : 'Backend responded, but the database is unavailable.',
        );
      },
      error: () => {
        this.status.set('Could not reach the backend at http://localhost:5110.');
      },
    });
  }
}
