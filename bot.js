const { parentPort } = require('worker_threads')
require('dotenv').config()
const { Telegraf } = require('telegraf');
const creatorChatTgId = process.env.CREATOR_CHAT_TG_ID

const bot = new Telegraf(process.env.BOT_TOKEN, { username: 'NotionIntegrateBot' })

bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username
})

bot.start((ctx) => ctx.reply('Интеграции Notion? Это по нашему!'))


const buttonsPanel = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'Содержимое', callback_data: 'show_db' },
                { text: 'Добавить', callback_data: 'add_page' },
                { text: 'Ничего', callback_data: 'config' }
            ],
        ]
    },
    parse_mode: "Markdown",
    disable_web_page_preview: "true"
}

bot.telegram.sendMessage(creatorChatTgId, 'Выберите что хотите сделать', buttonsPanel)


bot.action('show_db', (ctx) => {
    let chatId = ctx.chat.id
    let data = {
        type: 'show_db'
    }
    parentPort.postMessage(data)
})

bot.action('add_page', (ctx) => {
    let data = {
        type: 'add'
    }

    ctx.reply("Напишите что вы хотите добавить")
    bot.on('message', (ctx) => {
        data.text = ctx.message.text
        parentPort.postMessage(data)
    })

})



parentPort.on('message', msg => {
    console.log('пришло в ТГ')
    // console.log('sendBotMess', msg)
    let data = []
    msg.results.forEach(e => {
        data.push(" - " + e.properties.Name.title[0].plain_text)
    });
    sendBotMess(data)

})








const sendBotMess = (msg) => {
    console.log(msg)
    text = '\n '
    msg.forEach(e => {
        text = text + '\n' + e
    })
    bot.telegram.sendMessage(creatorChatTgId, "Содержание БД: " + text)
}


bot.launch()

