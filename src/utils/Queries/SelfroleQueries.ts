import { ResultSetHeader } from "mysql2";
import Config from "../Config";
import Queries from "./Queries";
import { Selfrole } from "../Selfroles";

export default class SelfroleQueries extends Queries{
    /**
        * @returns whether the selfrole was saved successfully
    */
    async add(emoji: string, roleId: string, channelId: string, messageId: string): Promise<boolean> {
        if(!Config.database.required) {
            console.warn("SelfroleQueries.add: Database disabled. Cannot insert the selfrole.")
            return false
        }

        try {
            await this.pool.query(`INSERT INTO selfroles (emoji, roleId, channelId, messageId)
                            VALUES (?, ?, ?, ?)`,
                           [emoji, roleId, channelId, messageId])
        } catch(err) {
            console.warn("SelfroleQueries.add: Cannot insert the selfrole.")
            console.warn(err)
            return false
        }

        return true
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
        * @returns number of deleted selfroles
    */
    async remove(ids: number[]): Promise<number> {
        if(!Config.database.required) {
            console.warn("SelfroleQueries.remove: Database disabled. Cannot remove selfroles.")
            return 0
        }

        try {
            const [result] = await this.pool.query<ResultSetHeader>(`DELETE FROM selfroles
                                WHERE id IN (?)`,
                               [ids])
            return result.affectedRows
        } catch (err) {
            console.warn("SelfroleQueries.remove: Couldn't remove selfroles")
            console.warn(err)
            return 0 
        }
    }

    async removeAll(): Promise<number> {
        if(!Config.database.required) {
            console.warn("SelfroleQueries.removeAll: Database disabled. Cannot remove all selfroles.")
            return 0
        }

        try {
            const [result] = await this.pool.query<ResultSetHeader>(`DELETE FROM selfroles`)
            return result.affectedRows
        } catch (err) {
            console.warn("SelfroleQueries.removeAll: Couldn't remove all selfroles")
            console.warn(err)
            return 0
        }
    }
}
