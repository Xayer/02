const bgContainer = document.getElementById('bgContainer');
const textFontSize = 16;
const textWidth = 8.73;
const numberOfCharactersInBrowser = Math.ceil(window.innerWidth / textWidth + (window.innerWidth / textWidth) * 0.10);
const lineContainer = 'bgContainer';
const numberOfLines = Math.floor(window.innerHeight / textFontSize + (window.innerWidth / textFontSize) * 0.10);

window.addEventListener('load', () => {
	initTextSetup();
});

/**
	 * Convert a string to HTML entities
	 */
String.prototype.toHtmlEntities = function () {
	    return this.replace(/./gm, s => `&#${s.charCodeAt(0)};`);
};

/**
	 * Create string from HTML entities
	 */
String.fromHtmlEntities = function (string) {
	    return (`${string}`).replace(/&#\d+;/gm, s => String.fromCharCode(s.match(/\d+/gm)[0]));
};

function isOdd(num) { return (num % 2 == 0); }

function initTextSetup() {
	for (i = 0; i <= numberOfLines; i++) {
		const longString = new RandExp(`([A-ZÆØÅ]){${numberOfCharactersInBrowser}}`).gen();
		const direction = isOdd(i) ? 'odd' : 'even';
		document.getElementById(lineContainer).innerHTML += `<p id="${i}" behavior="scroll" class="bg-text ${direction}">${longString.toHtmlEntities()}</p>`;
		startCharacterChanger(0.25, 1, i);
	}
}

function startCharacterChanger(min, max, cssId) {
	const randomNumber = Math.random() * (max - min) + min;
	setInterval(`changeCharacters(${cssId})`, randomNumber * 1000);
}

function changeCharacters(cssId) {
	const newCharacter = new RandExp(/([A-ZÆØÅ])/).gen();
	const element = document.getElementById(`${cssId}`);
	const elementContent = element.innerHTML;
	const newElementContent = newCharacter + elementContent.substring(0, elementContent.length - 1);
	element.innerHTML = newElementContent;
}

// the code below this, is not related to the moving text.

function doRotation(currentRotation, currentMousePosition, middlePosition, maxRotation, rotationMultiplier, isPositive) {
	if (isPositive) {
		if (maxRotation >= (currentMousePosition * rotationMultiplier)) {
        		currentRotation += currentMousePosition;
        		console.log(currentRotation);
	        } else {
	        	currentRotation = maxRotation;
	        }
	} else if (maxRotation < (currentMousePosition * rotationMultiplier)) {
        		currentRotation += currentMousePosition;
	        } else {
	        	currentRotation = maxRotation;
	        }
	// console.log(currentRotation);
	console.log(currentRotation);

	return currentRotation;
}

function handleMouseMove(event) {
	let dot; let eventDoc; let doc; let body; let pageX; let
		pageY;

	event = event || window.event; // IE-ism

	// If pageX/Y aren't available and clientX/Y are,
	// calculate pageX/Y - logic taken from jQuery.
	// (This is to support old IE)
	if (event.pageX == null && event.clientX != null) {
		eventDoc = (event.target && event.target.ownerDocument) || document;
		doc = eventDoc.documentElement;
		body = eventDoc.body;

		event.pageX = event.clientX
              + (doc && doc.scrollLeft || body && body.scrollLeft || 0)
              - (doc && doc.clientLeft || body && body.clientLeft || 0);
		event.pageY = event.clientY
              + (doc && doc.scrollTop || body && body.scrollTop || 0)
              - (doc && doc.clientTop || body && body.clientTop || 0);
	}
	const middleX = window.innerHeight / 2;
	const middleY = window.innerWidth / 2;
	const mouseX = event.pageX;
	const mouseY = event.pageY;
	const maxRotationY = 7.5;
	const maxRotationX = 7.5;
	const rotationMultiplier = 0.25;
	let rotateX;
	let rotateZ;
	let rotateY;
	let isMousePositionOnLeft;
	let isMousePositionOnTop;
	var mousePositionStringX;
	var mousePositionStringY;

	// if Client mouse is on left side of the browser, write true, else write false
	isMousePositionOnLeft = (mouseX < middleX);
	// if Client mouse is above the center of the browser, write true, else write false
	isMousePositionOnTop = (mouseY < middleY);

	var mousePositionStringY = (isMousePositionOnTop) ? 'top' : 'bottom';
	var mousePositionStringX = (isMousePositionOnLeft) ? 'left' : 'right';
	/* rotateX = doRotation(rotateX,mouseX, maxRotationX, rotationMultiplier);
        rotateY = doRotation(rotateY,mouseY, maxRotationY, rotationMultiplier); */

	// simplified version, very choppy
	// rotateX = (isMousePositionOnLeft)?5:-5;
	// rotateY = (isMousePositionOnTop)?5:-5;

	// console.log((isMousePositionOnLeft)?doRotation(rotateX,mouseX, maxRotationX, rotationMultiplier) : doRotation(-mouseX, -maxRotationX, -middleX,  -rotationMultiplier));

	// (isMousePositionOnLeft)?-rotateX:rotateX;
	// (isMousePositionOnTop)?-rotateY:rotateY;

	// rotateX = rotateX + ((mouseX - rotateX) / window.innerHeight) * rotationMultiplier;

	rotateX = doRotation(rotateX, mouseX, maxRotationX, rotationMultiplier, isMousePositionOnLeft);
	if (!isMousePositionOnLeft) {
        	rotateX = -rotateX;
	}

	bgContainer.style.transform = `rotateX(${rotateY}deg)` + `rotateY(${rotateX}deg)`;

	// console.log(mousePositionStringX +'\n' + mousePositionStringY );
}

// document.onmousemove = handleMouseMove;
