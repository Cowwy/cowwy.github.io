/*\
|*| =========================================================
|*|  GLOBAL TEMPOARY STORAGE
|*| =========================================================
\*/
	let sessionState = {
		ip            : undefined,
		ipReady       : false,

		location      : undefined,
		locationReady : false
	};

	const bkgImg = {
		"ON" : "https://www.avantageontario.ca/wp-content/uploads/2016/09/Ontario03.jpg",
		"US" : "https://d15z338h2xlr9d.cloudfront.net/wp-content/uploads/2017/05/Iconic-US-Landmarks-You-Dont-Want-to-Miss.jpg",
		"XX" : "https://wallpaperbro.com/img/100510.jpg"
	};

	Object.freeze( bkgImg );
/*\
\*/



/*\
|*| =========================================================
|*|  DOCUMENT READY - RETRIEVE YOUR IP AND LOCATION
|*| =========================================================
\*/
	document.addEventListener( "DOMContentLoaded", function( e ) {
		let loadContainer     = document.getElementById( "loading" );
		let locationContainer = document.getElementById( "location" );


		// WAITING FOR API TO FINISH LOADING BEFORE
		// LOADING ANYTHING ON THE PAGE
		let time = setInterval( function( e ) {
			if( sessionState.ipReady == true && sessionState.locationReady == true ) {
				clearInterval( time );

				loadContainer.className = "fullPage hide";
				locationContainer.className = "fullPage show";

				pageReady( );
			}
		}, 100 );

		getMyIP( );
	});
/*\
\*/
			


/*\
|*| =========================================================
|*|  XML HTTP REQUEST COMPLETE
|*| =========================================================
\*/
	function pageReady( ) {
		const city    = sessionState.location.city;				//Scarborough
		const country = sessionState.location.country_name;		//Canada
		const regCode = sessionState.location.region_code;		//ON
	
		document.getElementById( "data-ip" ).innerHTML  = sessionState.ip;
		document.getElementById( "data-loc" ).innerHTML = city + ", " + regCode + " " + country;
		
		if( bkgImg[regCode] == undefined ) {
			document.getElementById( "fullBkg" ).style.backgroundImage = "url('" + bkgImg["XX"] + "')";
		} else {
			document.getElementById( "fullBkg" ).style.backgroundImage = "url('" + bkgImg[regCode] + "')";
		}
		
	}
/*\
\*/



/*\
|*| =========================================================
|*|  API Usage
|*| =========================================================
\*/
	function getMyIP( ) {
		let api  = "https://skitsanos-getip-v1.p.rapidapi.com/getip";

		let xhr = new XMLHttpRequest();

		xhr.addEventListener("readystatechange", function (e) {
			if (this.readyState == 4 && this.status == 200 ) {
				let response = JSON.parse( this.responseText );
					sessionState.ip      = ( response.result ).split(",")[0];
					sessionState.ipReady = true;

				sessionState.location = getMyLocation( sessionState.ip );
			}
		});

		xhr.open("GET", api, true );
		xhr.setRequestHeader("x-rapidapi-host", "skitsanos-getip-v1.p.rapidapi.com");
		xhr.setRequestHeader("x-rapidapi-key", "14f1d99cedmsh425bcca2b0ad266p1aee66jsnb16295d8725f");
		xhr.send(null);
	}


	function getMyLocation( ip ) {
		let api = "https://jkosgei-free-ip-geolocation-v1.p.rapidapi.com/" + ip + "?api-key=test";
		let xhr = new XMLHttpRequest();

		xhr.addEventListener("readystatechange", function (e) {
			if (this.readyState == 4 && this.status == 200 ) {
				sessionState.location      = JSON.parse( this.responseText );
				sessionState.locationReady = true;
			}
		});

		xhr.open("GET", api, true );
		xhr.setRequestHeader("x-rapidapi-host", "jkosgei-free-ip-geolocation-v1.p.rapidapi.com");
		xhr.setRequestHeader("x-rapidapi-key", "14f1d99cedmsh425bcca2b0ad266p1aee66jsnb16295d8725f");
		xhr.send(null);
	}
/*\
\*/