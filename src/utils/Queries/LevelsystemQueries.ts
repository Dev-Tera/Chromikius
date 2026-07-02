import Config from "../Config";
import { LevelsystemMember } from "../Levelsystem";
import Queries from "./Queries";

export default class LevelsystemQueries extends Queries {
    async get(memberId: string): Promise<LevelsystemMember> {
        if(!Config.database.required) {
            console.warn("LevelsystemQueries.get: Database disabled. Cannot get member.")
            return {xp: 0, level: 0, rank: 0} as LevelsystemMember
        }

        try {
            const [result] = await this.pool.query<LevelsystemMember[]>(`SELECT xp, level, rank
                                                   FROM (SELECT memberId, xp, FLOOR(SQRT(xp)) AS level, ROW_NUMBER() OVER (ORDER BY xp DESC) AS rank FROM levelsystem) as ranked
                                                   WHERE memberId = ?`,
                                                  memberId)
            return result[0] ?? {xp: 0, level: 0, rank: 0} as LevelsystemMember
        } catch(err) {
            console.warn("LevelsystemQueries.get: Couldn't get member.")
            console.warn(err)
            return {xp: 0, level: 0, rank: 0} as LevelsystemMember
        }
    }

    /**
        * @returns whether the level has changed
    */
    async update(memberId: string, xp: number): Promise<boolean> {
        if(!Config.database.required) {
            console.warn("LevelsystemQueries.add: Database disabled. Cannot update xp.")
            return false
        }

        try {
            const [currentLevelsystemMembers] = await this.pool.query<LevelsystemMember[]>(`SELECT xp, FLOOR(SQRT(xp)) AS level, 0 AS rank
                    FROM levelsystem
                    WHERE memberId = ?`,
                    memberId)

            const [[newLevelsystemMember]] = await this.pool.query<LevelsystemMember[]>(`INSERT INTO levelsystem (memberId, xp)
                                  VALUES (?, ?)
                                  ON DUPLICATE KEY UPDATE xp = xp + VALUES(xp)
                                  RETURNING xp, FLOOR(SQRT(xp)) AS level, 0 AS rank`,
                                 [memberId, xp])

            if (currentLevelsystemMembers.length == 0) {
                return true
            } else {
                return currentLevelsystemMembers[0].level != newLevelsystemMember.level
            }
        } catch(err) {
            console.warn("LevelsystemQueries.add: Couldn't update xp")
            console.warn(err)
            return false
        }
    }
}
