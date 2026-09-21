#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/4e03c20b433a46eacbe3e837c60775046368e41cc85ab3cab0560c9dd9883978/contract';
import startContract from '../../snapshots/4e03c20b433a46eacbe3e837c60775046368e41cc85ab3cab0560c9dd9883978/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/9f05f4e2dddea9a76ee94b75f25b6dc8bab6ee85d3373d6f7fcbfd9f6df44483/contract';
import endContract from '../../snapshots/9f05f4e2dddea9a76ee94b75f25b6dc8bab6ee85d3373d6f7fcbfd9f6df44483/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'admin',
        columns: [
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('password', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'session',
        columns: [
          col('adminId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'admin',
        constraint: 'admin_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'session',
        index: 'session_adminId_idx_530179db',
        columns: ['adminId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'session',
        foreignKey: {
          name: 'session_adminId_fkey',
          columns: ['adminId'],
          references: { schema: 'public', table: 'admin', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
