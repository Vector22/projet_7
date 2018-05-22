// envoie et recuperation des donnees sur le serveur flask/python
/*$(function() {

    $('button').click(function() {

        var text = $('input').val();
        console.log(text)
        $.ajax({
            url: '/localize',
            data: $('form').serialize(),
            type: 'POST',
            success: function(response) {
            	r = JSON.parse(response)
            	lng = r.info.results[0].geometry.location.lng
            	lat = r.info.results[0].geometry.location.lat
            	address = r.info.results[0].formatted_address
            	console.log("Longitude :" + lng + "\nLatitude :" + lat);
            	console.log("Adresse : " + address)
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});*/
$(function () {
    // fonction de recuperation de donnees
    /*$.ajax({
        url: 'the url',
        success: function(data) {
            console.log('get info');
            $('#info').html(JSON.stringify(data, null, '   '));
            $('#description').html(data['description']);
        }
    });*/

	/*function appelAjax(f) {
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
		//console.log(reponse);
		longitude = r.info.results[0].geometry.location.lng;
		latitude = r.info.results[0].geometry.location.lat;
		console.log(latitude);
		console.log(longitude);
	}*/

	function appelAjax() {
	 return $.ajax({
	 url: '/localize',
	 data: $('form').serialize(),
	 type: 'POST',
	 error: function(error) {
	 	console.log(error);
	 	}
	 });
	}

	$('button').click(function() {
		//appelAjax(retourServeur);
		retour = appelAjax().then(function(resultat) {
 		//Traitement du résultat
 		var r = JSON.parse(resultat);
 		return r;
		});
		console.log(retour)
	});

});