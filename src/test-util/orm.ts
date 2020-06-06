import { initOrm } from "../orm";
import { TestEntity } from "./TestEntity";
import { BaseGent } from "../entities";

export async function initTestOrm(): Promise<void> {
  await initOrm({
    debug: true,
    dbName: "/tmp/genttests.sqlite",
    type: "sqlite",
    entities: [BaseGent, TestEntity],
  });
}
