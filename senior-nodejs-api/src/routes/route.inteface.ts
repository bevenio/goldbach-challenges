import { Router } from 'express';
import { Query } from 'express-serve-static-core';

export interface Route {
  path?: string;
  router: Router;
}