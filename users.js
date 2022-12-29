const users = [];
const rooms = [];
console.log(users);

const addUser = ({ id, name, room, create }) => {
  // name = name.trim().toLowerCase();
  // room = room.trim().toLowerCase();

  // const existuser = users.find(
  //   (user) => user.name === name && user.room === room
  // );
  // if (existuser) {
  //   return { error: "User already exists" };
  // }
  // const user = { id, name, room, create };
  // users.push(user);
  // if (create === "true") rooms.push({ name: room, id });
  // console.log(users);
  // return { user };
  return { error: "User already exists" };
};

const findAdmin = (room) => {
  const { id } = rooms.find((e) => {
    if (e.name === room) {
      return e.id;
    }
  });
  // console.log(id.id, 29);
  return id;
};

const removeUser = ({ id, room }) => {
  console.log("removeuser");
  const index = users.findIndex((user) => {
    return user.id === id;
  });
  if (!room) {
    const roomidx = rooms.findIndex((r) => {
      return r === users[index].room;
    });
    if (roomidx !== -1) {
      rooms.splice(roomidx, 1);
    }
  }
  const roomidx = rooms.findIndex((room) => {
    return room.id === id;
  });
  if (roomidx !== -1) {
    rooms.splice(roomidx, 1);
  }

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
const getUser = (id) => {
  return users.find((user) => user.id === id);
};

// const getUsersinroom = (room) => {
//   users.filter((user) => {
//     user.room === room;
//   });
// };
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  findAdmin,
  rooms,
  users,
};
