import { Room } from "colyseus";

const ACTION = {
    ON_JOIN: "ON_JOIN",
    ON_LEAVE: "ON_LEAVE",
    CHOOSE_CLUB: "CHOOSE_CLUB"
};

export class RandomTeamRoom extends Room {
    // this room supports only 4 clients connected
    maxClients = 4;

    clubs = [];
    players = {};

    onInit (options) {
        this.clubs = ["A", "B", "C", "D"];
        this.players = {};

        console.log("BasicRoom created!", options);
    }

    onJoin (client) {
        this.players[client.sessionId] = {
            clientId: client.clientId
        };

        this.broadcast({
            action: ACTION.ON_JOIN,
            data: {
                players: this.players,
                clubs: this.clubs
            }
        });
    }

    onLeave (client) {
        delete this.players[client.sessionId];

        this.broadcast({
            action: ACTION.ON_LEAVE,
            data: {
                players: this.players
            }
        });
    }

    onMessage (client, data) {
        console.log("BasicRoom received message from", client.sessionId, ":", data);
        this.broadcast(`(${ client.sessionId }) ${ data.message }`);
    }

    onDispose () {
        console.log("Dispose BasicRoom");
    }

}
