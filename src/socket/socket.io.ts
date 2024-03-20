import { Server } from 'socket.io'

interface User {
    userId: string;
    socketId: string;
}


let users: User[] = []



export const SocketServer = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173'
        }
    })


    io.on("connection", (socket) => {

        // when connected
        console.log('A user is connected');
        // send message to the client we can use emit
        io.emit("welcome", "this is socket server")

        //add user to the array
        socket.on('addUser', (userId) => {
            addUser(userId, socket.id)
            io.emit('getUsers', users)
        })

        // send and get message
        socket.on('sendMessage',({senderId, receiverId, text}) =>{
            const user= getUser(receiverId)
            console.log('chat from sendmessage is',text,'----sender',senderId, '--reciever--',receiverId)
            io.to(user?.socketId).emit('getMessage',{
                senderId,
                text,
                createdAt: new Date().toISOString()
            })
            console.log('user array is', users)
            console.log('socket id of receiver',user?.socketId)
            console.log('socket id of sender------>',senderId);
            console.log('text or message=====', text);
        })
 
        // when disconnected
        socket.on("disconnect", () => {
            console.log('a user disconnected')
            removeUser(socket.id)
            io.emit('getUsers', users)
        })

    });

    const addUser = (userId: string, socketId: string) => {
        !users.some((user) => user.userId === userId) &&
            users.push({ userId, socketId })
    }

    const removeUser = (socketId: string) => {
        users = users.filter((user) => user.socketId !== socketId)
    }

    const getUser = (userId:string)=>{
        return users.find(user => user.userId == userId)
    }

    io.listen(3001)



    return io;
}




