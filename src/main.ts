import { isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { setupWorker } from 'msw/browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { handlers } from './mocks/handlers';

if (isDevMode()) {
  const mswWorker = setupWorker(...handlers);

  mswWorker.start();
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
