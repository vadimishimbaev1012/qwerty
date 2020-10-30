const { VK } = require('vk-io');
const config = require('./config.json');
const vk = new VK({token: config.token});
const ls_arr = require("fs").readFileSync('ls.txt').toString().split("\n");
vk.updates.on('message_new', async (message) => {
	if(message.senderId == config.id && message.chatId != 0) message.reply(ls_arr[Math.round(Math.random() * ls_arr.length-1)]);
}).start();
