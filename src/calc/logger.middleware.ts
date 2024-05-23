import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    res.on('finish', () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration} ms`;
      console.log(logMessage);
    });

    next();
  }
}
