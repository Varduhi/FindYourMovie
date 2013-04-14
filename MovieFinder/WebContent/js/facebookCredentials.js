$(document).ready(function() {
	
	//Gets value for URL parameter
	function getParameterByName(name){
	    var url     = document.URL,
	        count   = url.indexOf(name);
	        sub     = url.substring(count);
	        amper   = sub.indexOf("&"); 

	    if(amper == "-1"){
	        var param = sub.split("=");
	        return param[1];
	    }else{
	        var param = sub.substr(0,amper).split("=");
	        return param[1];
	    }

	};

	//Handler of "Logout" button
	function fbLogout(){
	    window.location.href = "http://web-of-movies.herokuapp.com"; 
	  return;  
	};
	
	// Add FB username, profile photo  and "Logout" button
    document.getElementById('account-photo').innerHTML = (
            '<img src="' + getParameterByName("url") + '"> ');

    document.getElementById('account-info').innerHTML = (
                    getParameterByName("name").replace("%20"," "));
	
})