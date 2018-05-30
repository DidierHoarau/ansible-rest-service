import * as bodyParser from 'body-parser';
import { NextFunction, Request, Response, Router } from 'express';
import * as url from 'url';
import { ExecutionCleanup } from './executions/cleanup';
import { router } from './router';
import { ExpressWrapper } from './utils-std-ts/express-wrapper';
import { Logger } from './utils-std-ts/logger';

const logger = new Logger('app');

logger.info('======== ANSIBLE Starting =========');

const api = ExpressWrapper.createApi();
const PORT = 80;

api.listen(PORT, () => {
  logger.info(`App listening on port ${PORT}`);
});

api.use((req: any, res: Response, next: NextFunction) => {
  res.status(404);
  req.customApiLogging = { startDate: new Date() };
  logger.info(`${req.method} ${url.parse(req.url).pathname}`);
  next();
});

api.use(bodyParser.json());

api.use(router);

router.use((req: any, res: Response, next: NextFunction) => {
  logger.info(`API Response: ${res.statusCode}; ${new Date().getTime() - req.customApiLogging.startDate.getTime()}ms`);
  next();
});

ExecutionCleanup.cyclic();
