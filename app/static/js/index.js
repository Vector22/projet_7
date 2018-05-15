
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
		r = JSON.parse(reponse)

		longitude = r.info.results[0].geometry.location.lng;
		latitude = r.info.results[0].geometry.location.lat;
		address = r.info.results[0].formatted_address;
		//console.log(latitude);
		//console.log(longitude);
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
        address = address.replace(/ /gi, ',');
        var tabAddress = address.split(',');
        // selectionne la premiere chaine qui n'est pas un nombre
        var goodsAddress = null;
        for (i=0; i< tabAddress.length; i++) {
        	var address = parseInt(tabAddress[i], 10)
        	if (isNaN(address))
        		{
        			goodsAddress = tabAddress[i];
        		  	break;
        		}
        }
        //console.log('bonne adresse: ' + goodsAddress);

        host_url = '/tell_history/' + String(goodsAddress);
        $.ajax({
        	type: 'GET',
        	url: host_url,
        	success: function(data) {
        		data = JSON.parse(data);

        		var title = data.history.parse.title;
	        	var markup = data.history.parse.text["*"];
               	var content = $('<div></div>').html(markup);
               	
               	// remove links as they will not work
               	// and remove some descriptions
            	content.find('a').each(function() {
            		$(this).replaceWith($(this).html());
            	});
		        // add a history title to the page
		        $('#history_title').html("Une histoire sur " + String(title));
		        // add a bref paragraph as information
		        $('#history_content').html($(content).find('p'));
        	},
        	error: function(error) {
        		console.log(error);
        	}
    	});
	}

	$('button').click(function() {
		appelAjax(retourServeur);
	});

});
