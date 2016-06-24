/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

	var scope = this;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add( pitchObject );

	var PI_2 = Math.PI / 2;
	
	var oldTouch = new THREE.Vector2();

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};
	var onTouchStart = function ( event ) {
		oldTouch.x = event.changedTouches[0].clientX;
		oldTouch.y = event.changedTouches[0].clientY;
	}
	var onTouchMove = function ( event ) {
		if ( scope.enabled === false ) return;
		var movementX = oldTouch.x-event.changedTouches[0].clientX;
		var movementY = oldTouch.y-event.changedTouches[0].clientY;

		oldTouch.x = event.changedTouches[0].clientX;
		oldTouch.y = event.changedTouches[0].clientY;
			
		yawObject.rotation.y -= movementX * 5/innerWidth;
		pitchObject.rotation.x -= movementY * 5/innerWidth;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
		
		moveForward = true;	
	};
	var onTouchEnd = function(){
			moveForward = false;
	}

	this.dispose = function() {

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'touchstart', onTouchStart, false );
		document.removeEventListener( 'touchmove', onTouchMove, false );
		document.removeEventListener( 'touchend', onTouchEnd, false );

	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'touchstart', onTouchStart, false );
	document.addEventListener( 'touchmove', onTouchMove, false );
	document.addEventListener( 'touchend', onTouchEnd, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, - 1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		};

	}();

};
