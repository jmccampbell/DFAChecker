var currentCase = "none";
var canvas = document.getElementById("canvas");
var x1;				//several of these are Very Bad Global Variables
var x2;				//I have made peace with the Code Structure Gods
var y1;				//and come to terms with my sins
var y2;
var downTarget;
var stateIndex=0;
var startState;
var stateArcs={};
var accepting=[];

function setAddArc(){
	currentCase = "AddArc";
	var message = document.getElementById("message");
	message.textContent = "Click and drag from one state to another to add an arc"
}

function setAddState() {
	currentCase = "Add";
	var message = document.getElementById("message");
	message.textContent = "Click anywhere to add a state to your DFA";
}

function setRemove() {
	currentCase = "Remove";
	var message = document.getElementById("message");
	message.textContent = "Click on a state to remove it from your DFA";
}

function setRemoveArcs() {
	currentCase = "RemoveArcs";
	var message = document.getElementById("message");
	message.textContent = "Click and drag from one state to another to remove arcs form your DFA";
}

function setAcceptState() {
	currentCase = "Accept";
	var message = document.getElementById("message");
	message.textContent = "Click on state(s) to make them accepting";
}

function getInput(){
	var clear = document.getElementById("stringText");
	if (clear != undefined){
		clear.remove();
	}
	var input = document.getElementById("input").value;
	var characters = input.split("");
	var stringCanvas = document.getElementById("stringCanvas");
	var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
	g.setAttribute("id", "stringText");
	var id = 0;
	var x = 390;
	var arrow = document.createElementNS("http://www.w3.org/2000/svg", "text");
	arrow.setAttribute("id", "arrow");
	arrow.setAttribute("x", x);
	arrow.setAttribute("y", 15);
	arrow.setAttribute("font-family", "sans-serif");
	arrow.setAttribute("font-size", "16px");
	arrow.setAttribute("fill", "#A9A9A9");
	arrow.textContent = "-->"
	g.appendChild(arrow);
	x += 30;
	for (var i = 0; i < characters.length; i++){
		var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
		text.setAttribute("id", "text"+id);
		text.setAttribute("x", x);
		text.setAttribute("y", 15);
		text.setAttribute("font-family", "sans-serif");
		text.setAttribute("font-size", "16px");
		text.setAttribute("fill", "#A9A9A9");
		text.textContent = characters[i];
		g.appendChild(text);
		id++;
		x += 20;
	}
	stringCanvas.appendChild(g);
	runString(characters);
}

function runString(characters){
		var currG = startState;
		if (currG == undefined){
			alert("No start state. Start state must have content \"0\"");
			return;
		}
		var currState = currG.childNodes.item(0);
		var arrow = document.getElementById("arrow");
		var time = 0;
		lightUp(currState, arrow, 0,  time);
		time += 2000;
		unLight(currState, arrow, 0,  time);
        time += 2000;
        var next = findNextState(currState.parentNode.getAttribute("id"), characters[0]);
        if (next == undefined){
        	evaluate(-1, time);
        	return;
        }
        var nextState = next[0];
        var currArc = next[1].parentNode.childNodes.item(0);
        nextState = nextState.childNodes.item(0);
        currState = nextState;
	for (var i = 1; i <= characters.length; i++){
		var stateId = currState.parentNode.getAttribute("id");
		currChar = document.getElementById("text"+(i-1));
		lightUp(currState, currChar, currArc, time);
		time += 2000;
		unLight(currState, currChar, currArc, time);
        next = findNextState(stateId, characters[i]);
        console.log("next: ", next);
		if (next != undefined){
			nextState = next[0];
        	var nextArc = next[1].parentNode.childNodes.item(0);
			nextState = nextState.childNodes.item(0);
        	currState = nextState;
        } else {
        	evaluate(-1, time+4000);
        }
        currArc = nextArc;
        time += 2000;
	}
	evaluate(currState.parentNode.getAttribute("id"), time-2000);
}


function evaluate(currState, time) {
	var isAccept = (accepting.indexOf(currState) != -1)
	var stringText = document.getElementById("stringText");
	var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	text.setAttribute("id", "evaluation");
	text.setAttribute("x", 395);
	text.setAttribute("y", 15);
	text.setAttribute("font-family", "sans-serif");
	text.setAttribute("font-size", "16px");
	text.setAttribute("fill", "#FF3B3F");
	if (isAccept){
		text.textContent = "ACCEPTED";
	} else {
		text.textContent = "REJECTED";
	}
	setTimeout(function() {
		stringText.innerHTML = "";
		stringText.appendChild(text);
	}, time);
}

function lightUp(stateToLight, charToLight, arcToLight, time){
	setTimeout(function () {
			charToLight.setAttribute("fill", "#FF3B3F");
			stateToLight.setAttribute("fill", "#FF3B3F");
			if (typeof arcToLight == 'object') {
				arcToLight.setAttribute("marker-end", "url(#arrowRed)");
				arcToLight.setAttribute("stroke", "#FF3B3F");
			} 
		}, time);
}

function unLight(stateToUnLight, charToUnLight, arcToUnLight, time){
	setTimeout(function () {
               charToUnLight.setAttribute("fill", "#A9A9A9");
               stateToUnLight.setAttribute("fill", "#CAEBF2");
               if (typeof arcToUnLight == 'object') {
               		arcToUnLight.setAttribute("marker-end", "url(#arrow)");
               		arcToUnLight.setAttribute("stroke", "#A9A9A9");
               }
            }, time);
}

function findNextState(currState, nextChar){
	var arcs = stateArcs[currState];
	var arcOptions = [];
	var result;
	for (var i = 0; i < arcs.length; i++){
		var arcStates = arcs[i].split("");
		if (arcStates[0] == currState){
			arcOptions.push(arcs[i]);
		}
	}
	for (i = 0; i < arcOptions.length; i++){
		var currStates = arcOptions[i].split("");
		var parent = document.getElementById(arcOptions[i]);
		var currArc = parent.childNodes.item(1);
		var arcId = currArc.textContent;
		console.log("arcId: ", arcId);
		console.log("nextChar: ", nextChar);
		if (arcId == nextChar){
			console.log("here");
			var resultState = document.getElementById(currStates[1]);
			result = [resultState, currArc];
		}
	}

	return result;
	
}

function clickHandler(e) {
	switch(currentCase) {
	
	case "Add":
		draw(e);
	break;
	
	case "Remove":
		if (document.addEventListener ){
    		document.addEventListener("click", function(event){});
        		var targetElement = event.target || event.srcElement;
        		if (targetElement.tagName == "circle" || targetElement.tagName == "text"){
        			var stateId = targetElement.parentNode.getAttribute("id");
        			var thisArcs = stateArcs[stateId];
        			for (var i = 0; i < thisArcs.length; i++) {
        				var arcId = thisArcs[i];
        				//states
        				var toRemove = document.getElementById(arcId);
        				toRemove.remove();
        				var states = arcId.split("");
	     				for(var j = 0; j < states.length; j++){
        					var currState = states[j];
        					if(currState != stateId){
        						var currArcs =stateArcs[currState];
        						var index = currArcs.indexOf(arcId);
        						if (index > -1){
									currArcs.splice(index, 1);
								}
        					}
        				}
        			}
        			var n = parseInt(stateId);
        			delete stateArcs[n];
        			if(targetElement.parentNode.childNodes.item(1).textContent == "0"){
        				startState = undefined;
        			}
        			var acceptIndex = accepting.indexOf(stateId);
        			if (acceptIndex > -1){
        				accepting.splice(acceptIndex, 1);
        			}
        			targetElement.parentNode.remove();
        			
        		}
    		
		} else if (document.attachEvent) {    
    		document.attachEvent("onclick", function(){
        		var targetElement = event.target || event.srcElement;
        		if (targetElement.tagName == "circle" || targetElement.tagName == "text"){
        			targetElement.parentNode.remove();
        		}
    		});
		}
		break;
		
	case "Accept":
        	var targetElement = event.target || event.srcElement;
        	if ((targetElement.tagName == "circle" || targetElement.tagName == "text")){
        		if (targetElement.parentNode.childNodes.length < 4){
        			var g = targetElement.parentNode;
        			var cx = targetElement.getAttribute("cx");
        			var cy = targetElement.getAttribute("cy");
        			var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    				circle.setAttribute("cx",cx);
					circle.setAttribute("cy",cy);
					circle.setAttribute("r",17);
					circle.setAttribute("fill", "none");
					circle.setAttribute("stroke", "#A9A9A9");
					g.insertBefore(circle, g.childNodes.item(1));
					accepting.push(g.getAttribute("id"));
					console.log("accepting: ",accepting);
				}
        	}

	break;
	
	}
}

function mouseDownHandler(e) {
	switch(currentCase) {
		case "AddArc":
			if (document.addEventListener ){
    			document.addEventListener("mousedown", function(event){});
        	var targetElement = event.target || event.srcElement;
        	downTarget = targetElement;
        	if (targetElement.tagName == "circle" || targetElement.tagName == "text"){
        			/*var circle= targetElement.parentNode.getElementsByTagName("circle")[0];
        			x1 = circle.getAttribute("cx");
        			y1 = circle.getAttribute("cy");*/
        		var pos = getMousePos(canvas, e);
    			x1 = pos.x;
    			y1 = pos.y;
        	}
    		
		} /*else if (document.attachEvent) { 
    		document.attachEvent("mousedown", function(){
        		var targetElement = event.target || event.srcElement;
        		downTarget = targetElement;
        		if (targetElement.tagName == "circle" || targetElement.tagName == "text"){
        			/*var circle= targetElement.parentNode.getElementsByTagName("circle")[0];
        			x1 = circle.getAttribute("cx");
        			y1 = circle.getAttribute("cy");
        			var pos = getMousePos(canvas, e);
    					x1 = pos.x;
    					y1 = pos.y;
        		}
    		});
		}*/
		break;
		
		case "RemoveArcs":
			var targetElement = event.target || event.srcElement;
			downTarget = targetElement;
	}
}

function mouseUpHandler(e) {
	var pos = getMousePos(canvas, e);
	switch(currentCase) {
		case "AddArc":
				var targetElement = e.target || e.srcElement;
        		if (targetElement.tagName == "circle"){
        			var circle= targetElement.parentNode.getElementsByTagName("circle")[0];
        			var cx = parseInt(circle.getAttribute("cx"));
        			var cy = parseInt(circle.getAttribute("cy"));
        			var pos = getMousePos(canvas, event);
    					x2 = pos.x;
    					y2 = pos.y;
    				if (targetElement.isSameNode(downTarget)){
    					drawArc(cx,cy, targetElement);
    				} else {
        				drawLine(x1, y1, x2, y2, targetElement);
        			}
        			
        		}
		/*else if (document.attachEvent) {    
			console.log("yo");
    		document.attachEvent("mouseup", function(){
        		var targetElement = event.target || event.srcElement;
        		if (targetElement.tagName == "circle" || targetElement.tagName == "text"){
        			/*var circle= targetElement.parentNode.getElementsByTagName("circle")[0];
        			x2 = circle.getAttribute("cx");
        			y2 = circle.getAttribute("cy");
        			var pos = getMousePos(canvas, event);
    					x2 = pos.x;
    					y2 = pos.y;
        			var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        			console.log("line: x1:"+x1+", y1:"+y1+" x2:"+x2+" y2:"+y2);
        			line.setAttribute("x1", x1);
        			line.setAttribute("y1", y1);
        			line.setAttribute("x2", x2);
        			line.setAttribute("y2", y2);
        			line.setAttribute("style","stroke:rgb(255,0,0);stroke-width:2");
        			var svg = document.getElementById("canvas");
        			svg.insertBefore(line, svg.firstChild);
        		}
    		});
		}*/
		break;
	
		case "RemoveArcs":
			var targetElement = event.target || event.srcElement;
			var toId = targetElement.parentNode.getAttribute("id");
			var fromId = downTarget.parentNode.getAttribute("id");
			//remove arc from list of to-State
			var arcListTo = stateArcs[toId];
			var indexTo = arcListTo.indexOf(fromId+toId);
			if (indexTo > -1){
				arcListTo.splice(indexTo, 1);
			}
			//remove arc from list of from-State
			var arcListFrom = stateArcs[fromId];
			var indexFrom = arcListFrom.indexOf(fromId+toId);
			if (indexFrom > -1){
				arcListFrom.splice(indexFrom, 1);
			}
			//remove arc in display
			removeArc = document.getElementById(fromId+toId);
			try {
				removeArc.remove();
			} catch(err) {}
			break;
	}
}


function drawArc(cx, cy, targetElement) {
	var toId = targetElement.parentNode.getAttribute("id");
	var fromId = downTarget.parentNode.getAttribute("id");
	var toList = stateArcs[toId];							//add arc Id to stateArcs
	toList[toList.length] = fromId+toId;
	stateArcs[toId] = toList;
	var character = prompt("Please enter the character associated with this arc:")
    if (character == null){
    	return;
    }
	var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
	var arc = document.createElementNS("http://www.w3.org/2000/svg", "path");
	/*some of this is math, some of this is trial and error*/
	var x1 = (cx - (1)*20)+10;
	var fracR = Math.pow(((3/4)*20), 2);
	var sqrt = Math.sqrt(Math.pow(20, 2)-fracR);
	var y1 = (cy + sqrt)-20;
	var x2 = (cx + (1)*20)-10;
	var y2 = y1;
	var midX = ((x1+x2)/2);
	var midY = ((y1+y2)/2)-40;
	arc.setAttribute("d", "M "+x1+" "+y1+" "+"A 20 20 0 1 1 "+x2+" "+y2);
	arc.setAttribute("marker-end", "url(#arrow)");
	arc.setAttribute("fill", "none");
	arc.setAttribute("stroke", "#A9A9A9");
	arc.setAttribute("stroke-width", "2");
	var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	text.setAttribute("x", midX);
    text.setAttribute("y", midY);
    text.setAttribute("font-family", "sans-serif");
	text.setAttribute("font-size", "14px");
	text.setAttribute("fill", "#FF3B3F");
	text.textContent = character;
	g.appendChild(arc);
	g.appendChild(text);
	g.setAttribute("id", (fromId+toId));
	var svg = document.getElementById("canvas");
	svg.appendChild(g);
}

function drawLine(x1, y1, x2, y2, targetElement) {
	var toId = targetElement.parentNode.getAttribute("id"); //find Ids of connected nodes
	var fromId = downTarget.parentNode.getAttribute("id");
	var toList = stateArcs[toId];							//add arc Id to stateArcs
	toList[toList.length] = fromId+toId;
	var fromList = stateArcs[fromId];
	fromList[fromList.length] = fromId+toId;
	stateArcs[toId] = toList;
	stateArcs[fromId] = fromList;
	var character = prompt("Please enter the character associated with this arc:")
    if (character == null){
    	return;
    }
	var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
	var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
	var dist = Math.sqrt(Math.pow(y1-y2, 2) + Math.pow(x1-x2, 2)); //determine coordinates of start and end of line
	var xOffset = ((40*(x1-x2)) / dist);
	var yOffset = ((40*(y1-y2)) / dist);
    line.setAttribute("x1", this.x1);
    line.setAttribute("y1", this.y1);
    line.setAttribute("x2", this.x2+xOffset);
    line.setAttribute("y2", this.y2+yOffset);
    line.setAttribute("stroke", "#A9A9A9");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("marker-end", "url(#arrow)");
    var textX = ((x1+x2)/2);						//determine coordinates of text
    var textY = ((y1+y2)/2);
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", textX);
    text.setAttribute("y", textY);
    text.setAttribute("font-family", "sans-serif");
	text.setAttribute("font-size", "14px");
	text.setAttribute("fill", "#FF3B3F");
	text.textContent = character;
    g.setAttribute("id", (fromId + toId));
    g.appendChild(line);
    g.appendChild(text);
    var svg = document.getElementById("canvas");
    svg.insertBefore(g, svg.firstChild);
}

function draw(e) {
    var pos = getMousePos(canvas, e);
    posx = pos.x;
    posy = pos.y;
    var state = prompt("Please enter the name of this state:")
    if (state == null){
    	return;
    }
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var svg = document.getElementById("canvas");
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx",posx);
	circle.setAttribute("cy",posy);
	circle.setAttribute("r",20);
	circle.setAttribute("fill", "#CAEBF2");
	circle.setAttribute("stroke", "#A9A9A9");
	g.appendChild(circle);
	var stateText = document.createElementNS("http://www.w3.org/2000/svg", "text");
	stateText.setAttribute("x", posx-10);
	stateText.setAttribute("y", posy+5);
	stateText.setAttribute("font-family", "sans-serif");
	stateText.setAttribute("font-size", "12px");
	stateText.setAttribute("fill", "#A9A9A9");
	stateText.textContent = state;
	g.appendChild(stateText);
	//g.setAttribute("onclick", "clickHandler(this)");
	var clickCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	clickCircle.setAttribute("cx",posx);
	clickCircle.setAttribute("cy",posy);
	clickCircle.setAttribute("r",20);
	clickCircle.setAttribute("fill-opacity", "0.0");
	clickCircle.setAttribute("onmousedown", "mouseDownHandler(event)");
	clickCircle.setAttribute("onmouseup", "mouseUpHandler(event)");
	g.appendChild(clickCircle);
	g.setAttribute("id", stateIndex);
	stateArcs[stateIndex] = [];
	stateIndex += 1;
	svg.appendChild(g);
	if (state == "0"){
    	startState = g;
    }
   
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left, 
      y: evt.clientY - rect.top,
    };
}
