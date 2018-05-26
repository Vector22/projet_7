
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
		// Initialisons une carte dans la balise ayant l'id map
		map = new google.maps.Map(document.getElementById("map"), {
          // Nous plaçons le centre de la carte avec les coordonnées ci-dessus
          center: new google.maps.LatLng(latitude, longitude),
          // Nous définissons le zoom par défaut
          zoom: 10, 
          // Nous définissons le type de carte (ici carte routière)
          mapTypeId: google.maps.MapTypeId.ROADMAP, 
          // Nous activons les options de contrôle de la carte (plan, satellite...)
          mapTypeControl: true,
          // Nous désactivons la roulette de souris
          scrollwheel: false, 
          mapTypeControlOptions: {
            // Cette option sert à définir comment les options se placent
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR 
          },
          // Activation des options de navigation dans la carte (zoom...)
          navigationControl: true, 
          navigationControlOptions: {
            // Comment ces options doivent-elles s'afficher
            style: google.maps.NavigationControlStyle.ZOOM_PAN 
          }
        });
        // Nous ajoutons un marqueur
        var marker = new google.maps.Marker({
          // Nous définissons sa position (syntaxe json)
          position: {lat: latitude, lng: longitude},
          // Nous définissons à quelle carte il est ajouté
          map: map
        });

        // Faisons une autre requete ajax pour recuperer les infos de
        // l'api media wiki retournees par le serveur
        
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

	$('#submit').click(function(e) {
		e.preventDefault();
		appelAjax(retourServeur);
	});

});
