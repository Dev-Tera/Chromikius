import { Client, ClientEvents, Collection, GatewayIntentBits } from "discord.js";
import fs from "fs"
import { Event } from "./Event";
import Config from "../utils/Config";
import Command from "./Command";

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions
]

export class ExtendedClient extends Client {
    commands: Collection<string, Command> = new Collection()

    constructor() {
        super({ intents: intents })
    }

    start() {
        this.registerModules()
        this.login(Config.bot.token)
    }

    async registerModules() {
        //Commands
        const commandFiles = []
        commandFiles.push.apply(commandFiles, fs.readdirSync(`${__dirname}/../commands`).filter(file => file.endsWith('.ts')))
        commandFiles.push.apply(commandFiles, fs.readdirSync(`${__dirname}/../commands`).filter(file => file.endsWith('.js')))

        for (const file of commandFiles) {
            const command: Command = (await import(`${__dirname}/../commands/${file}`)).default
            this.commands.set(command.data.name, command)
        }

        //Events
        const eventFiles = []
        eventFiles.push.apply(eventFiles, fs.readdirSync(`${__dirname}/../events`).filter(file => file.endsWith('.ts')))
        eventFiles.push.apply(eventFiles, fs.readdirSync(`${__dirname}/../events`).filter(file => file.endsWith('.js')))

        for (const file of eventFiles) {
            const event: Event<keyof ClientEvents> = (await import(`${__dirname}/../events/${file}`)).default
            this.on(event.event, event.execute)
        }
    }
}
