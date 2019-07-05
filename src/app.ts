import * as Koa from 'koa';
import * as json from 'koa-json';
import * as logger from 'koa-logger';
import * as bodyparser from 'koa-bodyparser';
import * as helmet from 'koa-helmet';
import * as koastatic from 'koa-static';
import * as config from './config';
import * as IO from 'socket.io';
import { Redis } from './store'


const onerror = require('koa-onerror');


const app = new Koa();
onerror(app);

const server = app.listen(config.listenport, () => {
    console.log(`Application running on port ${config.listenaddr}:${config.listenport}`);
});

const io = IO(server);

io.on('connection', (socket: any) => {

    socket.on('getData', async (msg: any) => {
        console.log(msg.seq);
        if (! msg.hasOwnProperty("seq") || ! msg.seq) {
            socket.emit('serverMsg', {"message": "Invalid sequence!"});
            return;
        }

        let seq = parseInt(msg.seq).toString();
        if (seq === "NaN") {
            socket.emit('serverMsg', {"message": "Invalid sequence!"});
            return;
        }

        let data = await Redis.get('data' + seq);
        data = JSON.parse(data);
        // console.log(data);
        socket.emit('serverMsg', data);

    });

    let i = 1;
    setInterval(async () => {
        let data = await Redis.get('data' + i);
        if (! data) {
            socket.emit('serverMsg', {"message": "No data!"});
            return;
        }
        data = JSON.parse(data);
        // console.log(data);
        socket.emit('serverMsg', data);
        i = i + 1;
    }, 5000);

    socket.emit('serverMsg', {"message": "fuck"});

});


app.use(bodyparser());
app.use(json());
app.use(helmet());
app.use(logger());

app.use(koastatic(__dirname+'/../static'));
