var webWidth = 1200;
var webHeight = 700;
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
		genre.children = [];

		genreNodes.push(genre);
		genreMap[genre.name] = genre;
	}
	 //add the movies as children of the genres
	 for(var i=0;i<movies['movies'].length;i++){
		var movie = movies['movies'][i];
		var movieGenres = movie['movieGenres'];
		for(var j=0;j<movieGenres.length;j++){
			if(movieGenres[j] in genreMap){
				genreMap[movieGenres[j]].children.push(movie);
			}
		}
	}

    var imageUrl = getUrlVars()['url'];
	root = {"name":"Me","children":genreNodes,"profile":imageUrl};
	
	var defs = webOfMovies.append('svg:defs');
            defs.append('svg:pattern')
                .attr('id', 'profile')
                .attr('patternUnits', 'userSpaceOnUse')
                .attr('width', '6')
                .attr('height', '6')
                .append('svg:image')
                .attr('xlink:href', 'http://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Mona_Lisa_headcrop.jpg/250px-Mona_Lisa_headcrop.jpg')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', 6)
				.attr('height', 6);
	
	
	root.fixed = true;
	root.x = webWidth/2;
	root.y = webHeight/2 - 80;


    var nodes = flatten(root);
	nodes.forEach(function(d) {
	   if(d.name != "Me"){
	   d._children = d.children;
	   d.children = null;
	}
	   
	});

    
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
      .attr("class", function(d){if(d.name === "Me") return "root"; else return "node"})
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return 10; })
      .style("fill", color)
      .on("click", click)
      .call(force.drag)
      .append("svg:title")
      .text(getTheTip);

webOfMovies.selectAll("circle.root").append("text")
	      .attr("dx", 12)
	      .attr("dy", ".35em")
	      .attr("fill","black")
	      .attr("stroke-width",12)
	      .text(function(d) { return d.name });

  // Exit any old nodes.
  node.exit().remove();


}

function color(d) {
  return d._children ? "#6FFF00" : d.children ? "#6FFF00" : "#4D4DFF";
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

function updateWeb(data){
	console.log(data);
	var newMovies = data.movies;
	
	for(var i=0; i<root.children.length;i++){
		var genre = root.children[i];
		var children = [];
		if(genre.children){
			children = genre.children;
		}
		else
		   children = genre._children;
		var newChildren = [];
		for(var j=0;j<children.length;j++){
			var child = children[j];
			var match = false;
			for(var k=0;k<newMovies.length;k++){
				if(child == newMovies[k])
				    match = true;
			}
			if(match){
			   newChildren.push(child);	
			}
		}
		
		children = newChildren;
	}
	
    render();	
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
