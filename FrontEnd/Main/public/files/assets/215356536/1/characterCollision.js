var CharacterCollision = pc.createScript('characterCollision');

CharacterCollision.prototype.initialize = function() {
    // Enable rigidbody collision detection
    this.entity.rigidbody.type = pc.BODYTYPE_DYNAMIC;
    this.entity.rigidbody.mass = 1;
    
    // Add collision component if not present
    if (!this.entity.collision) {
        this.entity.addComponent('collision', {
            type: 'box',
            halfExtents: new pc.Vec3(0.5, 1, 0.5)
        });
    }
};

CharacterCollision.prototype.update = function(dt) {
    // Ensure gravity is applied
    this.entity.rigidbody.activate();
};
