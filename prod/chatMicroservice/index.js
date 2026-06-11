import {
  BillingMode,
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
  waitUntilTableExists,
  waitUntilTableNotExists,
} from "@aws-sdk/client-dynamodb";

/**
 * This module is a convenience library. It abstracts Amazon DynamoDB's data type
 * descriptors (such as S, N, B, and BOOL) by marshalling JavaScript objects into
 * AttributeValue shapes.
 */
import {
  BatchWriteCommand,
  BatchGetCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  paginateQuery,
  paginateScan,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const messagesTableName = "messages";

const messageCounterTableName = 'messageIdCounter';

async function dynamoResetMessages_DEBUG(){
  const deleteMessagesCmd = new DeleteTableCommand({
    TableName: messagesTableName,
  });

  const createMessagesCmd = new CreateTableCommand({
    TableName: messagesTableName,
    BillingMode:"PAY_PER_REQUEST",
    AttributeDefinitions: [
      {AttributeName: "id", AttributeType: "N"}
    ],
    KeySchema: [
      {AttributeName: "id", KeyType: "HASH"}
    ]
  });

  try {
    await client.send(deleteMessagesCmd);
    console.log("deleted messages table");
  } catch (error) {}

  console.log("waiting until message table deletes...");
  await waitUntilTableNotExists({
    client:client,
    maxDelay:30,
    minDelay:3
  },{
    TableName:messagesTableName
  });
  await client.send(createMessagesCmd);
  console.log("created new messages table");
  await dynamoMessageCounterReset();
  console.log("reset message counter");

  console.log("waiting until messages table creates...");
  await waitUntilTableExists({
    client:client,
    maxDelay:30,
    minDelay:3
  },{
    TableName:messagesTableName
  });
}

async function dynamoMessageCounterReset() {
  const putCommand = new PutCommand({
    TableName: messageCounterTableName,
    Item: {
      counterid:0,
      counterval:0
    }
  });
  const response = await client.send(putCommand);
  return response;
}

async function dynamoMessageCounterGetThenIncrement(){
  const updateCommand = new UpdateCommand({
    TableName: messageCounterTableName,
    Key: {counterid:0},
    
    UpdateExpression: "SET counterval = counterval + :incr",
    ExpressionAttributeValues:{":incr": 1},

    ReturnValues: "UPDATED_OLD",
  });
  const updateResponse = await client.send(updateCommand);
  const val = updateResponse.Attributes.counterval;
  // console.log("getthenincre",val);
  return val;
}

async function dynamoGetCounterId(){
  // get counterval from messageCounterTableName
  const getCommand = new GetCommand({
    TableName: messageCounterTableName,
    Key: {counterid:0}
  });
  const response = await client.send(getCommand);
  const item = response.Item.counterval;
  console.log("counterid",item);
  return item;
}

async function dynamoGetMessageFromId(id){
  const getCommand = new GetCommand({
      TableName: messagesTableName,
      Key: {
        id: id,
      },
    });
  const getResponse = await client.send(getCommand);
  const item = getResponse.Item;
  console.log(JSON.stringify(item));
  return item;
}

async function dynamoAddNewMessage(user, message){
  const messageId = await dynamoMessageCounterGetThenIncrement();
  // console.log("adding messageid", messageId);
  const updateCmd = new UpdateCommand({
    TableName: messagesTableName,
    Key: {
      id:messageId
    },
    UpdateExpression: "SET mTime = :a , mMessage = :b , mUser = :c",
    
    ExpressionAttributeValues: {
      ":a":Date.now(),
      ":b":message,
      ":c":user
    }
  });
  await client.send(updateCmd);
}

async function dynamoGetMessagesSlice(from, to){
  if(from==to)return {};
  var keys = [];
  for(var i=from;i<to;i++){
    keys.push({id:i});
  }
  const batchGetCmd = new BatchGetCommand({
    // TableName: messagesTableName,
    RequestItems: {
      [messagesTableName]: {
        Keys: keys
      }
    }
  });

  const response = await client.send(batchGetCmd);
  const values = response.Responses[messagesTableName];
  console.log("batchget",values.length,"messages");
  // console.log(JSON.stringify(values));
  return values;
}

await dynamoResetMessages_DEBUG();

import express from 'express';
import {WebSocketServer} from 'ws';

import { parseArgs } from 'node:util';

import cors from 'cors';

const options = {
  httport: { type: 'string', short: 'h' },
  wsport: { type: 'string', short: 'w' }
};

const { values, positionals } = parseArgs({ options });

// console.log('Parsed Flags:', values);
// console.log('Positional Args:', positionals);

const httpPORT = Number.parseInt(values.httport || "3000");
const webSocketPort = Number.parseInt(values.wsport || "3001");

const wss = new WebSocketServer(({port: webSocketPort}));
console.log("started web socket server");

const httpServer = express();

// Enable CORS for all routes and origins
httpServer.use(cors());

httpServer.get('/', (req, res) => {
  var count = 0;
  wss.clients.forEach((ws)=>{
    if(ws.readyState == WebSocket.OPEN)count++;
  });
  res.send(`${count}`);
});

httpServer.listen(httpPORT, (r) => {
  console.log(`Server running on http://localhost:${httpPORT}`);
});

var messagesState = {
  messages: [],

  desiredBackid:0,
  backid: 0,

  lastid: 0,
  updateCounter:0,
  init: ()=>{
    const testMessages = [
      "the chat gets deleted often",
      "its using dynamodb now >:)",
      "and you get a random name when chatting",
    ];
    for(const msg in testMessages){
      messagesState.addMessage("server", testMessages[msg]);
    }

    dynamoGetCounterId().then((lastId)=>{
      messagesState.lastid = Math.max(0, lastId-10);
      messagesState.backid = messagesState.lastid;
      
      messagesState.startPollUpdate();
    });

  },
  startPollUpdate: async () => {

    try{
      await messagesState.update();
    }catch(e){}

    setTimeout(messagesState.startPollUpdate,1000);
  },
  update: async () => {
    // handle back messages
    if(messagesState.desiredBackid < messagesState.backid){
      const newMessages = await dynamoGetMessagesSlice(messagesState.desiredBackid, messagesState.backid);

      const messagesSorted = newMessages;
      messagesSorted.sort((a,b)=>{return a.id-b.id});

      for(var i=0;i<messagesSorted.length;i++){
        messagesState.messages.unshift(messagesSorted[i]);
      }

      messagesState.backid = messagesState.desiredBackid;
    }

    // handle forward messages
    if(messagesState.updateCounter > 0){
      messagesState.updateCounter = messagesState.updateCounter - 1;

      const latestId = await dynamoGetCounterId();
      const currentId = messagesState.lastid;
      if(latestId > currentId){
        const newMessages = await dynamoGetMessagesSlice(currentId, latestId);

        const messagesSorted = newMessages;
        messagesSorted.sort((a,b)=>{return a.id-b.id});

        for(var i=0;i<messagesSorted.length;i++){
          messagesState.messages.push(messagesSorted[i]);
        }

        messagesState.lastid = latestId;
        console.log("updated new messages");
      }
    }
  },
  addMessage: (user, message) => {
    dynamoAddNewMessage(user, message);
    messagesState.updateCounter = 3;
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

    indexesPerStep: 10,

    chatCooldownSeconds: 2,
    lastSend: 0,

    heartbeat:0,
    
    oldBackIndex:0,
    oldForwardIndex:0,
    
    backIndex:0,
    forwardIndex:0,

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
      if(chatState.requestsOld && chatState.oldForwardIndex != 0){

        chatState.requestsOld = false;

        chatState.oldBackIndex = Math.max(chatState.oldBackIndex-chatState.indexesPerStep, 0);
        
        const slice = messagesState.slice(chatState.oldBackIndex, chatState.oldForwardIndex);

        chatState.oldForwardIndex = chatState.oldBackIndex;

        if(chatState.oldBackIndex < messagesState.backid){
          chatState.requestsOld = true;
          messagesState.desiredBackid = chatState.oldBackIndex;
        }

        return slice;
      }else{
        return [];
      }
    },
    updateHeartbeat: ()=>{
      chatState.heartbeat = Date.now();
    },
    updateCheckCooldown: () => {
      const now = Date.now();
      if(now - chatState.lastSend > chatState.chatCooldownSeconds*1000){
        chatState.lastSend = now;
        return true;
      }else{
        return false;
      }
    },
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
      console.log("sending message");
    }
  },1000);

  // Message event handler
  ws.on('message', (buffer) => {
    try{
      const msg = JSON.parse(buffer.toString());

      //dont keep printing requests if they already requested
      if(!(msg.requestsOld==true && chatState.requestsOld==true))
        console.log(`Received: ${JSON.stringify(msg)}`);

      if(msg.login){
        chatState.user = msg.login;
      }

      if(msg.sendMsg){
        const user = chatState.user;
        if(chatState.updateCheckCooldown()){
          messagesState.addMessage(user, msg.sendMsg.slice(0,90));
        }else{
          ws.send(JSON.stringify({error:"sending too fast"}));
        }
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