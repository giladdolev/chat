import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { atom, useRecoilState } from 'recoil';
import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import './chat.css';
import { chatEndPoint } from '../../Config';


const joinState = atom({
  key: "_join",
  default: '',
});
const roomState = atom({
  key: "_room",
  default: '',
});
const ENDPOINT = chatEndPoint();


let socket;

const Chat = () => {
  const [name, setName] = useRecoilState(joinState);
  const [room, setRoom] = useRecoilState(roomState);
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
      socket = io(ENDPOINT);
    //console.log(socket);
    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      // socket.emit('sendMessage', `${message}&&room&&${room}`, () => setMessage(''));
      socket.emit('sendMessage', `${message}`, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users} />
    </div>
  );
}

export default Chat;
