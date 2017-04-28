var hasGP = false;
var gp = navigator.getGamepads()[0];
console.log(gp);



function gameLoop() {
    //hasGP = true;
    gp = navigator.getGamepads()[0];
    setTimeout(function() {
        hasGP = true;
       //console.log(gp);
    }, 500);
    //console.log(gamepads);
    window.requestAnimationFrame(gameLoop);
    }
gameLoop();