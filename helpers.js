const nodeMailer = require("nodemailer");

let users = [];

const validate = ({ name, email }) => {
  if (typeof name !== "string" || name.length < 3) {
    return { valid: false, message: "invalid name" };
  }

  if (!validateEmail(email) || !isEmailUnique(email)) {
    return { valid: false, message: "invalid or duplicate email" };
  }

  return { valid: true, message: "success" };
};

const isEmailUnique = (email) => {
  const foundUsers = users.filter((user) => user.email === email);
  if (foundUsers.length < 1) {
    return true;
  }
  return false;
};

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const getMessages = () => {
  return [
    {
      id: 1,
      message: "No one can ruin your day without YOUR permission",
    },
    {
      id: 2,
      message: "Most people will be about as happy, as they decide to be",
    },
    {
      id: 3,
      message: "Trying never hurt anyone",
    },
    {
      id: 4,
      message: "Best time to start was yesterday, second best time, NOW",
    },
    {
      id: 5,
      message: "The best way to escape your problem is to solve it",
    },
    {
      id: 6,
      message: "Happen to life so it does not happen to you ",
    },
    {
      id: 7,
      message: "Yesterday was the deadline for all complaints",
    },
    {
      id: 8,
      message: "Life is a journey not a destination. Enjoy the trip!",
    },
    {
      id: 9,
      message: "Your only benchmark is you",
    },
    {
      id: 10,
      message: "Look for opportunities…not guarantees",
    },
  ];
};

const getUnSentMessages = (sentIDs) => {
  return getMessages().filter((message) => !sentIDs.includes(message.id));
};

const randomMessage = (unSentMessages) => {
  return unSentMessages[Math.floor(Math.random() * unSentMessages.length)];
};

const scheduler = (fn, interval) => {
  let minutes = interval * 60 * 1000;
  let intervalRef = setInterval(function () {
    fn();
  }, minutes);
  return intervalRef;
};

const getAllUsers = () => {
  return users;
};

const addNewUser = (user) => {
  return users.push(user);
};

const editUserSentMessages = (id, messageID) => {
  let user = getUserByID(id);
  if (user) {
    let sentMessages = [...user.sentMessages, messageID];
    user = { ...user, sentMessages };
    updateUsers(user);
  } else {
    throw new Error("User not found");
  }
};

const updateUsers = (currentUser) => {
  users = users.filter((user) => user.id !== currentUser.id);
  users.push(currentUser);
};

const getUserByID = (id) => {
  return users.filter((user) => user.id === id)[0];
};

const runUserSchedule = () => {
  users.forEach((user) => {
    let unSentMessages = getUnSentMessages(user.sentMessages);
    let currentRandomMessage = randomMessage(unSentMessages);

    if (currentRandomMessage) {
      const { id, message } = currentRandomMessage;

      let mailSent = sendMail(user.name, user.email, message);
      if (mailSent) {
        editUserSentMessages(user.id, id);
      } else {
        console.log(
          `message to ${user.name} at ${user.email} failed, see logs for more`
        );
      }
    }
  });
};

const sendMail = async (name, to, message) => {
  let transporter = nodeMailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "e3c5f415ae0c8f",
      pass: "f861b1be6fcd9a",
    },
  });
  let mailOptions = {
    from: '"Abdur Raheem" <Abdul@raheem.com>',
    to,
    subject: `${name} you champ, Your Copenote has arrived`,
    text: message,
    html: `<b>${message}</b>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return false;
    }
    console.log("Message %s sent: %s", info.messageId, info.response);
    return true;
  });
};

module.exports = {
  getMessages,
  getUnSentMessages,
  randomMessage,
  scheduler,
  getAllUsers,
  editUserSentMessages,
  runUserSchedule,
  validate,
  addNewUser,
};
