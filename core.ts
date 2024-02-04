'use strict';

/**
 * Module Dependencies
 * @private
 */

import uuid from 'uuid';
import sqlite from 'sqlite3';

/**
 * DB Setup
 * @param {String} dbPath
 * @returns {protonDB}
 * @public
 */

export class protonDB {
    private db: sqlite.Database;

    constructor(dbPath: string) {
        this.db = new sqlite.Database(dbPath);
    }

    public open(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                resolve()
            })
        })
    }

    public close(): Promise<void> {
        return new Promise((resolve, reject) =>
            this.db.close((err) => {
                err ? reject(err) : resolve();
            }))
    }

    public run(query: string, params: any[] = []): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, (err) => {
                err ? reject(err) : resolve();
            })
        })
    }

    public get<T>(query: string, params: any[] = []): Promise<T | undefined> {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row: T) => {
                err ? reject(err) : resolve(row);
            })
        })
    }

    public all<T>(query: string, params: any[] = []): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows: T[]) => {
                err ? reject(err) : resolve(rows);
            })
        })
    }
}

/**
 * UUID Generation and DB Interface
 * @param {String} uuid
 * @param {protonDB} db
 * @returns {Boolean}
 * @public
 */

export class protonUUID {
    generateClientId(): string {
        return uuid.v4();
    }

    isClientInProtonDB(db: protonDB, clientId: string, ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await db.open();
            const user = await db.get('SELECT * FROM users WHERE uuid = ?', [clientId])
            user ? resolve(true) : reject()
            await db.close();
        })
    }

    storeClientIdInProtonDB(db: protonDB, clientId: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await db.open();
            await db.run('INSERT INTO users (uuid) VALUES (?)', [clientId])
            let success = await this.isClientInProtonDB(db, clientId);
            success == true ? resolve() : reject()
            await db.close();
        })
    }
}


