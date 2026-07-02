import mysql, { Pool } from "mysql2/promise"
import SelfroleQueries from "./Queries/SelfroleQueries";
import LevelsystemQueries from "./Queries/LevelsystemQueries";
import CommandQueries from "./Queries/CommandQueries";
import Config from "./Config";
import { SelfroleStats } from "./Selfroles";

export default class Database {
    private static pool: Pool
    public static selfroles: SelfroleQueries;
    public static levelsystem: LevelsystemQueries
    public static commands: CommandQueries

    static async connect() {
       this.pool = mysql.createPool({
           host: Config.database.host,
           database: Config.database.databaseName,
           user: Config.database.userName,
           password: Config.database.password,
           waitForConnections: true,
           enableKeepAlive: true
       }) 

       try {
           const con = await this.pool.getConnection()
           con.release()
       } catch (err) {
            if (err instanceof AggregateError) {
                console.warn("Database refused connection")
            }
            throw err
       }

       this.selfroles = new SelfroleQueries(this.pool)
       this.levelsystem = new LevelsystemQueries(this.pool)
       this.commands = new CommandQueries(this.pool)
    }
}
