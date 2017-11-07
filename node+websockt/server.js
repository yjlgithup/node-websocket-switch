var redis = require("redis");
var redis_config = {
    "host": "10.100.208.69",
    "port": 6379
};
client = redis.createClient(redis_config);//创建一个redis客户端
client.on('ready', function (req, res) {
    console.log('ready');
});
client.on("error", function (error) {
    console.log(error);
});


var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/', express.static('public'));
http.listen(8080);


//(1)socket部分

//var result = {
//    info: ""
//}
//var img = "";
//
//io.on('connection', function (socket) {
//    //接收并处理客户端的hi事件
//    socket.on('hi', function (data) {
//        GET();
//        function GET() {
//            client.lpop("image", function (err, data) {
//                if (data !== null) {
//                    img = "data:image/jpeg;base64,";
//                    result.info = "";
//                    result.info = img + data;
//                    socket.emit('c_hi', result)
//                } else {
//                    GET()
//                }
//            });
//        }
//    })
//    //断开事件
//    socket.on('disconnect', function (data) {
//        console.log('断开', data)
//        socket.emit('c_leave', '离开');
//    })
//});

//（2）socket部分

var result = {
    type:'',
    info:''
}
//监听连接事件
io.on('connection',function(socket){
    //接收来自客户端的hi事件
    socket.on('hi',function(data){
        //判断类型  返回数据
        switch(data.type){
            case "requestImage":
                GET();
                break;
        }
    });
    //接收并处理客户端的hi事件
    socket.emit('c_hi',{
        type:'connected',
        info:'已经连接'
    });
    //断开的事件、
    socket.on('disconnect', function (data) {
        console.log('已断开',data);
        socket.emit('c_hi', {
            type:'disconnect',
            info:"已断开"
        });
    })

    function GET(){
        setInterval(function(){

            client.lpop('image',function(err,data){
                if(data !== null){
                    console.log(new Date());
                    img = "data:image/jpeg;base64,";
                    result.type = 'imgs';
                    result.info = img + data;
                    socket.emit('c_hi',result);
                }
            })
        },10);
    }
})