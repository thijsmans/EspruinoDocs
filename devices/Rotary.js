/* Copyright (c) 2018 Thijsmans. See the file LICENSE for copying permission. */
/*
	Module for switched rotary encoders (with pushable shaft), like the KY-040.
	To use your own callbacks, overwrite the callbacks mentioned below. The 
	direction of the rotation (up for cw, down for ccw) is stored in 
	Rotary.direction.


	var dial = require("Rotary").create( pinA, pinB, pinSw );
	dial.rotateCallback = function () {
		console.log("We're going " + this.direction + " to " + this.position );
	};
	dial.pushDownCallback = function () {
		console.log("Someone pressed a button.");
	};
*/

	function Rotary ( pinA, pinB, pinSw )
	{
		this.pinA = pinA;
		this.pinB = pinB;
		this.pinSw = pinSw;

		this.lastA = 0;
		this.lastB = 0;
		this.position = 0;

		setWatch( this.rotate.bind(this), this.pinA,  { repeat: true } );
		setWatch( this.rotate.bind(this), this.pinB,  { repeat: true } );
		setWatch( this.push.bind(this),   this.pinSw, { repeat: true } );

		this.rotateCallback = function () {
			console.log("Rotated to " + this.position );
		};

		this.pushDownCallback = function () {
			console.log("Switch pushed");
		};

		this.pushUpCallback = function () {
			console.log("Switch released");
		};
	}

	Rotary.prototype.rotate = function ()
	{
		stateA = digitalRead( this.pinA );
		stateB = digitalRead( this.pinB );
		oldPos = this.position;

		if( this.lastA !== this.lastB && stateA === stateB )
		{
			this.position += ( stateA === this.lastA ? 1 : -1 );
		}

		this.lastA = stateA;
		this.lastB = stateB;

		if( oldPos != this.position)
		{
			this.direction = this.position > oldPos ? 'up' : 'down';
			this.rotateCallback();
		}
	};

	Rotary.prototype.push = function (e) 
	{
		if( e.state ) {
			this.pushUpCallback();
		} else
		{
			this.pushDownCallback();
		}
	};

	exports.create = function ( pinA, pinB, pinSw ) {
		return new Rotary( pinA, pinB, pinSw);
	};
