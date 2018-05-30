import * as _ from 'lodash';
import { Execution } from './execution';

const executions: Execution[] = [];

export class ExecutionList {
  //
  public static get(id: string): Promise<Execution> {
    const task = _.find(executions, { id });
    if (!task) {
      return Promise.reject(new Error('Unknown task'));
    }
    return Promise.resolve(_.cloneDeep(task));
  }

  public static async add(task: Execution): Promise<void> {
    executions.push(_.cloneDeep(task));
  }

  public static async update(id: string, task: Execution): Promise<void> {
    await ExecutionList.remove(id);
    await ExecutionList.add(task);
  }

  public static list(): Promise<Execution[]> {
    return Promise.resolve(_.cloneDeep(executions));
  }

  public static async remove(id: string): Promise<void> {
    const taskIndex = _.findIndex(executions, { id });
    if (taskIndex < 0) {
      return Promise.reject(new Error('Unknown task'));
    }
    executions.splice(taskIndex, 1);
  }
}
