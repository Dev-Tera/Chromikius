import { ExtendedClient } from "./structures/Client"
import Database from "./utils/Database"

Database.connect()
export const client = new ExtendedClient()

client.start()
