const { VK } = require('vk-io');
const config = require('./config.json');
const vk = new VK({token: config.token});
const ls_arr = require("fs").readFileSync('ls.txt').toString().split("\n");

let a = true;

if(!process.argv[2]) return console.error(`Вы не указали ID!\nnode app.js <id>`);

vk.updates.on('message_new', async (message) => {
	vk.api.messages.getByConversationMessageId({peer_id: message.peerId, conversation_message_ids: message.conversationMessageId}).then((result) => {
		if(result.from_id == process.argv[2] && a) {
			a = false;
			vk.api.messages.setActivity({peer_id: message.peerId, type: "typing"});
			setTimeout(() => {
				a = true;
				message.reply(ls_arr[Math.round(Math.random() * ls_arr.length-1)]);
			}, 3000);
		}	
	});
}).start();
