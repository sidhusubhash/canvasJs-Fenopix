var canvas,context;
var dragging=false;
var dragStartLocation;
var snapshot, xx;
var color
var shapes=[]
var moving = false
var movingCoordinates = {}
/*Getting the coordinates */
function getCoordinates(event){
  var x = event.clientX -canvas.getBoundingClientRect().left;
  var y = event.clientY-canvas.getBoundingClientRect().top;
  return {x: x,y: y};
};
/*Coordinates stored in the shapes array is passed to drawTriangle function */
function drawShapes() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for(var i = 0; i < shapes.length; i++) {
    drawTriangle(shapes[i])
  }
  if(currentShape){
    drawTriangle(currentShape)
  }
}
/*Drawing the Triangle and filling it with colors*/
function drawTriangle(sh) {
  context.beginPath();
  context.moveTo(sh.x1, sh.y1);
  context.lineTo(sh.x2, sh.y2);
  context.lineTo(sh.x3, sh.y3);
  context.closePath()
  context.strokeStyle = 'blue';
  context.lineWidth = 7;
  context.fillStyle=sh.color;
  context.fill();
  context.stroke();
}
/*Calculating the third coordinate of the triangle*/
function drawLine(position, idx){
  var secondX;
  if(dragStartLocation.x < position.x) {
    secondX = dragStartLocation.x - Math.abs(dragStartLocation.x - position.x)
  } else {
    secondX = Math.abs(dragStartLocation.x - position.x) + dragStartLocation.x
  }
  /*when no shape is moving */
  if (!moving) {
    currentShape = {
      x2: position.x,
      y2: position.y,
      x1: dragStartLocation.x,
      y1: dragStartLocation.y,
      x3: secondX,
      y3: position.y,
      color: color
    }
    if (idx) { /*pushing the coordinates to the shapes array*/
      shapes.push({
        x2: position.x,
        y2: position.y,
        x1: dragStartLocation.x,
        y1: dragStartLocation.y,
        x3: secondX,
        y3: position.y,
        color: color
      })
      currentShape = undefined;
    }
  } else {   /*Updating the coordinates for dragging the whole shape*/
    xDiff = position.x - dragStartLocation.x;
    yDiff = position.y - dragStartLocation.y;
    shapes[movingIndex] = {
      x2: movingCoordinates.x2 + xDiff,
      y2: movingCoordinates.y2 + yDiff,
      x1: movingCoordinates.x1 + xDiff,
      y1: movingCoordinates.y1 + yDiff,
      x3: movingCoordinates.x3 + xDiff,
      y3: movingCoordinates.y3 + yDiff,
      color: shapes[movingIndex].color
    }
  }
}
/*finding the drag start location and the coordinates of the moving triangle from the shapes array*/
function clicked(event){
  dragging = true;
  color = "#"+Math.ceil(Math.random()*1000000);
  dragStartLocation = getCoordinates(event);

  for(var i = 0; i < shapes.length; i++) {
    if(isInside(shapes[i].x1, shapes[i].y1, shapes[i].x2, shapes[i].y2, shapes[i].x3, shapes[i].y3, dragStartLocation.x, dragStartLocation.y)){
      moving=true;
      movingIndex = i;
      movingCoordinates = {
        x1: shapes[i].x1,
        y1: shapes[i].y1,
        x2: shapes[i].x2,
        y2: shapes[i].y2,
        x3: shapes[i].x3,
        y3: shapes[i].y3
      }
    }
  }
}
/*removing the coordinates from shapes array while double clicking*/
function onDblClick(event){
  var clickLocation = getCoordinates(event);

  for(var i = 0; i < shapes.length; i++) {
    if(isInside(shapes[i].x1, shapes[i].y1, shapes[i].x2, shapes[i].y2, shapes[i].x3, shapes[i].y3, clickLocation.x, clickLocation.y)){
      shapes.splice(i, 1)
      drawShapes()
      break;
    }
  }
}
/*while dragging the mouse*/
function drag(event){
  var position;
  var color = "#"+Math.ceil(Math.random()*1000000)
  if(dragging===true){
    position = getCoordinates(event);
    drawLine(position);
    drawShapes();

  }
} /*when the dragging finishes*/
function released(event){
  var position=getCoordinates(event);
  if (dragging) {
    drawLine(position, 1);
    drawShapes()
  }
  dragging=false;
  moving = false;
  movingCoordinates = {}
}
/*Adding different Event Listeners to the canvas*/
function draw(){
  canvas = document.getElementById('canvas');
  context=canvas.getContext('2d');
  canvas.width= 3800;//window.innerWidth;
  canvas.height=1800;//window.innerHeight;

  canvas.addEventListener('mousedown', clicked);
  canvas.addEventListener('mousemove', drag);
  canvas.addEventListener('mouseup', released);
  canvas.addEventListener("dblclick", onDblClick);
};

/*Checking whether the point is inside the Triangle or not*/
function area(x1, y1, x2, y2, x3, y3){
   return Math.abs((x1*(y2-y3) + x2*(y3-y1)+ x3*(y1-y2))/2.0);
}
function isInside(x1, y1, x2, y2, x3, y3, x, y){
   /* Calculate area of triangle ABC */
   var A = area (x1, y1, x2, y2, x3, y3);

   /* Calculate area of triangle PBC */
   var A1 = area (x, y, x2, y2, x3, y3);

   /* Calculate area of triangle PAC */
   var A2 = area (x1, y1, x, y, x3, y3);

   /* Calculate area of triangle PAB */
   var A3 = area (x1, y1, x2, y2, x, y);

   /* Check if sum of A1, A2 and A3 is same as A */
   return (A === A1 + A2 + A3);
}

window.addEventListener('load',function(event){
  draw();
});
/*Resetting the canvas*/
var reset = document.getElementById('reset');
reset.addEventListener('click',function(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  shapes = [];
});
