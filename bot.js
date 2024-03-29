/*
	IRC Bot tested on ratbox irc servers (efnet)
*/
let net = require("net")

//SETTINGS
let setServer = "irc.prison.net"
let setPort = 6667
let setNick = "LE-61"
let channels = ["#lobo"]
let admins = ["178.232.172.134"]

const client = net.createConnection({
	port: setPort,
	host: setServer
})

client.on("connect",() =>
{
	console.log(`Connecting to ${setServer}:${setPort}`)

	client.write(`NICK ${setNick}\r\n`)
	client.write(`USER ${setNick} * * :mIRC v5.2\r\n`)
})

client.on("data",async (data) =>
{
	let dataList = data.toString().split("\r\n")

	for(let i = 0;i < dataList.length;dataList++)
	{
		let serverData = dataList[i].split(" ")

		if(serverData[0] == "PING")
		{
			client.write("PONG :" + serverData[1] + "\r\n")
		}
		else
		{
			receiveInfo(serverData)
		}
	}
})

client.on("end",() =>
{
	console.log("Disconnected, reconnecting..")

	reConnect()
})

client.on("error",(err) =>
{
	console.log("Error, reconnecting..")

	reConnect()
})

function receiveInfo(data)
{
	if(data[1] == "NOTICE")
	{
		notice(data[0].split("!")[0].split(":")[1],data[0].split("@")[1],data[3].split(":")[1],data[4])
	}
	else if(data[1] == "001")
	{
		for(let i = 0;i < channels.length;i++)
		{
			client.write(`JOIN ${channels[i]}\r\n`)
		}
	}
	else
	{
		return null
	}
}

function notice(nick,host,cmd,e)
{
	if(cmd == "!join")
	{
		for(let i = 0;i < admins.length;i++)
		{
			if(admins[i] == host)
			{
				client.write(`JOIN ${e}\r\n`)
			}
		}
	}
	else if(cmd == "!part")
	{
		for(let i = 0;i < admins.length;i++)
		{
			if(admins[i] == host)
			{
				client.write(`PART ${e}\r\n`)
			}
		}
	}
	else if(cmd == "!add")
	{
		for(let i = 0;i < admins.length;i++)
		{
			if(admins[i] == host)
			{
				admins.push(e)
			}
		}
	}
	else if(cmd == "!op")
	{
		for(let i = 0;i < admins.length;i++)
		{
			if(admins[i] == host)
			{
				client.write(`MODE ${e} +o-b ${nick} ${generateRandomString(6)}!*@*${generateRandomString(12)}==\r\n`)
			}
		}
	}
	else
	{
		return null
	}
}

function reConnect()
{
	client.connect(setPort,setServer)
}

function generateRandomString(length)
{
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    	let randomString = ''

    	for(let i = 0; i < length; i++)
	{
        	const randomIndex = Math.floor(Math.random() * characters.length)

        	randomString += characters[randomIndex]
    	}

    	return randomString
}
