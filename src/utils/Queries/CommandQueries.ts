import { RowDataPacket } from "mysql2"
import Config from "../Config"
import Queries from "./Queries"

interface DisabledCommandRow extends RowDataPacket {
    name: string
}

export default class CommandQueries extends Queries{
    /**
        * @returns Number of disabled commands
    */
    async disable(commands: string[]) {
        if (!Config.database.required) {
            console.warn("CommandQueries.disable: Database disabled. Cannot disable command")
        }

        if (commands.length == 0) return

        try {
            await this.pool.query(`INSERT IGNORE INTO disabled_commands (name)
                                                                    VALUES ?`,
                                                                    [commands.map(name => [name])])
        } catch (err) {
            console.warn("CommandQueries.disabled: Couldn't disable command")
            console.warn(err)
        }
    }

    async getDisabled(): Promise<string[]> {
        if (!Config.database.required) {
            console.warn("CommandQueries.getDisabled: Database disabled. Cannot get disabled command")
            return new Array()
        }

        try {
            const [result] = await this.pool.query<DisabledCommandRow[]>(`SELECT name
                                                    FROM disabled_commands`)
            return result.map(row => row.name)
        } catch (err) {
            console.warn("CommandQueries.getDisabled: Couldn't get disabled commands")
            console.warn(err)
        }
    }

    /**
        * @returns Number of enabled commands
    */
    async enable(commands: string[]) {
        if (!Config.database.required) {
            console.warn("CommandQueries.enable: Database disabled. Cannot enable command")
        }

        if (commands.length == 0) return

        try {
            await this.pool.query(`DELETE FROM disabled_commands
                                                   WHERE name IN (?)`,
                                                   commands)
        } catch (err) {
            console.warn("CommandQueries.enable: Couldn't enable command")
            console.warn(err)
        }
    }
}
