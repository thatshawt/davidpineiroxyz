import express from 'express';
import {WebSocketServer} from 'ws';

const httpPORT = 3000;
const webSocketPort = 3001;

const wss = new WebSocketServer(({port: webSocketPort}));
console.log("started web socket server");

const httpServer = express();
httpServer.get('/', (req, res) => {
  res.send(`${wss.clients.size}`);
});

httpServer.listen(httpPORT, () => {
  console.log(`Server running on http://localhost:${httpPORT}`);
});

var messagesState = {
  messages: [],
  lastid: 0,
  init: ()=>{
    const testMessages = ["this chat is experimental rn and all messages get deleted often so yea"];
    for(const msg in testMessages){
      messagesState.addMessage("server", testMessages[msg]);
    }
  },
  addMessage: (user, message) => {
    messagesState.messages.push({id:messagesState.lastid, user:user, message:message, time:Date.now()});
    messagesState.lastid++;
  },
  slice: (a, b) => {
    return messagesState.messages.slice(a,b);
  }
};

messagesState.init();

// Connection event handler
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  var chatState = {
    user:"anon",
    requestsOld:false,
    oldBackIndex:0,
    oldForwardIndex:0,
    backIndex:0,
    forwardIndex:0,
    indexesPerStep: 3,
    heartbeat:0,
    init: () => {
      chatState.forwardIndex = messagesState.messages.length;
      chatState.backIndex = Math.max(chatState.forwardIndex - chatState.indexesPerStep,0);

      chatState.oldBackIndex = chatState.backIndex;
      chatState.oldForwardIndex = chatState.backIndex;

      chatState.updateHeartbeat();
    },
    forwardStep: () => {
      chatState.forwardIndex = Math.min(chatState.forwardIndex+chatState.indexesPerStep, messagesState.messages.length);
      
      const slice = messagesState.slice(chatState.backIndex, chatState.forwardIndex);

      chatState.backIndex = chatState.forwardIndex;

      return slice;
    },
    backStep: () => {
      if(chatState.requestsOld){
        chatState.requestsOld = false;

        chatState.oldBackIndex = Math.max(chatState.oldBackIndex-chatState.indexesPerStep, 0);
        
        const slice = messagesState.slice(chatState.oldBackIndex, chatState.oldForwardIndex);

        chatState.oldForwardIndex = chatState.oldBackIndex;

        return slice;
      }else{
        return [];
      }
    },
    updateHeartbeat: ()=>{
      chatState.heartbeat = Date.now();
    }
  };

  chatState.init();

  const heartbeat = setInterval(()=>{

    // if heartbeat didnt happen for 1 minute disconnect client
    if(Date.now() - chatState.heartbeat > 60*1000){
      console.log("closed connection, stale heartbeat");
      ws.close(1000, 'heatbeat stale');
      return;
    }

    const forwardSlice = chatState.forwardStep();
    const oldSlice = chatState.backStep();
    if(forwardSlice.length > 0 || oldSlice.length > 0){
      ws.send(JSON.stringify({
        forwardSlice:forwardSlice,
        oldSlice:oldSlice
      }));
    }
  },1000);

  // Message event handler
  ws.on('message', (buffer) => {
    try{
      const msg = JSON.parse(buffer.toString());

      console.log(`Received: ${JSON.stringify(msg)}`);

      if(msg.login){
        chatState.user = msg.login;
      }

      if(msg.sendMsg){
        const user = chatState.user;
        messagesState.addMessage(user, msg.sendMsg);
      }

      if(msg.requestsOld==true){
        chatState.requestsOld = true;
      }

      if(msg.heartbeat==true){
        chatState.updateHeartbeat();
      }

    }catch(e){
      console.log(`error '${e}'`);
    }

  });

  // Close event handler
  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(heartbeat);
  });
}); 