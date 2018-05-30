import { Timeout } from '../utils-std-ts/timeout';
import { ExecutionList } from './list';

const CYCLE = 10 * 60 * 1000;
const MAX_RETENTION = 15 * 60 * 1000;

export class ExecutionCleanup {
  //
  public static cyclic(): void {
    Promise.resolve().then(async () => {
      const taskList = await ExecutionList.list();
      for (const task of taskList) {
        if (new Date().getTime() - task.endDate.getTime() > MAX_RETENTION) {
          await ExecutionList.remove(task.id).catch(ignoreError);
        }
      }
      await Timeout.wait(CYCLE);
      ExecutionCleanup.cyclic();
    });
  }
}

function ignoreError(): void {
  // nothing
}
