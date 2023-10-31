import { Router, Request, Response, NextFunction } from 'express';

export class BaseRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
  }

  protected get(path: string, callback: (req: Request, res: Response, next: NextFunction) => void, ...middleware: any[]) {
    this.router.get(path, ...middleware, callback);
  }

  protected post(path: string, callback: (req: Request, res: Response, next: NextFunction) => void, ...middleware: any[]) {
    this.router.post(path, ...middleware, callback);
  }

  protected put(path: string, callback: (req: Request, res: Response, next: NextFunction) => void, ...middleware: any[]) {
    this.router.put(path, ...middleware, callback);
  }

  protected delete(path: string, callback: (req: Request, res: Response, next: NextFunction) => void, ...middleware: any[]) {
    this.router.delete(path, ...middleware, callback);
  }

  // Add any other HTTP methods you need (e.g., patch, options, etc.)

  public mount(path: string): Router {
    return this.router;
  }
}