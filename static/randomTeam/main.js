var GAME = {};

cc.game.onStart = function () {
    var designSize = cc.size(900, 640);
    cc.view.adjustViewPort(true);
    cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    // CG_LoaderScene.preload(g_resources, function () {
    // }, this);

    var Scene = cc.Scene.extend({
        /**
         * Handler for enter scene event
         */
        onEnter: function () {
            this._super();

            this._cardQueue = [];

            GAME.MAIN_SCENE = this;

            this._layer = new cc.LayerColor(cc.color.BLACK);
            this.addChild(this._layer);

        },
        addCard: function (posX, poY) {
            var card = new Card();
            card.ignoreAnchorPointForPosition(false);
            card.setPosition(posX, poY);

            this._layer.addChild(card);
            this._cardQueue.push(Card);
        },
        initAllClubCard: function (clubs) {
            this._layer.removeAllChildren();

            var posX = designSize.width * 0.1, posY = designSize.height * 0.9;
            for (var pos in clubs) {
                this.addCard(posX, posY);

                posX += designSize.height * 0.2;
            }
        }
    });

    var Card = cc.Sprite.extend({
        ctor: function () {
            this._super();

            // if ('touches' in cc.sys.capabilities) {
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchesBegan: function (touch, event) {
                        // event.getCurrentTarget().changeColor();
                        var target = event.getCurrentTarget();
                        if (!target.containsTouchLocation(touch))
                            return false;

                        return true;
                    }
                }, this);
            // } else if ('mouse' in cc.sys.capabilities) {
            //     cc.eventManager.addListener({
            //         event: cc.EventListener.MOUSE,
            //         swallowTouches: true,
            //         onMouseDown: function (event) {
            //             // event.getCurrentTarget().changeColor();
            //             var target = event.getCurrentTarget();
            //             if (!target.containsTouchLocation(touch))
            //                 return false;

            //             return true;
            //         }
            //     }, this);
            // }

            this.setTextureRect(cc.rect(0, 0, designSize.height * 0.2, designSize.height * 0.2));
            this.setColor(cc.color.GREEN);
        },
        containsTouchLocation: function (touch) {
            var getPoint = touch.getLocation();
            var myRect = this.rect();

            myRect.x += this.x;
            myRect.y += this.y;
            return cc.rectContainsPoint(myRect, getPoint);
        },
        changeColor: function () {
            room.send({ message: "hello" });

            this.setColor(cc.color.YELLOW);
        }
    });

    var sence = new Scene();
    cc.director.runScene(new cc.TransitionFade(0.5, sence));

    // room process
    var host = window.document.location.host.replace(/:.*/, '');

    var client = new Colyseus.Client(location.protocol.replace("http", "ws") + host + (location.port ? ':' + location.port : ''));
    var room = client.join("random_team");

    var ACTION = {
        ON_JOIN: "ON_JOIN",
        ON_LEAVE: "ON_LEAVE",
        CHOOSE_CLUB: "CHOOSE_CLUB"
    };

    room.onJoin.add(function () {
        console.log("joined");
    });

    room.onStateChange.addOnce(function (state) {
        console.log("initial room state:", state);
    });

    // new room state
    room.onStateChange.add(function (state) {
        // this signal is triggered on each patch
    });

    // listen to patches coming from the server
    room.onMessage.add(function (message) {
        console.log(message);

        switch (message.action) {
            case ACTION.ON_JOIN:
                console.log("ACTION.ON_JOIN");

                GAME.MAIN_SCENE.initAllClubCard(message.data.clubs);

                break;

            case ACTION.ON_LEAVE:
                console.log("ACTION.ON_LEAVE");

                break;
        }
    });

    // send message to room on submit
    // document.querySelector("#form").onsubmit = function (e) {
    //     e.preventDefault();

    //     var input = document.querySelector("#input");

    //     console.log("input:", input.value);

    //     // send data to room
    //     room.send({ message: input.value });

    //     // clear input
    //     input.value = "";
    // }
};
cc.game.run();
