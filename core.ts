'use strict';

/**
 * Module Dependencies
 * @private
 */

import uuid from 'uuid';
import sqlite from 'sqlite3';

/**
 * DB Setup
 * @param { String } dbPath
 * @returns { protonDB }
 * @public
 */

export class protonDB {
    private db: sqlite.Database;

    constructor(dbPath: string) {
        this.db = new sqlite.Database(dbPath);
    }

    /**
     * Open a database
     */

    public open(): Promise<void> {
        return new Promise((resolve) => {
            this.db.serialize(() => {
                resolve()
            })
        })
    }

    /**
     * Close a database
     */

    public close(): Promise<void> {
        return new Promise((resolve, reject) =>
            this.db.close((err) => {
                err ? reject(err) : resolve();
            }))
    }

    /**
     * SQLite3 Command Procesor
     * @param { string } command 
     * @param { any[] } params 
     */

    public run(command: string, params: any[] = []): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(command, params, (err) => {
                err ? reject(err) : resolve();
            })
        })
    }

    /**
     * Search a database
     * @param { string } query What to search for
     * @param { any[] } params 
     * @returns { T } Matches | undefined
     */

    public get<T>(query: string, params: any[] = []): Promise<T | undefined> {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row: T) => {
                err ? reject(err) : resolve(row);
            })
        })
    }

    /**
     * Search for all in a database
     * @param { string } query What to search for
     * @param { any[] } params 
     * @returns { T[] } Matches | undefined
     */
    
    public all<T>(query: string, params: any[] = []): Promise<T[] | undefined> {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows: T[]) => {
                err ? reject(err) : resolve(rows);
            })
        })
    }
}

/**
 * UUID Generation and DB Interface
 * @public
 */

export class protonUUID {
    generateClientId(): string {
        return uuid.v4();
    }

    /**
     * Check if user is in the database -- (database must already be open and will not be closed)
     * @param { protonDB } db - Database to search
     * @param { string } clientId - Client id to lookup
     * @returns { Boolean }
     */

    isClientInProtonDB(db: protonDB, clientId: string, ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await db.get('SELECT * FROM users WHERE uuid = ?', [clientId]) ? resolve(true) : reject()
        })
    }

    /**
     * Store new user id in the database -- (database must already be open and will not be closed)
     * @param { protonDB } db - Database to search 
     * @param { string } clientId - Client id to save 
     * @returns 
     */

    storeClientIdInProtonDB(db: protonDB, clientId: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await db.run('INSERT INTO users (uuid) VALUES (?)', [clientId])
            await this.isClientInProtonDB(db, clientId) == true ? resolve() : reject()
            
        })
    }
}


