import {Client, IntentsBitField} from 'discord.js'
import {Configuration, OpenAIApi} from "openai"
import {config} from 'dotenv'
config()

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

const teg = '-!'

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.GPT_API_KEY
}))

client.on('ready', (c) => {
    console.log(`${c.user.username} is Online`);
})

client.on('messageCreate', (message) => {
    if (message.content.includes(teg)) {
        openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{role: 'user', content: message.content.replace(teg, "")}]
        }).then(res => {
            console.log(message.content.replace(teg, ""))
            message.reply(res.data.choices[0].message.content)
        })
    }
})

client.login(process.env.DISCORD_API_KEY)
