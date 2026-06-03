// @ts-nocheck
import { useRef, useState, useEffect } from 'react';
import ChatStyles from './chat.module.css'

type ChatMessage = {
  id:number;
  user:string;
  message:string;
  time:number;
};

type ChatPacket = {
  forwardSlice?:Array<ChatMessage>;
  oldSlice?:Array<ChatMessage>;
};

type ChatMessagesMap = Map<number, ChatMessage>;

export default function ChatBox(){
  const wsUri = "ws://127.0.0.1:3001";

  const webSocketRef = useRef(null as unknown as WebSocket);

  const [opened, setOpened] = useState(false);

  // const chatInputId = useId();
  const chatInputRef = useRef(null as unknown as HTMLInputElement);

  const [messages, setMessages] = useState(new Map() as ChatMessagesMap);

  const followChatRef = useRef(true);
  const chatLogsRef = useRef(null);
  
  const requestOldRef = useRef(false);

  const scrollResumePos = useRef(0);

  function sendWebsocketIfOpen(data){
    const websocket:WebSocket = webSocketRef.current;
    if(websocket && websocket.readyState==WebSocket.OPEN){
      websocket.send(data);
    }
  }

  function sendChatWebsocket(message:string){
    sendWebsocketIfOpen(JSON.stringify({
      sendMsg: message
    }));
  }

  function sendRequestOld(){
    if(messages.get(0))return;
    sendWebsocketIfOpen(JSON.stringify({
      requestsOld: true
    }));
    // console.log("sent request old");
  }

  function sendHeartbeat(){
    sendWebsocketIfOpen(JSON.stringify({
      heartbeat: true
    }));
    // console.log("sent request old");
  }

  function loginChat(user:string){
    sendWebsocketIfOpen(JSON.stringify({
      login:user
    }));
  }

  function closeOpenSocket(socket){
    // if(websocket){
    console.log("called close socket");
    if(socket){
      socket.close();
      socket.onopen = () => {
        socket.close();
      };
      socket.onmessage = () => {
        socket.close();
      };
      webSocketRef.current = null;
      return;
    }
    
  }

  function sendChatUI(){
    // var chatInputEl = getChatInputEl();
    var chatInputEl = chatInputRef.current;
    if(!chatInputEl)return;
    if(chatInputEl.value == "")return;
    console.log("send chat");
    sendChatWebsocket(chatInputEl.value);
    chatInputEl.value = "";
  }

  function updateRequestsOldRef(){
    const chatLogsEl:HTMLDivElement = chatLogsRef.current;
    if(
      // chatLogsEl.scrollHeight > chatLogsEl.clientHeight &&
      chatLogsEl &&
      chatLogsEl.scrollTop < 3){
        requestOldRef.current = true;
        chatLogsEl.scrollTop = 5;
        // console.log("set requested old true");
      }
  }

  function toggleChat(){
    setOpened((isOpen)=>{
      if(isOpen){//close the chat
        const chatLogsEl:HTMLDivElement = chatLogsRef.current;
        scrollResumePos.current = chatLogsEl.scrollTop;
        return false;
      }else{//open the chat
        return true;
      }
    });
  }

  useEffect(()=>{
    if(!opened)return;
    const chatLogsEl:HTMLDivElement = chatLogsRef.current;
    if(followChatRef.current==true)
        chatLogsEl.scrollTop = chatLogsEl.scrollHeight;
    else
        chatLogsEl.scrollTop = scrollResumePos.current;
  },[opened]);

  useEffect(()=>{
    // if(window.chat)return;
    // window.chat = true;
    console.log("chat init");

    // closeOpenSocket();
    const websocket:WebSocket = webSocketRef.current;
    if(!websocket){
      var newsocket = new WebSocket(wsUri);

      newsocket.onopen = () => {
        // console.log("CONNECTED");
        loginChat("skibidiah jr");
        // sendChatWebsocket("ping");
        // console.log(`SENT: ping`);
      };

      newsocket.onmessage = (e) => {
        const msgPacket:ChatPacket = JSON.parse(e.data);
        // console.log(`RECEIVED: ${JSON.stringify(msgPacket)}`);
        setMessages((oldMsgs)=>{
          if(
            (!msgPacket.forwardSlice && !msgPacket.oldSlice)
            || (msgPacket.forwardSlice && msgPacket.forwardSlice.length == 0 && msgPacket.oldSlice && msgPacket.oldSlice.length == 0)
          )
            return oldMsgs;

          var newChatMap:ChatMessagesMap = new Map(oldMsgs.entries());

          if(msgPacket.forwardSlice){
            for(const msgid_ in msgPacket.forwardSlice){
              const msg:ChatMessage = msgPacket.forwardSlice[msgid_];
              newChatMap.set(msg.id, msg);
            }
          }

          if(msgPacket.oldSlice){
            for(const msgid_ in msgPacket.oldSlice){
              const msg:ChatMessage = msgPacket.oldSlice[msgid_];
              newChatMap.set(msg.id, msg);
            }
          }

          return newChatMap;
        });
      };

      // console.log("new soket", newsocket);

      webSocketRef.current = newsocket;
    }

    // console.log("started heartbeat");
    const requestsOldInterval = setInterval(()=>{
      // console.log("heartbeat");
      if(requestOldRef.current==true){
        sendRequestOld();
        requestOldRef.current = false;

        // const chatLogsEl:HTMLDivElement = chatLogsRef.current;
      }
      updateRequestsOldRef();
    },500);

    const heartbeatInterval = setInterval(sendHeartbeat,5000);

    return () => {
      clearInterval(requestsOldInterval);
      clearInterval(heartbeatInterval);

      const websocket:WebSocket = webSocketRef.current;
      closeOpenSocket(websocket);
    };

  },[]);

  function getSortedMessages(){
    const messagesSorted = Array.from(messages.values());
    messagesSorted.sort((a,b)=>{return a.id-b.id});
    return messagesSorted;
  }

  useEffect(()=>{
    const chatLogsEl:HTMLDivElement = chatLogsRef.current;
    const followChat = followChatRef.current;
    if(!chatLogsEl)return;
    if(chatLogsEl && followChat == true){
      chatLogsEl.scrollTop = chatLogsEl.scrollHeight;
      // console.log("scrolled");
    }else if(chatLogsEl.scrollTop < 2){
      chatLogsEl.scrollTop = 3;
    }
  },[messages]);
  
  if(opened){
    return (
    <div className={`${ChatStyles.chatContainer} ${ChatStyles.openedChat}`}>
      <div ref={chatLogsRef} className={ChatStyles.chatLogs}
        onScroll={()=>{
          const chatLogsEl:HTMLDivElement = chatLogsRef.current;
          if(chatLogsEl){
            // const scrollTop = chatLogsEl.scrollTop;
            const currentFollow = followChatRef.current;
            const scrollTopPos = chatLogsEl.scrollHeight - chatLogsEl.clientHeight - chatLogsEl.scrollTop;

            // enable/disable follow chat
            if(currentFollow==false && (scrollTopPos < 10)){
              followChatRef.current = true;
              console.log("following now");
            }else if(currentFollow==true && (scrollTopPos > 10)){
              followChatRef.current = false;
              console.log("not following anymore");
            }

            // request old when scroll up far enough
            updateRequestsOldRef();
          }
        }}
      >
          {getSortedMessages().map((msg:ChatMessage)=>(
            <div key={msg.id}>
              <span style={{color:'black'}}>{msg.user}</span>
              <span style={{color:'lime'}}>~</span>
              <span style={{color:'white'}}>{msg.message}</span>
              <br/>
              <span style={{color:'#1f333f',fontSize:'20px'}}>#{msg.id}, </span>
              <span style={{color:'#003d15',fontSize:'20px'}}>{new Date(msg.time).toLocaleString()}</span>
            </div>
          ))}
      </div>

      <div className={ChatStyles.chatInputDiv}>
        <input ref={chatInputRef} type="text" minLength={1} maxLength={90}
          onKeyDown={(e)=>{
            if(e.key === "Enter")sendChatUI();
          }}/>
        <button onClick={sendChatUI}>send</button>
      </div>

      <a onClick={toggleChat}>Close Chat</a>
    </div>);
  }else{
    return (
      <div className={`${ChatStyles.chatContainer} ${ChatStyles.closedChat}`}>
        <a onClick={toggleChat}>Chat</a>
      </div>);
  }
}

