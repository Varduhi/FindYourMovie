$(document).ready(function() {
	
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
	
	var root = {"name":"Me","children":genreNodes};
	render(root);	
}

  function render(root){
	var nodes = flatten(root);
	console.log(nodes);
}

function flatten(root) {
  var nodes = [], i = 0;

  function recurse(node) {
    if (node.children) node.size = node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
    if (!node.id) node.id = ++i;
    nodes.push(node);
    return node.size;
  }

  root.size = recurse(root);
  return nodes;
}
