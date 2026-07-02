import { ResultSetHeader } from "mysql2";
import Config from "../Config";
import Queries from "./Queries";
import { Selfrole } from "../Selfroles";

export default class SelfroleQueries extends Queries{
    /**
        * @returns the new selfrole id, or null on failure
    */
    async add(emoji: string, roleId: string, channelId: string, messageId: string): Promise<number | null> {
        if(!Config.database.required) {
            console.warn("SelfroleQueries.add: Database disabled. Cannot insert the selfrole.")
            return null
        }

        try {
            const [result] = await this.pool.query<ResultSetHeader>(`INSERT INTO selfroles (emoji, roleId, channelId, messageId)
                            VALUES (?, ?, ?, ?)`,
                           [emoji, roleId, channelId, messageId])

            return result.insertId
        } catch(err) {
            console.warn("SelfroleQueries.add: Cannot insert the selfrole.")
            console.warn(err)
            return null
        }
    }

    async getAll(): Promise<Array<Selfrole>> {
        if(!Config.database.required) {
            console.warn("SelfroleQueries.getAll: Database disabled. Cannot get selfroles.")
            return new Array()
        }

        try {
            const [result] = await this.pool.query<Selfrole[]>(`SELECT * 
                                                               FROM selfroles`)
            return result
        } catch (err) {
            console.warn("SelfroleQueries.getAll: Couldn't get selfroles")
            console.warn(err)
            return new Array()
        }
    }

    async get(emoji: string, messageId: string): Promise<Selfrole[]> {
        if(!Config.database.required) {
            console.warn("SelfroleQueries.get: Database disabled. Cannot get selfroles.")
            return new Array()
        }

        try {
            const [result] = await this.pool.query<Selfrole[]>(`SELECT *
                                                               FROM selfroles
                                                               WHERE emoji = ?
                                                               AND messageId = ?`,
                                                              [emoji, messageId])
            return result
        } catch (err) {
            console.warn("SelfroleQueries.get: Couldn't get selfroles")
            console.warn(err)
            return new Array()
        }
    }
    
    /**
        * @returns deleted selfroles
    */
    async remove(ids: number[]): Promise<Selfrole[]> {
        if(!Config.database.required) {
            console.warn("SelfroleQueries.remove: Database disabled. Cannot remove selfroles.")
            return new Array()
        }

        try {
            const [result] = await this.pool.query<Selfrole[]>(`SELECT *
                                                               FROM selfroles
                                                               WHERE id in (?)`,
                                                               [ids])

            await this.pool.query(`DELETE FROM selfroles
                                  WHERE id IN (?)`,
                                  [ids])
            return result
        } catch (err) {
            console.warn("SelfroleQueries.remove: Couldn't remove selfroles")
            console.warn(err)
            return new Array()
        }
    }

    async removeAll(): Promise<Selfrole[]> {
        if(!Config.database.required) {
            console.warn("SelfroleQueries.removeAll: Database disabled. Cannot remove all selfroles.")
            return new Array()
        }

        try {
            const [result] = await this.pool.query<Selfrole[]>(`SELECT *
                                                               FROM selfroles`)

            await this.pool.query<ResultSetHeader>(`DELETE FROM selfroles`)
            return result
        } catch (err) {
            console.warn("SelfroleQueries.removeAll: Couldn't remove all selfroles")
            console.warn(err)
            return new Array()
        }
    }
}
