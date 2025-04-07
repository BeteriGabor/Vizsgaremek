var CharacterPosition = pc.createScript('characterPosition');

CharacterPosition.prototype.initialize = function() {

    this.targetPositions = [
        { x: -13, z: 17, url: "http://localhost:3001/sign_in", inside: false },
        { x: -21, z: 3, url: "http://localhost:3001/slot", inside: false },
        { x: 19, z: 4, url: "http://localhost:3001/othergames", inside: false },
        { x: 23, z: -14, url:"http://localhost:3001/roulette", inside: false},
        { x: -21, z: -14, url:"http://localhost:3001/blackjack", inside: false},
        { x: -0, z: -30, url:"http://localhost:3001/bank", inside: false},
    ];
};

CharacterPosition.prototype.update = function(dt) {
    var playerPos = this.entity.getPosition(); 
    
    for (var i = 0; i < this.targetPositions.length; i++) {
        var target = this.targetPositions[i];

       
        var inZone = Math.abs(playerPos.x - target.x) < 12 && Math.abs(playerPos.z - target.z) < 7;

        
        if (inZone && !target.inside) { 
            
            window.location.href = target.url;
            target.inside = true;
        } 
        
        if (!inZone && target.inside) {
           
            target.inside = false;
        }
    }
};