import { MikroORM, Options } from 'mikro-orm';
import * as entities from './entities/';

let globalOrm: MikroORM | undefined;

export const gentEntities = Object.values(entities);

export async function initOrm(options: Options) {
  globalOrm = await MikroORM.init(options);
}

class OrmNotInitializedError extends Error {
  constructor() {
    super('ORM not initialized! Ensure that `initOrm` was called and the promise resolved.');
  }
}

function initializedGlobalOrm(): MikroORM | never {
  if (!globalOrm) {
    throw new OrmNotInitializedError();
  }
  return globalOrm;
}

export function getGlobalEntityManager() {
  return initializedGlobalOrm().em;
}

export function createContextualizedEntityManager() {
  return initializedGlobalOrm().em.fork();
}

export async function closeGlobalOrmConnection(
  force: boolean | undefined = undefined,
): Promise<void> {
  if (globalOrm) {
    return globalOrm.close(force);
  }
}