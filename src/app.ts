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

    socket.on('getData', async (msg: string) => {
        console.log(msg);
        let data = await Redis.get('data1');
        data = JSON.parse(data);
        console.log(data);
        socket.emit('serverMsg', data);

    });

    socket.emit('serverMsg', 'fuck');

});


app.use(bodyparser());
app.use(json());
app.use(helmet());
app.use(logger());

app.use(koastatic(__dirname+'/../static'));
