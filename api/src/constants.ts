import dotenv from 'dotenv';
dotenv.config();

const origins = [
            `http://localhost:4000`,
            `http://localhost:4001`,
            `http://localhost:3000`
          ]

const routes = [
  '/xumm/ping',
  '/accounts/*',
  '/xumm/*',
  '/oracle/*'
]

const constants = {
    routes, 
    origins
}

export default constants
