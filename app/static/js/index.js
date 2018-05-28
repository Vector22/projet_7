
$(function () {

	function appelAjax(f) {
		$.ajax({
            url: '/localize',
            data: $('form').serialize(),
            type: 'POST',
            success: f,
            error: function(error) {
                console.log(error);
            }
        });
	}

	function retourServeur(reponse) {
		// print the loading image
		$('#map').html('<img src="../images/loading.gif">');
		r = JSON.parse(reponse);

		longitude = r.info.results[0].geometry.location.lng;
		latitude = r.info.results[0].geometry.location.lat;
		address = r.info.results[0].formatted_address;

		// update the conversation section
		var question = document.createElement('p');
		question.innerHTML =  '<p class="question">Moi : ' + $('input').val() + '</p></br>';
		question.innerHTML += '<p class="reponse">GrandPy : Bien sure que Oui !' + address + '</p></br></br>';

		$('#conversation').append(question);
		console.log(latitude);
		console.log(longitude);
		console.log(address);
		// Initialize a map in the tag having the id map
		map = new google.maps.Map(document.getElementById("map"), {
          // We place the center of the map with the coordinates above
          center: new google.maps.LatLng(latitude, longitude),
          // We set the default zoom
          zoom: 10, 
          // We define the type of map (here road map)
          mapTypeId: google.maps.MapTypeId.ROADMAP, 
          // We activate the control options of the map (plan, satellite ...)
          mapTypeControl: true,
          // We disable the mouse wheel
          scrollwheel: false, 
          mapTypeControlOptions: {
            // This option is used to define how the options are placed
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR 
          },
          // Activate navigation options in the map (zoom ...)
          navigationControl: true, 
          navigationControlOptions: {
            // How should these options appear?
            style: google.maps.NavigationControlStyle.ZOOM_PAN 
          }
        });
        // We add a marker
        var marker = new google.maps.Marker({
          // We define its position (json syntax)
          position: {lat: latitude, lng: longitude},
          // We define which map it is added to
          map: map
        });

        // Let's make another ajax request to retrieve the info from
        // the media wiki API returned by the server
        
        host_url = '/tell_history/' + String(latitude) + ':' + String(longitude);
        console.log(host_url);

        $.ajax({
        	type: 'GET',
        	url: host_url,
        	success: function(data) {
        		var data = JSON.parse(data);
		        var title = data.history.title;
		        var description = data.history.description;
		        var state = data.history.state;

		        // add them to the web page if success
		        if (state) {
		        	$('#history_title').html("Une histoire sur " + title);
		        	$('#history_content').html(description);
		        }
		        else { // add a generic description
		        	$('#history_title').html(title);
		        	$('#history_content').html(description);
		        }
        	},
        	error: function(error) {
        		console.log(error);
        	}
    	});
	}

	//pressing the send button to validate
  $('#submit').click(function() {
    appelAjax(retourServeur);
  });
  //Validate without press the send button
  $('#mainForm').submit(function(e) {
    e.preventDefault();
    appelAjax(retourServeur);
  });

});
