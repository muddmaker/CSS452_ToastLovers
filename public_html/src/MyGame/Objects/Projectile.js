"use strict";

function Projectile(parent, x, y, direction, range, speed, damage) {
	this.mRenderComponent = new SpriteAnimateRenderable("assets/projectile.png");
	this.mRenderComponent.getXform().setRotationInRad(direction);
	this.mRenderComponent.getXform().setPosition(x, y);
	this.mRenderComponent.getXform().setSize(5, 5);

	this.mSpeed = speed;
	this.mRange = range;
	this.mParent = parent;
	this.mAccumulator = 0;
	this.mDamage = damage;
	this.mEnabled = true;
	this.mRenderComponent.mElmWidth = 0.25;
	this.mRenderComponent.mNumElems = 4;
	this.mRenderComponent._initAnimation();
	this.mCollided = false;
	this.mPhysicsEnabled = false;
	this.mRigid = new RigidRectangle(this.getXform(), 5, 5);

	this.mParent.mProjectiles.add(this);
}
gEngine.Core.inheritPrototype(Projectile, GameObject);

Projectile.prototype.update = function(dt) {
	if(!this.mPhysicsEnabled){
	    if(!this.mCollided){
		    var direction = this.mRenderComponent.getXform().getRotationInRad();
		    this.mRenderComponent.getXform().incXPosBy(Math.cos(direction) * dt * this.mSpeed);
		    this.mRenderComponent.getXform().incYPosBy(Math.sin(direction) * dt * this.mSpeed);
		    this.mAccumulator += dt * this.mSpeed;

		    if (this.mEnabled && this.mAccumulator > this.mRange)
				    this.mEnabled = false;

		    this.mRenderComponent.updateAnimation(dt);
	    }

	    if (!this.mEnabled) {
		    var c = this.mRenderComponent.mColor;
		    c[3] += 2 * dt;
		    this.mRenderComponent.getXform().incWidthBy(-10 * dt);
		    this.mRenderComponent.getXform().incHeightBy(-10 * dt);

		    if (c[3] >= 1)
			    this.destroy();
	    }
	}
	else{
	    this.mRigid.update();
	}
};

Projectile.prototype.TryCollide = function(minionColliding) {
	var pos = [0, 0];

	if(!this.mCollided && this.pixelTouches(minionColliding, pos)) {
		this.mCollided = true;
		this.mEnabled = false;
		minionColliding.TakeDamage(this.mDamage);
	}
};

Projectile.prototype.enablePhysics = function() {
	if(!this.mPhysicsEnabled){
	    this.mPhysicsEnabled = true;
	    this.setRigidBody(this.mRigid);
	    this.mRigid.setAngularVelocity((Math.random() - 0.5) * 10);
	    this.mRigid.setVelocity((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 60);
	}
};

Projectile.prototype.draw = function(cam) {
	this.mRenderComponent.draw(cam);
};

Projectile.prototype.destroy = function() {
	this.mParent.mProjectiles.delete(this);
};
