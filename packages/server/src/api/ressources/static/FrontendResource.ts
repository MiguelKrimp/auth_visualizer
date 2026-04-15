import { Express, static as static_ } from 'express';

export function registerClientResource(app: Express) {
  app.use('/', static_(__dirname + '/dist', { index: 'index.html' }));
}
