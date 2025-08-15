import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a routerLink="/login">Go to Home</a>
    </div>
  `,
  styles: [`
    .not-found {
      text-align: center;
      margin-top: 50px;
    }
    h1 {
      font-size: 3rem;
      color: #d9534f;
    }
    a {
      color: #0275d8;
      text-decoration: underline;
      cursor: pointer;
    }
  `]
})
export class NotFoundComponent { }
