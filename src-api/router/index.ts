import { Config } from '../config';
import { ExpressWrapper } from '../utils-std-ts/express-wrapper';
import { playbooksRouter } from './playbooks';

export let router = ExpressWrapper.createRouter();

router.use(`${Config.API_BASEPATH}/playbooks/`, playbooksRouter);
