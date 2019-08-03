    var bgContainer = document.getElementById('bgContainer');
    var textFontSize = 16;
    var textWidth = 8.73;
    var numberOfCharactersInBrowser = Math.ceil(window.innerWidth / textWidth + (window.innerWidth / textWidth) * 0.10);
    var lineContainer = 'bgContainer';
    var numberOfLines = Math.floor(window.innerHeight / textFontSize + (window.innerWidth / textFontSize) * 0.10);

    window.addEventListener("load", function(){
        initTextSetup();
    });

	/**
	 * Convert a string to HTML entities
	 */
	String.prototype.toHtmlEntities = function() {
	    return this.replace(/./gm, function(s) {
	        return "&#" + s.charCodeAt(0) + ";";
	    });
	};

	/**
	 * Create string from HTML entities
	 */
	String.fromHtmlEntities = function(string) {
	    return (string+"").replace(/&#\d+;/gm,function(s) {
	        return String.fromCharCode(s.match(/\d+/gm)[0]);
	    })
	};

    function isOdd(num) { return (num % 2 == 0)?true:false; }

    function initTextSetup(){
        for (i = 0; i <= numberOfLines; i++) {
            
            var longString = new RandExp('([A-ZÆØÅ]){'+numberOfCharactersInBrowser+'}').gen();
            var direction = isOdd(i)?'odd':'even';
            document.getElementById(lineContainer).innerHTML += '<p id="'+i+'" behavior="scroll" class="bg-text '+ direction +'">'+longString.toHtmlEntities()+'</p>';
            startCharacterChanger(0.25,1,i);
        }
    }

	function startCharacterChanger(min, max, cssId){
		var randomNumber = Math.random() * (max - min) + min;
		setInterval('changeCharacters('+ cssId +')',randomNumber * 1000);
	}

	function changeCharacters(cssId){
		var newCharacter = new RandExp(/([A-ZÆØÅ])/).gen();
		var element = document.getElementById(''+cssId);
		var elementContent = element.innerHTML;
		var newElementContent = newCharacter + elementContent.substring(0,elementContent.length-1);
		element.innerHTML = newElementContent;
	}

	// the code below this, is not related to the moving text.

	function doRotation(currentRotation, currentMousePosition, middlePosition, maxRotation, rotationMultiplier, isPositive){
		if(isPositive){
			if(maxRotation >= (currentMousePosition * rotationMultiplier)){
        		currentRotation = (currentRotation + currentMousePosition);
        		console.log(currentRotation);
	        }
	        else {
	        	currentRotation = maxRotation;
	        }
		}
		else {
			if(maxRotation < (currentMousePosition * rotationMultiplier)){
        		currentRotation = (currentRotation + currentMousePosition);
	        }
	        else {
	        	currentRotation = maxRotation;
	        }
		}
        //console.log(currentRotation);
        console.log(currentRotation);

        return currentRotation;
	}

    function handleMouseMove(event) {
        var dot, eventDoc, doc, body, pageX, pageY;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }
        var middleX = window.innerHeight / 2;
        var middleY = window.innerWidth / 2;
        var mouseX = event.pageX;
        var mouseY = event.pageY;
        var maxRotationY = 7.5;
        var maxRotationX = 7.5;
        var rotationMultiplier = 0.25;
        var rotateX;
        var rotateZ;
        var rotateY;
        var isMousePositionOnLeft;
        var isMousePositionOnTop;
        var mousePositionStringX;
        var mousePositionStringY;

        //if Client mouse is on left side of the browser, write true, else write false
        isMousePositionOnLeft = (mouseX < middleX)?true:false;
        //if Client mouse is above the center of the browser, write true, else write false
        isMousePositionOnTop = (mouseY < middleY)?true:false;

        var mousePositionStringY = (isMousePositionOnTop)?'top':'bottom';
        var mousePositionStringX = (isMousePositionOnLeft)?'left':'right';
        /*rotateX = doRotation(rotateX,mouseX, maxRotationX, rotationMultiplier);
        rotateY = doRotation(rotateY,mouseY, maxRotationY, rotationMultiplier);*/

        //simplified version, very choppy
        //rotateX = (isMousePositionOnLeft)?5:-5;
        //rotateY = (isMousePositionOnTop)?5:-5;

        //console.log((isMousePositionOnLeft)?doRotation(rotateX,mouseX, maxRotationX, rotationMultiplier) : doRotation(-mouseX, -maxRotationX, -middleX,  -rotationMultiplier));
        
        //(isMousePositionOnLeft)?-rotateX:rotateX;
        //(isMousePositionOnTop)?-rotateY:rotateY;

        //rotateX = rotateX + ((mouseX - rotateX) / window.innerHeight) * rotationMultiplier;

        rotateX = doRotation(rotateX,mouseX, maxRotationX, rotationMultiplier, isMousePositionOnLeft);
        if(!isMousePositionOnLeft){
        	rotateX = -rotateX;
        }

        bgContainer.style.transform = "rotateX("+rotateY+"deg)" + "rotateY("+rotateX+"deg)";
        
        //console.log(mousePositionStringX +'\n' + mousePositionStringY );

    }

    //document.onmousemove = handleMouseMove;