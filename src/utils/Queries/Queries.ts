import { Pool } from "mysql2/promise";

export default abstract class Queries {
    public pool: Pool

    constructor(pool: Pool){
        this.pool = pool
    }
}
