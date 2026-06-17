import { ExtendedClient } from "./structures/Client"
import { loadDisabledCommands } from "./utils/AvailableCommands"
import Database from "./utils/Database"

Database.connect()
loadDisabledCommands()
export const client = new ExtendedClient()

client.start()
