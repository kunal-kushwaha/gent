import { User } from '../models';
import { EntityManager } from 'mikro-orm';
import { createContextualizedEntityManager } from './orm';

/**
 * Encapulates all information for a viewer in one request. Commonly
 * abbreviated to `vc` or "VC".
 *
 * A new VC must be created for each viewer, and a new one should be created
 * for every request.
 */
export abstract class ViewerContext {
  /**
   * Entity manager, forked meant to be used with this viewer context.
   *
   * WARNING: You probably don't want to use this directly! This is intended
   * for use by GentQuery/GentMutator and has raw access to the database. Using
   * this will bypass all Gent authorization checks. Use GentQuery/GentMutator
   * if possible.
   */
  readonly entityManager: Readonly<EntityManager>;

  constructor() {
    this.entityManager = createContextualizedEntityManager();
  }

  abstract get isAuthenticated(): boolean;
}

/**
 * A viewer context for an authenticated viewer.
 */
export abstract class AuthenticatedViewerContext extends ViewerContext {
  isAuthenticated = true;
}

/**
 * A viewer context for a logged in user.
 */
export class UserViewerContext extends AuthenticatedViewerContext {
  readonly #user: User;
  readonly #roles: string[];
  readonly #scopes: string[];

  constructor(user: User, roles: string[], scopes: string[]) {
    super();
    this.#user = user;
    this.#roles = roles;
    this.#scopes = scopes;
  }

  get user(): User {
    return this.#user;
  }
}

/**
 * A viewer context for a viewer that is not logged in.
 */
export class UnauthenticatedViewerContext extends AuthenticatedViewerContext {
  isAuthenticated = false;
}

/**
 * Omniscient, omnipotent viewer context that can see and do everything.
 * **Dangerous!** Bypasses all authorization checks. Use only when necessary.
 */
export class DangerouslyOmnipotentViewerContext extends AuthenticatedViewerContext {}