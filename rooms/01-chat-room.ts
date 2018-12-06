import { Room } from "colyseus";
import { crypto } from "crypto";

export class ChatRoom extends Room {
    // this room supports only 4 clients connected
    maxClients = 4;
    clubs = [];

    reset() {
        this.clubs = ["england", "france", "germany", "italy", "argentina", "man u", "man c", "arsenal", "chelsea", "tottenham", "liverpool", "bayern", "psg", "real", "barcelona", "atletico madrid", "inter", "juventus", "napoli", "belgium", "portugal", "spain"];
        this.clubs = this.shuffle(this.clubs);
    }

    onInit(options) {
        console.log("BasicRoom created!", options);

        this.reset();
    }

    onJoin(client) {
        this.broadcast(`${client.sessionId} joined.`);
    }

    onLeave(client) {
        this.broadcast(`${client.sessionId} left.`);
    }

    onMessage(client, data) {
        console.log("BasicRoom received message from", client.sessionId, ":", data);

        if (data.message == "random") {
            if (this.clubs.length <= 0) {
                this.reset();
            }
            // var club = this.clubs.pop();
            var clubInex = this.genRandomInt(0, this.clubs.length - 1);
            var club = this.clubs.splice(clubInex, 1);

            this.broadcast(`(${client.sessionId}) ${club[0].toUpperCase()}. Remain ${this.clubs.length} teams.`);
        } else {
            this.broadcast(`(${client.sessionId}) ${data.message}`);
        }
    }

    onDispose() {
        console.log("Dispose BasicRoom");
    }

    shuffle(array) {
        var counter = array.length, temp, index;

        for (var i = counter - 1; i >= 1; i--) {      // GLI
            // Pick a random index
            index = this.genRandomInt(0, i);            // GLI

            // And swap the last element with it
            temp = array[i];
            array[i] = array[index];
            array[index] = temp;
        }

        return array;
    }

    genRandomInt(min, max) {
        try {
            var totalRandom = max - min + 1;
            var exclude = Math.pow(2, 32) - (Math.pow(2, 32) % totalRandom);
            var biasCount = 0;

            do {
                // get random 4 bytes
                var hexBuffStr = "";
                var buff = crypto.randomBytes(4);

                var randomDev = buff.readUInt32LE(0);

                if (randomDev < exclude) {
                    var ret = (randomDev % totalRandom) + min;
                    return ret;
                }

                biasCount++;
            }
            while (true);
        } catch (e) {
            return Math.floor((Math.random() * (max - min + 1)) + min);
        }
    }
}
