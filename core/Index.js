const { Worker } = require('worker_threads');
require('dotenv').config()
const { Client, APIErrorCode, LogLevel } = require("@notionhq/client")

const tgWorker = new Worker('./bot.js');

// Initializing a client
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const inboxDatabaseId = process.env.NOTION_INBOX_DB_ID


const addPage = async (title) => {
    try {
        const response = await notion.pages.create({
            parent: { database_id: inboxDatabaseId },
            properties: {
                title: {
                    title: [
                        {
                            "text": {
                                "content": title
                            }
                        }
                    ]
                }
            },
        })
        console.log(response)
        console.log("Success! Entry added.")
    } catch (error) {
        console.error(error.body)
    }
}

const showDatabase = async () => {
    try {
        const response = await notion.databases.query({
            database_id: inboxDatabaseId
        })
        // console.log(response.properties)
        tgWorker.postMessage(response)
    }
    catch (error) {
        console.log(error.body)
    }
}

const deleteBlock = async (blockId) => {
    try {
        const response = await notion.blocks.delete({
            block_id: blockId
        })
        console.log(response)
    }
    catch (error) {
        console.log(error.body)
    }
}

const search = async (searchText) => {
    const response = await notion.search({
        query: searchText,
        sort: {
            direction: 'ascending',
            timestamp: 'last_edited_time',
        },
    });
    console.log(response);
}

// addItem("Сяся маладец")
// showDatabase()
// deleteBlock()
tgWorker.on('message', msg => {
    console.log('message worker', msg)
    switch (msg.type) {
        case 'add': addPage(msg.text);
        case 'show': showDatabase()
    }
})