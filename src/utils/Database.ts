import mysql, { Connection } from "mysql"
import { Message } from "discord.js"
import { userLevelStats, userWarnStats } from "../types/stats"
import Config from "./Config";
import { SelfroleStats } from "./Selfroles";


export default class Database {
    private static db: Connection;

    static connect() {
        if (Config.database.required) {
            this.db = mysql.createConnection({
                host: Config.database.host,
                user: Config.database.userName,
                password: Config.database.password,
                database: Config.database.databaseName,
                charset: "utf8mb4"
            })

            this.db.connect()
        }
    }

    // Levelsystem

    static levelsystem_get_stats(member_id: string) {
        return new Promise<userLevelStats>((resolve, reject) => {
            if (!Config.database.required) reject(new Error("Although the database is disabled, a connection was required"))

            this.db.query(`SELECT * FROM levelsystem ORDER BY xp DESC`, (error, results, fields) => {
                if (error) throw error
                
                var rank: number = 1

                for (const user of results) {
                    if (user.id === member_id) {
                        const level: number = user.level
                        const xp: number = user.xp
                        resolve({ level, xp, rank })
                    }

                    rank += 1
                }

                resolve(undefined)
            })
        })
        
    }

    static levelsystem_register(member_id: string) {
        return new Promise<void>((resolve, reject) => {
            if (!Config.database.required) reject(new Error("Although the database is disabled, a connection was required"))

            this.db.query(`SELECT * FROM levelsystem WHERE id = ${member_id}`, (error, results, fields) => {
                if (error) throw error

                if (results.length === 0) {
                    this.db.query(`INSERT levelsystem (id, level, xp) VALUES (${member_id}, 1, 0)`, (error, results, fields) => {
                        if (error) throw error
                    
                        this.db.commit()
                        resolve()
                    })
                } else {
                    resolve()
                }
            })
        })
    }

    static async levelsystem_add_xp(member_id: string) {
        return new Promise<void>((resolve, reject) => {
            if (!Config.database.required) reject(new Error("Although the database is disabled, a connection was required"))

            this.db.query(`SELECT xp FROM levelsystem WHERE id = ${member_id}`, (error, results, fields) => {
                if (error) throw error

                const new_xp: number = results[0].xp + 1

                this.db.query(`UPDATE levelsystem SET xp = ${new_xp} WHERE id = ${member_id}`, (error, results, fields) => {
                    if (error) throw error

                    this.db.commit()
                    resolve()
                })
            })
        })
    }

    static levelsystem_level_up(member_id: string, message: Message) {
        return new Promise<void>((resolve, reject) => {
            if (!Config.database.required) reject(new Error("Although the database is disabled, a connection was required"))
            
            this.db.query(`SELECT * FROM levelsystem WHERE id = ${member_id}`, (error, results, fields) => {
                if (error) throw error

                if (results.length != 0) {
                    const xp = results[0].xp
                    const level = results[0].level

                    if (level != 1) {
                        if (xp > level * level) {
                            const new_level = level + 1

                            this.db.query(`UPDATE levelsystem set level = ${new_level} WHERE id = ${member_id}`, (error, results, fields) => {
                                if (error) throw error
                            })
                            
                            this.db.commit()
                            message.react("<:LevelUp:726876303319367751>").catch(error => { if (error.message !== "Reaction blocked") console.error(error) })
                            resolve()
                        }
                    } else {
                        if (xp > 2) {
                            const new_level = level + 1

                            this.db.query(`UPDATE levelsystem set level = ${new_level} WHERE id = ${member_id}`, (error, results, fields) => {
                                if (error) throw error
                            })
                            
                            this.db.commit()
                            message.react("<:LevelUp:726876303319367751>").catch(error => { if (error.message !== "Reaction blocked") console.error(error) })
                            resolve()
                        }
                    }
                }
            })
        })
        
    }

    static levelsystem_removexp(xp: number, level: number, member_id: string) {
        return new Promise<void>((resolve, reject) => {
            if (!Config.database.required) reject(new Error("Although the database is disabled, a connection was required"))
            
            this.db.query(`UPDATE levelsystem SET xp = ${xp}, level = ${level} WHERE id = ${member_id}`, (error, results, fields) => {
                if (error) throw error
                
                this.db.commit()
                resolve()
            })
        })
    }

    // Warnsystem
    static warnsystem_register(member_id) {
        return new Promise<void>((resolve, reject) => {
            if (!Config.database.required) reject(new Error("Although the database is disabled, a connection was required"))

            this.db.query(`SELECT * FROM warnsystem WHERE id = ${member_id}`, (error, results, fields) => {
                if (error) throw error

                if (results.length === 0) {
                    this.db.query(`INSERT warnsystem (id, warnlevel) VALUES (${member_id}, 0)`, (error, results, fields) => {
                        if (error) throw error
                    })

                    this.db.commit()
                    resolve()
                }
            })
        })
    }

    static warnsystem_add_warn(member_id) {
        return new Promise<void>((resolve, reject) => {
            if (!Config.database.required) reject(new Error("Although the database is disabled, a connection was required"))

            this.db.query(`SELECT warnlevel FROM warnsystem WHERE id = ${member_id}`, (error, results, fields) => {
                if (error) throw error

                const new_warnlevel: number = results[0].warnlevel + 1

                this.db.query(`UPDATE warnsystem SET warnlevel = ${new_warnlevel} WHERE id = ${member_id}`, (error, results, fields) => {
                    if (error) throw error
                })
                
                this.db.commit()
                resolve()
            })
        })
    }

    static warnsystem_get_stats(member_id) {
        return new Promise<userWarnStats>((resolve, reject) => {
            if (!Config.database.required) reject(new Error("Although the database is disabled, a connection was required"))

            this.db.query(`SELECT warnlevel FROM warnsystem WHERE id = ${member_id}`, (error, results, fields) => {
                if (error) throw error
                
                if (results.length != 0) {
                    var warnlevel = results[0].warnlevel
                    resolve(warnlevel)
                }

                resolve(undefined)
            })
        })
    }

    static warnsystem_clear_warnlevel(member_id) {
        return new Promise<void>((resolve, reject) => {
            if (!Config.database.required) reject(new Error("Although the database is disabled, a connection was required"))

            this.db.query(`DELETE FROM warnsystem WHERE id = ${member_id}`)
            this.db.commit()
            resolve()
        })
    }

    // Selfroles
    static selfrole_add(emoji: string, roleId: string, channelId: string, messageId: string) {
        return new Promise((resolve, reject) => {
            if (!Config.database.required) reject(new Error("Although the database is disabled, a connection was required"))

            var id = Date.now().toString()

            while (id.length < 20) {
                id += Math.floor(Math.random() * 10)
            }

            this.db.query(`INSERT INTO selfroles (id, emoji, roleId, channelId, messageId) VALUES (${id}, '${emoji}', ${roleId}, ${channelId}, ${messageId})`, (error, results, fields) => {
                if (error) throw error
            })
            
            this.db.commit()
            resolve(id)
        })
    }

    static selfrole_remove(id: number | string, reaction: boolean) {
        return new Promise<SelfroleStats
            | void>(async (resolve, reject) => {
            if (!Config.database.required) reject(new Error("Although the database is disabled, a connection was required"))

            if (reaction) {
                if (id === "all") {
                    this.db.query("DELETE FROM selfroles")
                    this.db.commit()
                    resolve()
                } else {
                    const selfrole = (await this.selfrole_getAll())[id] as SelfroleStats
                    this.db.query(`DELETE FROM selfroles WHERE id = ${selfrole.id}`)
                    this.db.commit()
                    resolve(selfrole)
                }
            } else {
                const selfrole = (await this.selfrole_getOne(id as string)) as SelfroleStats
                
                if (selfrole) {
                    this.db.query(`DELETE FROM selfroles WHERE id = ${id}`)
                    this.db.commit()
                }

                resolve(selfrole)
            }
        })
    }

    static selfrole_getAll() {
        return new Promise<Array<SelfroleStats> >((resolve, reject) => {
            if (!Config.database.required) reject(new Error("Although the database is disabled, a connection was required"))

            this.db.query("SELECT * FROM selfroles", (error, results, fields) => {
                if (error) throw error
                resolve(results)
            })
        })
    }

    static selfrole_getOne(id: string) {
        return new Promise<SelfroleStats>((resolve, reject) => {
            if (!Config.database.required) reject(new Error("Although the database is disabled, a connection was required"))

            this.db.query(`SELECT * FROM selfroles WHERE id = ${id}`, (error, results, fields) => {
                if (error) throw error
                
                if (results.length != 0) {
                    resolve(results[0])
                } else {
                    resolve(undefined)
                }
            })
        })
    }

    static selfrole_getAllByEmoji(emoji: string) {
        return new Promise<Array<SelfroleStats>>((resolve, reject) => {
            if (!Config.database.required) reject(new Error("Although the database is disabled, a connection was required"))

            this.db.query(`SELECT * FROM selfroles WHERE emoji = '${emoji}'`, (error, results, fields) => {
                if (error) throw error
                
                if (results.length != 0) {
                    resolve(results)
                } else {
                    resolve(undefined)
                }
            })
        })
    }

    // Enable / Disable Commands
    static enableCommand(commandName) {
        return new Promise<true | false>((resolve, reject) => {
            if (!Config.database.required) reject(new Error("Although the database is disabled, a connection was required"))

            this.db.query(`SELECT * FROM deactivatedCommands WHERE name = '${commandName}'`, (error, results, fields) => {
                if (error) throw error

                if (results.length != 0) {
                    this.db.query(`DELETE FROM deactivatedCommands WHERE name = '${commandName}'`)
                    this.db.commit()
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        })
    }

    static disableCommand(commandName) {
        return new Promise<true | false>((resolve, reject) => {
            if (!Config.database.required) reject(new Error("Although the database is disabled, a connection was required"))

            this.db.query(`SELECT * FROM deactivatedCommands WHERE name = '${commandName}'`, (error, results, fields) => {
                if (error) throw error

                
                if (results.length === 0) {
                    this.db.query(`INSERT INTO deactivatedCommands (name) VALUES ('${commandName}')`)
                    this.db.commit()
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        })
    }

    static getDisabledCommands() {
        return new Promise<Array<string> | undefined>((resolve, reject) => {
            if (!Config.database.required) reject(new Error("Although the database is disabled, a connection was required"))

            this.db.query("SELECT * FROM deactivatedCommands", (error, results, fields) => {
                if (error) throw error

                if (results.length != 0) {
                    const disabledCommands = []

                    for (var command of results) {
                        disabledCommands.push(command.name)
                    }

                    resolve(disabledCommands)
                } else {
                    resolve(undefined)
                }
            })
        })
    }
}
