import { Room, nosync } from "colyseus";
import { crypto } from "crypto";

class State {
    @nosync
    allClubs = ["england", "france", "germany", "italy", "argentina", "man u", "man c", "arsenal", "chelsea", "tottenham", "liverpool", "bayern", "psg", "real", "barcelona", "atletico madrid", "inter", "juventus", "napoli", "belgium", "portugal", "spain"];

    numOfClubs = this.allClubs.length;

    openedClubs = [];

    reset() {
        this.allClubs = this.shuffle(this.allClubs);

        this.openedClubs = [];
    }

    checkConditionReset() {
        if (this.openedClubs.length >= this.numOfClubs) {
            console.log("Reset");
            this.reset();
        }
    }

    openCard(index: any) {
        var club = this.allClubs[index];

        var alreadyIn = false;
        for (var pos in this.openedClubs) {
            if (this.openedClubs[pos].value == club.toUpperCase()) {
                alreadyIn = true;
                break;
            }
        }

        if (!alreadyIn) {
            this.openedClubs.push({
                index: index,
                value: club.toUpperCase()
            });
        }
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
};

export class RandomTeamRoom extends Room<State> {
    // this room supports only 4 clients connected
    maxClients = 4;

    autoDispose = false;

    onInit(options) {
        console.log("RandomTeamRoom created!", options);

        this.setState(new State());
        this.state.reset();
    }

    onJoin(client) {
        this.broadcast(`${client.sessionId} joined.`);
    }

    onLeave(client) {
        this.broadcast(`${client.sessionId} left.`);

        this.state.checkConditionReset();
    }

    onMessage(client, data) {
        console.log("RandomTeamRoom received message from", client.sessionId, ":", data);
        var index = parseInt(data.message);

        this.state.openCard(index);
    }

    onDispose() {
        console.log("Dispose BasicRoom");
    }
}