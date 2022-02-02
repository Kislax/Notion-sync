const { parentPort } = require('worker_threads')
require('dotenv').config()
const { Telegraf } = require('telegraf');
const creatorChatTgId = process.env.CREATOR_CHAT_TG_ID

const menu = (prefix, ctx, ownerbot) => {
    return `●▬▬▬▬▬ஜ۩ஜ▬▬▬▬▬●`
}

const bot = new Telegraf(process.env.BOT_TOKEN, { username: 'NotionIntegrateBot' })

bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username
})

bot.start((ctx) => ctx.reply('Интеграции Notion? Это по нашему!'))
// bot.use(Telegraf.session())
bot.telegram.sendMessage(creatorChatTgId, "Бот вновь работает! Вновь работает")

const sendBotMess = (msg) => {
    console.log(msg)
    text = '\n '
    msg.forEach(e => {
        text = text + '\n' + e
    })
    bot.telegram.sendMessage(creatorChatTgId, "Содержание БД: " + text)
}



bot.command('show_db', (ctx) => {
    let chatId = ctx.chat.id
    let data = {
        type: 'show'
    }
    parentPort.postMessage(data)
})



bot.command('add_page', (ctx) => {
    let chatId = ctx.chat.id
    let data = {
        type: 'add'
    }
    console.log(ctx.chat.id)

    bot.telegram.sendMessage(chatId, "Напишите что вы хотите добавить")
    bot.on('message', (ctx) => {
        data.text = ctx.message.text
        parentPort.postMessage(data)
    })

})


// bot.telegram.sendMessage("427848755", menu(),
// {
//     reply_markup: {
//         inline_keyboard: [
//             [
//                 { text: 'Info👼🏻', callback_data: 'info'},
//                 { text: 'Docs📚', callback_data: 'menu'},
//                 { text: 'Ping🚀', callback_data: 'ping'}
//             ],
//             [
//                 { text: 'WhatsApp Bot🤖', url: 'wa.me/6287771818443'},

//             ]
//         ]
//     },
//     parse_mode: "Markdown",
//     disable_web_page_preview: "true" 
//     })

// bot.action('menu', (ctx) => {
//     ctx.deleteMessage()
//     sendMessageMenu(ctx)
// })

parentPort.on('message', msg => {
    console.log('пришло в ТГ')
    // console.log('sendBotMess', msg)
    let data = []
    msg.results.forEach(e => {
        data.push(" - " + e.properties.Name.title[0].plain_text)
    });
    sendBotMess(data)
    // console.log('id:', e.id)
    // console.log('property:', e.properties.Name.title)
    // console.log('property2:', e.properties.Column.multi_select)
    // sendBotMess(msg)
})
bot.launch()

