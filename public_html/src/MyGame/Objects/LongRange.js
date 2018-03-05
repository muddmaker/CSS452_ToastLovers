"use strict";

function LongRange(pos, playField) {
	Tower.call(this, "assets/long_range.png", pos, playField);

	this.obj.mTexRight = 0.25;
	this.obj._setTexInfo();
	this.obj.setTextureMode(gEngine.Textures.textureModes.Nearest);

	this.bg = new SpriteRenderable("assets/long_range.png");
	this.bg.mTexRight = 0.25;
	this.bg._setTexInfo();
	this.bg.getXform().mPosition = this.obj.getXform().mPosition;
	this.bg.getXform().mScale = this.obj.getXform().mScale;
	this.bg.mColor = this.obj.mColor;
	this.mRange = 40;
	this.mDamage = 50;
	this.mProjectileSpeed = 50;
	this.mRenderComponent.getXform().setSize(this.mRange * 2, this.mRange * 2);

	this.mProjectiles = new Set();
	this.mName = "Long Range";
	this.mPlayField = playField;
	this.changeAnimationNoShoot();
}
gEngine.Core.inheritPrototype(LongRange, Tower);

LongRange.prototype.draw = function(cam) {
	this.bg.draw(cam);
	Tower.prototype.draw.call(this, cam);
	this.mProjectiles.forEach(p => { p.draw(cam); });
};

LongRange.prototype.update = function(dt) {
	Tower.prototype.update.call(this, dt);
	if(!this.mPhysicsEnabled){
	    if(this.mFiringEnabled)
		    this.obj.getXform().incRotationByRad(dt);

	    this.mProjectiles.forEach(p => { p.update(dt); });
	}
};

LongRange.prototype.checkMinionsInRange = function(minionSet) {
	Tower.prototype.checkMinionsInRange.call(this, minionSet);

	if(this.mFiringEnabled) {
		var target = this.getBestMinion(minionSet);
		var direction = this.getDirectionFromMinion(target);
		this.obj.getXform().setRotationInRad(direction);
	}
}

LongRange.prototype.spawnProjectile = function() {
	var d = this.obj.getXform().getRotationInRad() + Math.PI / 2;
	var x = this.obj.getXform().getXPos(), y = this.obj.getXform().getYPos();
	var s = this.obj.getXform().getWidth() / 2;
	x += Math.cos(d) * (s + this.mProjectileSpeed * this.mAccumulator);
	y += Math.sin(d) * (s + this.mProjectileSpeed * this.mAccumulator);
	new Projectile(this.mPlayField, x, y, d, this.mRange, this.mProjectileSpeed, this.mDamage);
};

LongRange.prototype.changeAnimationShoot = function() {
	this.obj.mTexLeft = 0.5;
	this.obj.mTexRight = 0.75;
	this.obj._setTexInfo();
};

LongRange.prototype.changeAnimationNoShoot = function() {
	this.obj.mTexLeft = 0.2535;
	this.obj.mTexRight = 0.5;
	this.obj._setTexInfo();
};
