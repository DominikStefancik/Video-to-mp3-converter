import { Logger } from 'pino';

import database from '@local/database/setup';
import { User } from '../model';
import { SELECT_USER } from './queries';

export class UserRepository {
  private readonly database = database;

  public constructor(private readonly logger: Logger) {}

  public async getOne(email: string): Promise<User> {
    this.logger.info({ email }, 'Fetching user from the database');

    const queryResult = await this.database.query(SELECT_USER, [email]);

    return queryResult.rows[0] as User;
  }
}
