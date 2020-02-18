var CENTER_ROTATION = 180;
var LEFT_ROTATION = 135;
var RIGHT_ROTATION = 90;
var numberOfVillains = 0;

AFRAME.registerComponent('change-ground', {
    dependencies: ['material'],
    init: function(){
        var el = this.el;
        console.log(el.getAttribute('environment','groundColor'))
        window.addEventListener('loading', function(){
            el.setAttribute('environment', 'groundColor', changeGroundSkyColor());
            el.setAttribute('environment', 'fog', loopFog());
            // el.setAttribute('environment', 'ground', loopThroughScenery())
            el.setAttribute('environment', 'groundYScale', randomizeGroundScale());
        })    
    }
})
AFRAME.registerComponent('randomize-position',{
    init: function(){
        var el = this.el;
        el.setAttribute('animation', 'from',{x: Math.random() * (10 - (-10)) + -10, y: 1.6, z: Math.random() * (10 - 5) + 5})
        el.setAttribute('animation', 'dur', loopDur());
        console.log(el.getAttribute('animation', 'from'))
    }
})

AFRAME.registerComponent('villain-remove', {
    init: function(){
        // var villains = [].slice.call(document.querySelectorAll(".villain"));
        var villains = document.querySelectorAll(".villain");
        for(var i = 0; i < villains.length; i++){
            (function(x){
                villains[x].addEventListener('click', function(){
                    console.log(villains[x])
                    villains[x].setAttribute('visible', false)
                    // villains[x].parentNode.removeChild(villains[x]);
                });
            })(i)
        }
    }
}),
// AFRAME.registerComponent('raycaster-autorefresh', {
//         init: function () {
//           var el = this.el;
//           this.el.addEventListener('model-loaded', function () {
//             var cursorEl = el.querySelector('[raycaster]');
//             cursorEl.components.raycaster.refreshObjects();
//           });
//         }
//       })
/*Starts the game--------------------------------------------------------------------------*/
AFRAME.registerComponent('game-start', {
    init: function () {
      const scene = this.el.sceneEl;
        scene.addEventListener('click', () => {
          setupVillains();
          gameStart();
        })
    }
})

function changeGroundSkyColor(){
    var letters = "0123456789ABCDEF"
    var colors = "#"
    for(var i = 0; i < 6; i++){
        colors += letters[Math.floor(Math.random() * 16)]
    }
    return colors;
}

function loopFog(){
    var loop = 0;
    for(var i = 0; i < 1; i++){
        loop = Math.random() 
    }
    return loop;
}

function loopDur(){
    var time = 0;
    for(var i = 0; i < 1; i++){
        time = Math.floor(Math.random() * (6500 - 4500) + 4500)
    }
    return time;
}

function randomizeGroundScale(){
    var groundScale = 0;
    for(i = 0; i < 1; i++){
        groundScale = Math.floor(Math.random() * (85 - 0) + 0)
    }
    return groundScale;
}
// function loopThroughScenery(){
//     var groundArray = ['hills', 'canyon']
//         for(var i = 0; i < groundArray.length; i++){
//             groundArray[i]
//         }
//     return groundArray[i];
// }

 var templates;
 var villainContainer;
 var villainTimer;

 /*Initializes villains and also the wrapping container*/
function setupVillains(){

     var villainObjectOne = document.getElementById("villain-one");
     templates = [villainObjectOne];
     villainContainer = document.getElementById("villain");

}

/*clearsInterval whenever game is over */
function loopVillains(){
  clearInterval(villainTimer);
}
/*Generates villains to game board------------------------------------*/
function addVillains(el){
    numberOfVillains += 1;
    el.id = "villain-" + numberOfVillains;
    villainContainer.appendChild(el);
}
/*Assigns the villain an index so that it will belong to a particular lane-----------------------------------*/
function addVillainTo(position_index){
  var villain_index = templates[position_index]
  // console.log(villain_index)
  addVillains(villain_index.cloneNode(true));
}


/*Function that randomizes the position of each villain. It puts them into an array with each position index and
 then the array is looped over to randomize position, where a setAttribute call is invoked. Then a forEach loop is invoked that
 randomizes villain probability and pushs the villain object onto the position Array. Finally, the value is returned
-----------------------------------------------------------------------------------------------------------------*/
function addRandomVillains(
  { 
      villainOneProb = 0.4,
      maxNumberOfVillains = 1
  } = {}) {
      var villains = [
          {probability: villainOneProb, position_index: 0},  
      ]
      shuffle(villains)

      console.log('villains ', villains)
      
      var numberOfVillainsAdded = 0;
      var positionArray = [];

      villains.forEach(function(villain) {
          if(Math.random() < villain.probability && numberOfVillainsAdded < maxNumberOfVillains){
              addVillainTo(villain.position_index)
              numberOfVillainsAdded += 1;

              positionArray.push(villain.position_index)
          }
      });
      return numberOfVillainsAdded;
}
function addVillainsRandomlyLoop({intervalLength = 1000} = {}) {
  villainTimer = setInterval(addRandomVillains, intervalLength);
    // clearInterval(villainTimer);
}
var isGameRunning = false;
    
/*Function that starts game and loops villains*/
function gameStart(){
    if(isGameRunning) return;
  
    isGameRunning = true;
    // setupScore();
    // updateScore();

    addVillainsRandomlyLoop();
  }
  
  function collisionEvent(){
    alert("Object hit")
  }
  /*Helper Functions ------------------------------------------------------*/
  
  /*Randomizes villain position index */
  function shuffle(a){
      var b, c, i;
      for(i = a.length - 1; i > 0; i--){
          b = Math.floor(Math.random() * (i + 1));
          c = a[i];
          a[i] = a[b];
          a[b] = c;
      }
      return a;
  }