  // Additional JS functions here
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '530614120313335', // App ID
      channelUrl : 'channel.html', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });

	FB.getLoginStatus(function(response) {
	  if (response.status === 'connected') {
	   getData();
	  } else if (response.status === 'not_authorized') {
	     login();
	  } else {
	     login();
	  }
	 });


  };


  function login() {
    FB.login(function(response) {
        if (response.authResponse) {
  	         getData();
	        // window.location.href = "http://web-of-movies.herokuapp.com/dataVisualization.html";
        }
    });
}

  function getData() {
	    console.log('Welcome!  Fetching your information.... ');
	    FB.api('/me', function(response) {
	  			 
	    	   name= response.name ;
			  
			   FB.api('/me/picture?width=80&height=80',  function(response) {

				url=response.data.url ;
				window.location.href = "http://web-of-movies.herokuapp.com/dataVisualization.html" + "?" + "name=" + name + "&url=" +url;	
	  });
    });
	}

  // Load the SDK Asynchronously
// Load the SDK Asynchronously
function loginToFaceBook(){

   var js, id = 'facebook-jssdk', ref = document.getElementsByTagName('script')[0];
   if (document.getElementById(id)) {return;}
   js = document.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all.js";
   ref.parentNode.insertBefore(js, ref);
 };