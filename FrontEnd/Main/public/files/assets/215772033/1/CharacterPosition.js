var CharacterPosition = pc.createScript('characterPosition');

CharacterPosition.prototype.initialize = function() {

    this.targetPositions = [
        { x: -13, z: 17, url: "/sign_in", inside: false },
        { x: -21, z: 3, url: "/slot", inside: false },
        { x: 19, z: 4, url: "/aviator", inside: false },
        { x: 23, z: -14, url:"", inside: false},
        { x: -21, z: -14, url:"/blackjack", inside: false},
    ];
};

CharacterPosition.prototype.update = function(dt) {
    var playerPos = this.entity.getPosition(); 
    
    for (var i = 0; i < this.targetPositions.length; i++) {
        var target = this.targetPositions[i];

       
        var inZone = Math.abs(playerPos.x - target.x) < 12 && Math.abs(playerPos.z - target.z) < 7;

        if (inZone && !target.inside) { 
            
            window.open(target.url, '_blank');
            target.inside = true;
        } 
        
        if (!inZone && target.inside) {
           
            target.inside = false;
        }
    }
};
