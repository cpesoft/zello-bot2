import * as _ from 'lodash';
import * as WebSocket from 'ws';

var isFirstChannelStatus: boolean = true;

const logon = {
    "command": "logon",
    "seq": 1,
    "auth_token": process.env.auth_token,
    "username": process.env.zello_user,
    "password": process.env.zello_pass,
    "channel": process.env.zello_channel
};

const startStream = {
    "command": "start_stream",
    "seq": 2,
    "type": "audio",
    "codec": "opus",
    "codec_header": "gD4BPA==",
    "packet_duration": 200
};

const encodedBuffers = [
    [88, 1, 242, 94, 114, 54, 146, 28, 217, 32, 18, 72, 135, 121, 24, 0, 129, 104, 229, 180, 250, 158, 160, 180, 176, 152, 40, 87, 126, 50, 226, 234, 30, 112, 154, 119, 32, 168, 10, 138, 124, 192],
    [88, 2, 104, 146, 166, 145, 200, 23, 85, 73, 209, 89, 45, 162, 134, 247, 148, 108, 171, 58, 71, 113, 224, 115, 101, 235, 207, 167, 143, 254, 189, 65, 248, 251, 39, 139, 7, 12, 120, 162, 136, 93, 3, 217, 45, 59, 104, 183, 141, 198, 88],
    [88, 225, 133, 148, 11, 113, 79, 203, 245, 33, 23, 1, 111, 242, 127, 166, 124, 77, 80, 206, 201, 4, 46, 120, 172, 180, 198, 175, 214, 17, 158, 107, 38, 208, 157, 86, 106, 116, 157, 134, 67, 11, 67, 72, 66, 63, 148, 57, 223, 187, 160, 221, 189, 230, 146, 206, 101, 105, 170, 212, 130, 69, 185, 2, 150, 40, 34, 137, 103, 191, 231, 179, 210, 132, 250, 175, 190, 8, 86, 238, 133, 49, 179, 160, 232, 74, 216, 48, 151, 87, 138, 236, 2, 42, 158, 8, 250, 0, 82, 18, 235, 250, 197, 1, 1, 16],
    [88, 224, 69, 167, 149, 13, 204, 234, 144, 144, 140, 254, 76, 137, 65, 254, 48, 203, 168, 66, 102, 124, 25, 19, 73, 4, 35, 133, 154, 101, 172, 9, 5, 35, 71, 31, 53, 134, 49, 79, 211, 203, 88, 143, 204, 58, 212, 142, 111, 26, 122, 216, 110, 191, 247, 29, 222, 248, 223, 109, 211, 97, 5, 80, 124, 190, 230, 85, 117, 108, 115, 228, 137, 178, 247, 25, 137, 64, 249, 155, 211, 213, 1, 117, 204, 0, 50, 88, 105, 166, 68, 190, 37, 213, 77, 207, 207, 196, 212, 52, 63, 154, 120, 136, 18, 21, 13, 36, 234, 96, 169, 137, 161, 71, 57, 108, 38, 96, 188, 88, 19, 187, 203, 253, 239, 30, 68, 87, 80, 77, 42, 54, 224, 87, 140, 126, 45, 223, 55, 106, 137, 139, 176, 226, 100, 96, 112],
    [88, 236, 166, 117, 201, 148, 178, 114, 149, 52, 65, 96, 94, 129, 37, 16, 40, 197, 207, 98, 221, 81, 178, 25, 221, 211, 28, 50, 18, 162, 38, 31, 120, 114, 16, 114, 192, 153, 80, 239, 26, 79, 146, 40, 186, 35, 38, 143, 43, 232, 123, 207, 70, 90, 11, 17, 204, 43, 81, 241, 194, 147, 104, 24, 121, 151, 21, 229, 173, 12, 30, 64, 1, 186, 203, 243, 152, 29, 67, 59, 209, 172, 141, 84, 150, 226, 117, 178, 9, 59, 35, 38, 167, 141, 132, 178, 213, 117, 65, 245, 154, 52, 100, 103, 82, 213, 172, 10, 221, 24, 111, 31, 65, 157, 133, 141, 19, 211, 234, 44, 77, 68, 88, 13, 108, 69, 109, 120, 229, 203, 139, 202, 188, 122, 61, 139, 245, 17, 65, 49, 142, 195, 10],
    [88, 237, 139, 57, 111, 18, 88, 241, 88, 247, 24, 247, 97, 218, 121, 26, 205, 63, 118, 201, 29, 184, 28, 193, 210, 1, 45, 252, 20, 55, 245, 24, 199, 84, 83, 234, 189, 138, 107, 74, 236, 207, 77, 231, 202, 0, 33, 4, 225, 225, 67, 116, 143, 217, 239, 209, 226, 90, 36, 249, 112, 105, 32, 183, 252, 119, 155, 84, 38, 212, 224, 93, 231, 133, 126, 6, 126, 255, 133, 86, 101, 157, 207, 191, 40, 216, 10, 118, 18, 101, 12, 91, 92, 28, 73, 106, 193, 160, 126, 143, 60, 18, 211, 72, 81, 166, 148, 80, 192, 134, 209, 83, 115, 85, 254, 105, 19, 59, 156, 9, 3, 88, 16, 76, 181, 160, 38, 134, 155, 15, 77, 246, 237, 65, 196, 137, 183, 200, 62, 210, 16],
    [88, 236, 243, 225, 74, 18, 11, 46, 42, 245, 198, 199, 14, 228, 166, 70, 108, 195, 97, 141, 237, 67, 9, 54, 91, 158, 43, 92, 168, 31, 121, 149, 179, 248, 80, 106, 108, 198, 252, 21, 31, 246, 175, 234, 108, 49, 215, 233, 238, 168, 252, 248, 144, 181, 36, 233, 248, 48, 212, 164, 139, 13, 24, 216, 52, 161, 49, 98, 61, 208, 111, 115, 10, 152, 46, 142, 216, 49, 159, 88, 179, 113, 142, 213, 45, 16, 136, 98, 237, 164, 107, 106, 149, 154, 116, 177, 131, 53, 224, 237, 39, 125, 45, 220, 110, 141, 121, 29, 100, 18, 230, 74, 181, 3, 14, 159, 149, 40, 205, 248, 104, 111, 169, 34, 255, 130, 160],
    [88, 235, 132, 39, 124, 255, 126, 206, 63, 215, 134, 116, 18, 23, 143, 22, 18, 205, 241, 88, 217, 27, 43, 255, 83, 1, 184, 48, 25, 84, 83, 26, 171, 248, 163, 205, 27, 162, 56, 133, 121, 4, 52, 45, 29, 190, 1, 186, 25, 92, 151, 47, 124, 217, 234, 248, 231, 222, 212, 201, 164, 167, 32, 93, 119, 164, 189, 37, 87, 105, 228, 52, 114, 70, 25, 123, 113, 207, 59, 83, 145, 128, 36, 142, 141, 68, 6, 210, 104, 25, 1, 48, 169, 62, 142, 72, 213, 56, 26, 191, 82, 25, 140, 45, 190, 164, 246, 214, 214, 182, 73, 171, 168, 182, 221, 55, 203, 192, 38, 167, 218, 42, 30, 204, 92, 74, 145, 23, 152, 12, 146, 40, 161, 63, 141, 186, 91, 65, 157],
    [88, 234, 64, 102, 12, 194, 175, 230, 190, 186, 205, 253, 1, 183, 73, 136, 82, 43, 24, 247, 0, 239, 84, 103, 66, 190, 166, 141, 94, 233, 241, 247, 41, 90, 155, 149, 8, 245, 163, 185, 30, 26, 49, 125, 249, 160, 78, 95, 47, 190, 106, 28, 171, 224, 186, 112, 161, 96, 139, 62, 95, 82, 229, 247, 177, 30, 186, 41, 224, 244, 238, 190, 217, 116, 121, 253, 17, 0, 220, 213, 202, 0, 236, 71, 104, 79, 241, 147, 227, 16, 114, 208, 131, 155, 233, 248, 230, 103, 42, 179, 144, 89, 18, 155, 171, 62, 156, 147, 84, 2, 173, 146, 239, 204, 88, 32, 49, 73, 61, 9, 43, 73, 227, 90, 122, 169, 209, 233, 216, 188, 74, 65, 54, 230, 1, 84, 242, 254, 235, 236, 96, 224],
    [88, 236, 255, 150, 112, 156, 1, 139, 0, 137, 142, 227, 3, 117, 170, 100, 188, 26, 75, 16, 43, 139, 226, 20, 242, 228, 3, 76, 184, 171, 248, 28, 19, 254, 230, 11, 193, 85, 94, 104, 172, 16, 189, 213, 146, 51, 146, 151, 119, 3, 74, 111, 116, 84, 32, 20, 222, 79, 154, 97, 168, 7, 55, 242, 159, 75, 168, 159, 249, 16, 178, 149, 60, 51, 12, 225, 190, 47, 75, 81, 254, 202, 57, 233, 12, 17, 105, 70, 69, 9, 174, 17, 219, 124, 238, 109, 85, 116, 113, 97, 21, 12, 131, 223, 210, 167, 47, 242, 190, 195, 235, 208, 78, 44, 199, 198, 146, 237, 188, 192],
    [88, 236, 92, 133, 67, 66, 59, 222, 43, 100, 83, 158, 151, 232, 102, 209, 102, 72, 52, 231, 78, 55, 12, 188, 56, 17, 179, 99, 46, 90, 153, 240, 113, 103, 53, 47, 127, 117, 209, 140, 132, 76, 213, 95, 246, 227, 42, 126, 50, 17, 156, 228, 5, 212, 135, 128, 54, 68, 151, 142, 235, 212, 135, 125, 149, 86, 181, 33, 81, 239, 154, 99, 118, 218, 135, 236, 220, 25, 142, 118, 119, 140, 241, 222, 144, 95, 150, 75, 229, 34, 201, 240, 138, 112, 14, 159, 89, 45, 170, 14, 80, 254, 108, 222, 195, 66, 77, 56, 173, 227, 99, 107, 239, 113, 253, 209, 38, 168, 158, 173, 142, 61, 206, 94, 159, 44, 41, 52, 7, 104, 32],
    [88, 234, 205, 249, 182, 249, 112, 161, 216, 222, 58, 231, 239, 157, 223, 223, 164, 6, 60, 68, 31, 173, 48, 23, 205, 235, 161, 246, 86, 89, 213, 125, 49, 67, 69, 120, 9, 229, 25, 95, 56, 50, 65, 242, 255, 205, 227, 210, 102, 138, 102, 106, 43, 28, 149, 58, 0, 90, 183, 50, 124, 31, 14, 5, 90, 114, 12, 162, 52, 23, 11, 3, 236, 51, 85, 127, 133, 244, 12, 140, 46, 184, 122, 76, 183, 71, 45, 124, 56, 179, 212, 213, 124, 217, 109, 84, 76, 0, 149, 72, 184, 202, 12, 222, 118, 138, 108, 126, 1, 6, 205, 176, 35, 230, 57, 102, 232, 74, 207, 9, 218, 42, 233, 252, 102, 194, 113, 110, 19, 25, 54, 242, 38, 24],
    [88, 237, 170, 30, 87, 40, 46, 37, 236, 10, 133, 217, 180, 203, 66, 212, 180, 240, 199, 128, 88, 171, 219, 223, 118, 169, 35, 176, 139, 192, 83, 161, 206, 14, 211, 33, 202, 10, 179, 179, 255, 35, 72, 188, 110, 230, 94, 167, 29, 64, 138, 59, 137, 209, 144, 129, 222, 214, 230, 236, 31, 185, 190, 169, 218, 134, 77, 209, 3, 113, 128, 151, 66, 131, 120, 220, 223, 163, 91, 213, 1, 249, 138, 81, 151, 61, 214, 126, 53, 86, 57, 233, 31, 213, 8, 18, 24, 183, 113, 82, 109, 155, 188, 247, 253, 77, 196, 42, 111, 179, 224, 221, 26, 166, 231, 244, 211, 167, 175, 62, 210, 199, 224],
    [88, 238, 52, 216, 85, 14, 25, 155, 71, 210, 82, 240, 231, 91, 91, 73, 230, 79, 15, 128, 209, 32, 150, 186, 91, 180, 100, 119, 33, 83, 152, 91, 120, 226, 142, 226, 117, 239, 162, 6, 187, 125, 21, 122, 133, 229, 23, 246, 74, 34, 249, 122, 65, 78, 154, 42, 127, 131, 64, 65, 108, 150, 5, 255, 209, 97, 78, 53, 254, 94, 190, 143, 99, 105, 189, 183, 124, 108, 241, 227, 76, 97, 177, 173, 31, 219, 129, 244, 19, 132, 191, 230, 2, 120, 45, 48, 111, 35, 201, 180, 167, 125, 248, 202, 108, 26, 228, 120, 9, 173, 224, 220, 160],
    [88, 238, 250, 210, 110, 204, 94, 99, 19, 18, 221, 218, 24, 28, 220, 167, 95, 85, 238, 53, 223, 161, 170, 190, 14, 232, 102, 241, 103, 110, 23, 231, 156, 132, 189, 83, 59, 207, 9, 160, 197, 180, 196, 118, 114, 99, 158, 10, 177, 139, 50, 13, 26, 55, 198, 18, 46, 158, 190, 72, 129, 54, 3, 207, 16, 16, 14, 239, 195, 253, 208, 237, 11, 188, 122, 89, 28, 42, 134, 97, 101, 167, 239, 180, 243, 4, 148, 35, 198, 46, 140, 205, 96, 11, 218, 196, 248, 61, 174, 176, 176, 86, 200, 33, 42, 208, 239, 19, 177, 95, 144, 135, 124, 45, 208, 223, 18, 24, 108, 4],
    [88, 193, 76, 73, 88, 247, 178, 208, 150, 14, 33, 15, 138, 122, 238, 50, 48, 37, 219, 194, 240, 118, 64, 59, 41, 111, 188, 86, 167, 57, 237, 126, 137, 188, 81, 70, 193, 62, 69, 153, 135, 20, 145, 46, 89, 13, 211, 140, 44, 112, 227, 123, 193, 173, 101, 246, 16, 240, 121, 105, 41, 252, 242, 188, 208],
    [88, 6, 11, 130, 75, 95, 183, 27, 195, 224, 160, 175, 213, 130, 22, 152, 102, 2, 96, 79, 227, 238, 0, 181, 73, 2, 52, 38, 52, 203, 95, 127, 252, 224, 151, 101, 8, 43, 222, 143, 218, 39, 46, 220, 113, 247, 163, 133, 136, 228, 30, 23, 207, 88, 34, 35],
    [88, 2, 153, 193, 125, 14, 69, 252, 77, 196, 217, 82, 167, 199, 190, 93, 157, 1, 150, 37, 236, 10, 212, 6, 25, 232, 146, 137, 212, 189, 203, 238, 89, 61, 91, 248, 69, 193, 60, 156, 210, 59, 39, 108, 146, 128, 233]
  ];

function buildBinaryPacket(type: number, streamId: number, packetId:number, messageData:Uint8Array): Uint8Array {
    let header = new ArrayBuffer(9);
    let headerView = new DataView(header);
    headerView.setInt8(0, type);
    headerView.setInt32(1, streamId, false);
    headerView.setInt32(5, packetId, false);

    // build packet (join buffers)
    let packet = new Uint8Array(header.byteLength + messageData.byteLength);
    packet.set(new Uint8Array(header));
    packet.set(messageData, header.byteLength);
    return packet;
  };

const ws = new WebSocket('wss://zello.io/ws');

ws.on('open', function open() {
    // send logon
    ws.send(JSON.stringify(logon));
});

ws.on('message', (wsData: WebSocket.Data) => {
    if (_.isString(wsData)) {
        const data = JSON.parse(wsData);
        console.log('string data: ' + JSON.stringify(data));
        if (_.has(data, 'refresh_token')) {
            console.log('Message: login');
            console.log(data);
            console.log('===');
        } else if (_.has(data, 'command')) {
            const command = _.get(data, 'command');
            if (command === 'on_channel_status') {
                console.log('Message: on_channel_status');
                console.log(data);
                console.log('===');
                // we received on_channel_status, so we can start sending our stream
                if (isFirstChannelStatus) {
                    console.log("Sending stream");
                    isFirstChannelStatus = false;
                    ws.send(JSON.stringify(startStream));
                }
            } else if (command === 'on_error') {
                console.log('Message: on_error');
                console.log(data);
                console.log('===');
            } else {
                console.log('Unhandled command: ' + JSON.stringify(data));
            }
        //} else if (_.has(data, 'stream_id') && _.has(data, 'success') && _.has(data, 'seq')) {
        } else if (_.has(data, 'stream_id') ) {
            console.log("Got stream response");            
             if (_.get(data, 'success') === true && _.get(data, 'seq') === 2) {
                 console.log("Sending packets");
                 let streamId: number = _.get(data, 'stream_id');
                 console.log('Using stream id: ' + streamId);
                 // send data packets 
                 let currentPacketId = 0;                 
                 _.forEach(encodedBuffers, buffer => {
                     let packet = buildBinaryPacket(1, streamId, ++currentPacketId, new Uint8Array(buffer));
                     ws.send(packet);
                });

                 // stop stream
                 console.log('Stopping stream');
                 ws.send(JSON.stringify({
                     "command": "stop_stream",
                     "stream_id": streamId
                 }));

                 // close connection
                 //ws.close();
            }        
        } else {
            console.log('Message: NOT HANDLED');
            console.log(data);
            console.log('===');
        }

    } else if (_.isBuffer(wsData)){
        console.log('isBuffer');
    }; 
});
