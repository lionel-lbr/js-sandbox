
const MAP = [
            [0,0,1,0,0,0,0,0,0,0],  // 0
            [0,1,1,1,0,0,1,1,0,0],  // 1
            [0,1,1,1,0,1,1,1,1,0],  // 2
            [1,1,1,0,0,1,1,1,1,0],  // 3
            [0,0,0,0,0,1,1,1,0,0],  // 4
            [0,1,1,0,0,1,1,0,0,0],  // 5
            [0,0,0,0,0,0,0,0,1,0]]  // 6

function findOneIsland(x,y) {
  var connectedNodes=[] 
  const visited = (p) => connectedNodes.find((e) => (e.x == p.x && e.y == p.y)) ? true : false ;

  
  const findAllConnectedNodes = (x,y) => {
    // get top left bottom right coner around the starting point. 
    var top = (y-1)>=0 ? y-1 : y;
    var left = (x-1)>=0 ? x-1 : x;
    var bottom = y<=(MAP.length-2) ? y+1 : y ; 
    var right = x<=(MAP[0].length-2) ? x+1 : x ; 

    // mark the first node as visited
    connectedNodes.push({x:x, y:y});
    for(var i=left; i<=right;i++) {
      for(var j=top; j<=bottom ;j++) {
        if (MAP[j][i]==1) {
          if (visited({x:i, y:j}))
            continue;
          else 
            findAllConnectedNodes(i,j) ;
        }
      } 
    }
  }
  
  findAllConnectedNodes(x, y) ;
  return connectedNodes ;
}
  
var islands=[]
function isPartOfOneIsland(p) {
  return islands.find((i) => (i.find((e) => (e.x == p.x && e.y == p.y)) ? true : false)) ? true : false ;
}

for(var x=0; x<MAP[0].length;x++) {
  for(var y=0; y<MAP.length ;y++) {
    console.log(`x:${x} y:${y}`)
    if (MAP[y][x]==1 && !isPartOfOneIsland({x:x, y:y})) {
      islands.push(findOneIsland(x,y))
    }
  } 
}

console.log("Number of island:", islands.length)