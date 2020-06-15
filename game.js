var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function () {

    // Peli-muuttujat

    var score;
    var gameOn;

    // määritellään komponentit

    var button1 = new five.Button(12);
    var button2 = new five.Button(2);
    var reset = new five.Button(4);

    var led1 = new five.Led(9);
    var led2 = new five.Led(8);
    var led3 = new five.Led(7);

    var piezo = new five.Piezo(13);

    // satunnais-aika piezolle

    function buzzerTime(min, max) {
        return Math.floor(
            Math.random() * (max - min + 1) + min
        )
    }

    // napit

    button1.on("press", function () {

        switch (gameOn) {
            case true:
                score += 1;
                gameOn = false;
                gameRound();
            default:
                console.log(gameOn);
                console.log("p1 button, gameOn = " + gameOn);
        }

    })

    button2.on("press", function () {

        switch (gameOn) {
            case true:
                score -= 1;
                gameOn = false;
                gameRound();
            default:
                console.log(gameOn);
                console.log("p2 button, gameOn = " + gameOn);
        }

    })

    // reaction-funktio

    function reaction() {
        gameOn = true;
        return;
    }

    // Pelikierros-funktio

    function gameRound() {

        if (score < 3 && score > -3) {

            switch (score) {
                case 0:
                    led1.off();
                    led2.off();
                    led3.off();
                    break;
                case 1:
                    led1.on();
                    led2.off();
                    led3.off();
                    break;
                case 2:
                    led1.on();
                    led2.on();
                    led3.off();
                    break;
                case -1:
                    led1.off();
                    led2.off();
                    led3.on();
                    break;
                case -2:
                    led1.off();
                    led2.on();
                    led3.on();
                    break;
            }


            var delay = buzzerTime(10, 30);

            piezo.play({
                song: [
                    [null, delay],
                    ["c6", 1 / 2]
                ]
            }, reaction);

        } else {
            led1.on();
            led2.on();
            led3.on();
            console.log("game over!")

            piezo.play({
                song: [
                    ["C4", 1 / 4],
                    ["D4", 1 / 4],
                    ["F4", 1 / 4],
                    ["D4", 1 / 4],
                    ["A4", 1 / 4],
                    [null, 1 / 4],
                    ["A4", 1],
                    ["G4", 1],
                    [null, 1 / 2],
                    ["C4", 1 / 4],
                    ["D4", 1 / 4],
                    ["F4", 1 / 4],
                    ["D4", 1 / 4],
                    ["G4", 1 / 4],
                    [null, 1 / 4],
                    ["G4", 1],
                    ["F4", 1],
                    [null, 1 / 2]
                ],
                tempo: 100
            });

            return;
        }

    }

    // määritellään funktio uudelle pelille

    function newGame() {

        score = 0;
        gameOn = false;

        console.log("pisteet nollattu")
        console.log(score)

        gameRound();
    }

    // reset-nappula

    reset.on("press", function () {

        newGame();

    })
})