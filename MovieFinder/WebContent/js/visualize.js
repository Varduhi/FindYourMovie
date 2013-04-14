var webWidth = 1280;
var webHeight = 1280;
var link,node,webOfMovies,root;

var force = d3.layout.force()
    .on("tick", tick)
    .size([webWidth, webHeight]);


$(document).ready(function() {

	webOfMovies = d3.select("#webOfMovies").append("svg")
	    .attr("width", webWidth)
	    .attr("height", webHeight);

	queue()
	    .defer(d3.json, "movies")
	    .defer(d3.json, "genres")
	    .await(ready);

});

function ready(error, movies, genres) {

	 //process the data into a structure we can feed to the layout
	 var genreNodes = [];
	 var genreMap = {};
	 for(var i=0;i<genres['genres'].length;i++){
		var genre = {};
		genre.name = genres['genres'][i];
		genre._children = [];

		genreNodes.push(genre);
		genreMap[genre.name] = genre;
	}
	 //add the movies as children of the genres
	 for(var i=0;i<movies['movies'].length;i++){
		var movie = movies['movies'][i];
		var movieGenres = movie['movieGenres'];
		for(var j=0;j<movieGenres.length;j++){
			if(movieGenres[j] in genreMap){
				genreMap[movieGenres[j]]._children.push(movie);
			}
		}
	}

	root = {"name":"Me","children":genreNodes};
	
    console.log(genreNodes);
	root.fixed = true;
	root.x = webWidth/2;
	root.y = webHeight/2 - 80;



	render();
}

  function render(){
	var nodes = flatten(root);

	links = d3.layout.tree().links(nodes);

  // Restart the force layout.
  force
      .nodes(nodes)
      .links(links)
      .linkDistance(60)
	    .charge(-300)
      .start();

  // Update the links…
  
link = webOfMovies.selectAll("line.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links.
  link.enter().insert("svg:line", ".node")
      .attr("class", "link")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  // Exit any old links.
  link.exit().remove();

  // Update the nodes…
  node = webOfMovies.selectAll("circle.node")
      .data(nodes, function(d) { return d.id; })
      .style("fill", color);

  // Enter any new nodes.
  node.enter().append("svg:circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return 10; })
      .style("fill", color)
      .on("click", click)
      .call(force.drag)
      .append("svg:title")
      .text(getTheTip);

  // Exit any old nodes.
  node.exit().remove();


}

// Color leaf nodes orange, and packages white or blue.
function color(d) {
  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
}

function getTheTip(d) {
  if (d._children) {
    return d.name + " (" + d._children.length + ")";
  } else {
    return d.movieTitle;
  }
}

function flatten(root) {
  var nodes = [], i = 0;

  function recurse(node) {
    if (node.children) node.children.forEach(recurse);
    if (!node.id) node.id = ++i;
    nodes.push(node);
  }

  recurse(root);
  return nodes;
}

function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  render();
}

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}
