import { RowDataPacket } from "mysql2/promise";

export interface LevelsystemMember extends RowDataPacket {
    xp: number,
    level: number,
    rank: number
}
