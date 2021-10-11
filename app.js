if(!process.argv[2]) return console.error(`\x1b[31m> \x1b[0mНеобходимо указать id/domain/link пользователя, на кого будет работать скрипт.\n\x1b[31m> \x1b[0mИспользование: node app.js <id/domain/link>`);
const { api, updates } = new (require('vk-io')).VK(require('./config.json'));

const templates = require("fs").readFileSync('templates.txt').toString().split("\n");

let typing = false, target;
updates.on("message_new", async ({id, peerId, send, conversationMessageId}) => {
    if(typing) return; // Если его текст уже в обработке, новые сообщения не принимаются (анти-флуд)

    const [message] = (await api.messages.getByConversationMessageId({conversation_message_ids: conversationMessageId, peer_id: peerId})).items; // Запрос сообщения, чтобы бот работал в ЛС (вк не даёт автора сообщения в ЛС)
    if(message.from_id !== target) return; else typing = true; // Проверка на то, является ли автор сообщения нашей жертвой

    await api.messages.markAsRead({peer_id: peerId, start_message_id: id}); // Читаем сообщение
    await sleep(2500); // Делаем вид что мы читаем его сообщение

    const template = templates[id%templates.length]; // Получаем строку из шаблонов
    await api.messages.setActivity({peer_id: peerId, type: "typing"}); // Включаем статус печати
    await sleep(Math.random()*2000+template.length*30); // Делаем вид что печатаем текст

    await api.messages.send({message: template, peer_id: peerId, random_id: 0, reply_to: peerId > 2e9 ? id : undefined}); // Отправляем шаблон
    typing = false; // Включаем приём новых сообщений от него
});

updates.start().then(async () => {
    target = (await require('vk-io').resolveResource({api, resource: process.argv[2]})).id;
    const [{first_name, last_name}] = await api.users.get({user_ids: target});

    console.log(`\x1b[32m> \x1b[0mБот был успешно запущен`);
    console.log(`\x1b[32m> \x1b[0mЦель: ${first_name} ${last_name}`);
});
async function sleep(ms) { return await new Promise((resolve) => setTimeout(resolve, ms)) }