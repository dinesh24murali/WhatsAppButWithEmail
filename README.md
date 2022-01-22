# chat_application

This project is a chat application similar to WhatsApp except with email instead of phone number.

These are the technologies used in the project

- FCM for firebase web push notifications
- Sending email with SendGrid
- Simple token based authendication
- MongoDB integration for Database
- [Bull](https://www.npmjs.com/package/bull) for handling tasks that take too long to run in the backend
- [Joi](https://www.npmjs.com/package/joi) for model schema validation in api server
- [socket.io](https://socket.io/) for socket server
- A seperate socket server to handle scalling. It uses a REDIS adaptor in case multiple nodes are added
- [Tailwind CSS](https://tailwindcss.com/) is used as the CSS framework for the project
- [Redux](https://redux.js.org/) for state management in frontend
- Tried integrating [node-cron](https://www.npmjs.com/package/node-cron) for periodic tasks