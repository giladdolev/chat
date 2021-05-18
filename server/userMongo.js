const users = [];

const addUser = ({ id, name, room, db }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if (!name || !room)
    return { error: 'Username and room are required.' };

  let dbo = db.db("mydb");
  let query = { name: name };

  dbo.collection("chat").find(query).toArray(function (err, result) {
    if (err) throw err;
    console.log(result);
    if (!result || result.length === 0) {

      let user = [
        { id: id, name: name, room: room }
      ];
      dbo.collection("chat").insertMany(user, function (err, res) {
        if (err) throw err;
        return { user };
      });
    }
    else
      return { error: 'Username is taken.' };
    db.close();
  });

  // dbo.collection("chat").find(query).toArray(function (err, result) {
  //   if (err) {
  //     return { error: 'Server error' };
  //   }
  //   console.log(result.name);
  //   if (!result || result.length === 0) {
  //     let user = [
  //       { id: id, name: name, room: room }
  //     ];
  //     dbo.collection("chat").insertMany(user, function (err, res) {
  //       if (err) throw err;
  //       console.log("insert new user  ");
  //     });
  //   } else
  //     return { error: 'Username is taken.' };
  //   db.close();
  //   return { user };
};

//saving at local servermemory 
// const existingUser = users.find((user) => user.room === room && user.name === name);
// if (!name || !room) return { error: 'Username and room are required.' };
// if (existingUser) return { error: 'Username is taken.' };
// const user = { id, name, room };
// users.push(user);


const removeUser = (id, db) => {
  let dbo = db.db("mydb");
  let query = { id: id };
  dbo.collection("chat").deleteOne(query, function (err, result) {
    if (err)
      throw err;
    db.close();
    dbo.collection("chat").find().toArray(function (err, result) {
      if (err)
        return { error: err };
      db.close();
      return result
    })
  });


  //saving at local servermemory 
  // const index = users.findIndex((user) => user.id === id);
  // if (index !== -1) return users.splice(index, 1)[0];
}

const usersInRoom = (room, db) => {
  let dbo = db.db("mydb");
  var query = { id: id };
  dbo.collection("chat").find(query).count();

  // const count = users.filter(item => item.room === room).length;
  return count;
}

const getUser = (id, db) => {
  let dbo = db.db("mydb");
  var query = { id: id };
  dbo.collection("chat").find(query).toArray(function (err, result) {
    if (err)
      return { error: err };
    db.close();
    return result
  });


  //saving at local servermemory 
  // users.find((user) => user.id === id);
}


const getUsers = (room, db) => {
  let dbo = db.db("mydb");
  var query = { room: room };
  dbo.collection("chat").find(query).toArray(function (err, result) {
    if (err)
      return { error: err };
    db.close();
    return result
  })
  //saving at local servermemory 
  //users.filter((user) => user.room === room);
}

module.exports = { addUser, removeUser, getUser, getUsers, usersInRoom };