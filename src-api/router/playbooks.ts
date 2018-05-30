import * as childProcess from 'child_process';
import { NextFunction, Request, Response, Router } from 'express';
import * as _ from 'lodash';
import { Config } from '../config';
import { Execution } from '../executions/execution';
import { ExecutionList } from '../executions/list';
import { ExpressWrapper } from '../utils-std-ts/express-wrapper';
import { Logger } from '../utils-std-ts/logger';
import { SystemCommand } from '../utils-std-ts/system-command';

const logger = new Logger('router/playbook');

export const playbooksRouter = ExpressWrapper.createRouter();

playbooksRouter.post('/executions', (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve()
    .then(async () => {
      const playbook = getParameter(req, res, 'playbook');
      const inventory = getParameter(req, res, 'inventory');
      let parameters = '';
      if (req.body.parameters) {
        parameters = `--extra-vars "${req.body.parameters}"`;
      }
      const execution = new Execution();
      ExecutionList.add(execution);
      const command =
        `ansible-playbook ` +
        `-i ${Config.PLAYBOOK_PATH}/${inventory}.yaml` +
        ` ${Config.PLAYBOOK_PATH}/${playbook}.yml` +
        ` ${parameters}`;
      SystemCommand.execute(command)
        .then(output => {
          logger.info(`Execution ${execution.id} succeeded`);
          execution.complete();
          ExecutionList.update(execution.id, execution);
        })
        .catch(error => {
          logger.info(`Execution ${execution.id} failed`);
          logger.error(error);
          execution.complete(error);
          ExecutionList.update(execution.id, execution);
        });
      res.status(201).send(execution);
      next();
    })
    .catch(error => {
      logger.error(error);
      next();
    });
});

playbooksRouter.get('/executions/:execution_id', (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve()
    .then(async () => {
      const execution = await ExecutionList.get(req.params.execution_id).catch(error => {
        res.status(404).send({ error: error.message });
        throw error;
      });
      res.status(200).send(execution);
      next();
    })
    .catch(error => {
      logger.error(error);
      next();
    });
});

function getParameter(req: Request, res: Response, parameterName: string, defaultValue: any = null): any {
  if (!_.has(req, `body.${parameterName}`)) {
    if (_.isSet(defaultValue)) {
      return defaultValue;
    }
    const error = new Error(parameterName + ' parameter missing');
    res.status(403).send({ error });
    throw error;
  }
  return req.body[parameterName];
}
