import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { atom, useRecoilState } from 'recoil';
import './join.css';


const joinState = atom({
  key: "_join",
  default: '',
});
const roomState = atom({
  key: "_room",
  default: '',
});


export default function SignIn() {
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useRecoilState(joinState);
  const [room, setRoom] = useRecoilState(roomState);

  useEffect(() => {
    if (localStorage[`rooms`]) {
      setRooms(JSON.parse(localStorage.getItem("rooms")));
    }
  }, [])

  const onClick = () => {
    if (room && room !== '' && (!rooms || rooms.length === 0)) {
      localStorage.setItem("rooms", JSON.stringify([room]));
    } else if (!rooms.find(x => x === room) && room && room !== '') {
      let localSRooms = JSON.parse(localStorage.getItem("rooms"));
      localSRooms.push(room);
      localStorage.setItem("rooms", JSON.stringify(localSRooms));
    }
  }
  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Chat App</h1>
        <h1 className="heading1">Join/create  room</h1>
        <div>
          <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <input placeholder="Create room" className="joinInput margin-top-20" type="text" onChange={(event) => { setRoom(event.target.value) }} />
        </div>
        <div>
          {rooms && rooms.length > 0 ?
            <select name="rooms" id="rooms" className="joinInput margin-top-20" onChange={(event) => { setRoom(event.target.value) }}>
              <option className='room' value="select"  >Select room</option>
              {
                rooms.map((roomOfrooms, i) => (
                  <option className='room' value={roomOfrooms} key={i}>{roomOfrooms}</option>
                ))
              }

            </select>
            :
            null
          }
        </div>

        <Link onClick={onClick} to={`/chat?name=${name}&room=${room}`}>
          <button className={'button margin-top-20'} type="submit">Sign In</button>
        </Link>

      </div>
    </div>
  );
}

