var express = require('express');
var router = express.Router();
var prev_pages = [];
var current_page;
/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect("Home");
});
var next_user = 0;
var users =[];
var uniqueID = 0;
var empty_user = {"uID" : 0, "fname":"", "lname":"", "dob":"", "email":"", "pwd":"", "tel":""}

router.get('/Map', function(req,res) {
	prev_pages.push(current_page);
	current_page = "maps.html";
	res.redirect("Map.html");
}

router.get('/Home', function(res, req) {
	prev_pages.push(current_page);
	current_page = "Home.html";
	res.redirect("Home.html");
});

router.get('/SearchHotels', function(res, req) {
	prev_pages.push(current_page);
	current_page = "Home.html";
	res.redirect("Home.html");
});

router.get('/back', function(req,res) {
	var page = prev_pages.pop();
	prev_pages.splice(0,prev_pages.length-1);
	res.redirect(page);
})

router.post('/signup', function(req,res) {
	sess = req.session;
	// adds user to users array and logs in by adding user to session
	users[next_user].uID = uniqueID;
	uniqueID++; // different for every user
	users[next_user].fname = req.body.fname;
	users[next_user].lname = req.body.lname;
	users[next_user].dob = req.body.dob;
	users[next_user].email = req.body.email;
	users[next_user].dob = req.body.dob;
	// password comparison would need to be done client-side
	users[next_user].pwd = req.body.pwd;
	users[next_user].tel = req.body.tel;
	// log in
	sess.current_user = user[next_user];
	// next user to be added is the next one of the
	users.push(empty_user);
	next_user++;
	res.redirect(prev_pages[prev_pages.length - 1]);
});

router.post('/login', function(req, res) {
	sess = req.session;
	if (check_names(req.body.email)) {
		if (check_password(req.body)) {
			// password matches username
			// add user to session
			sess.user = get_user_from_email(req.body.email);
			res.redirect(prev_pages[prev_pages.length - 1]);
		} else {
			// password does not match username
			res.redirect("login.html" /* passwd does not match email... how to display message? */);
		}
	} else {
		// no matching username
		res.redirect("login.html");
	}
});

function check_email(given_email) {
	// iterate through users
	for (var i = 0; i < users.length; i++) {
		// if any match return true
		if (users[i].email == given_name) {
			return true;
		}
	}
	// if none pass, return false
	return false;
}

function get_user_from_email(email) {
	// iterate through users
	for (var i = 0; i < users.length; i++) {
		// if any match return the user
		if (users[i].email == given_name) {
			return users[i];
		}
	}
}

function check_password(given_user) {
	for (var i = 0; i < users.length; i++) {
		// if any match return true

		if (users[i].email == given_user.email) {
			if (users[i].pwd == given_user.pwd) {
				return true;
			} else {
				return false;
			}
		}
	}
	return false;
}

var InterContinental = {
  name:"InterContinental",
  location: {lat: -34.9212 , lng: 138.6059},
  city: "Adelaide",
  price: 550,
  features: [0,1,2,3,4,5,6],
  stars: 4,
  img_src: ["images/hotel1.jpg"],
  description: "Exclusively positioned on the banks of the River Torrens, InterContinental Adelaide provides luxury city centre accommodation, dining and meeting facilities. Situated adjacent to the Adelaide Festival Centre, Convention Centre, Casino and directly opposite the spectacular Adelaide Oval, our location provides effortless exploring and entertainment at your fingertips."
};

var Hilton = {
  name: "Hilton",
  location: {lat: -34.929143, lng: 138.598906},
  city: "Adelaide",
  price: 330,
  features: [0,1,3,4],
  stars: 4,
  img_src: ["images/hotel2.jpg"],
  description: "Overlooking Victoria Square, Hilton Adelaide is set in the heart of the city’s entertainment, shopping and dining precincts. The Central Market, Chinatown and Gouger Street - Adelaide’s most vibrant dining destinations – are also minutes away."
};

var all_hotels = [InterContinental, Hilton];

router.get('/SearchHotels', function(req, res) {
  prev_pages.push(current_page);
  current_page = "SearchHotels.html";

  var searchedHotels = hotels_from_search(req.body);
  var div_content = "";
  for (var i = 0; i < req.body.length; i++) {
	  div_content += '<p class="imageinfo"><img src='+req.body[i].img_src+
	  				'alt="Hotel '+i+
					'class="hotels"><strong>Name: </strong> '+req.body[i].name+
					'<br> <strong>Stars: '+write_stars(req.body[i].stars)+
					'</strong><br> <strong>Price: </strong>$'+req.body[i].price+
					'per night<br> <strong>Location: </strong>'+req.body[i].city+
					'</p><p>'+ write_features(req.body[i].features).join(" | ") +'</p>';
  }

  res.send('<!DOCTYPE html> \
  <html lang="en" dir="ltr"> \
    <head> \
      <meta charset="utf-8"> \
      <title>Home</title> \
      <title>PLACEHOLDER</title> \
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script> \
      <meta charset="utf-8"> \
      <meta name="viewport" content="width=device-width, initial-scale=1"> \
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"> \
      <link rel="stylesheet" type = "text/css" href="stylesheets/placeholder.css"> \
      <link rel="stylesheet" type = "text/css" href="stylesheets/maps.css"> \
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script> \
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Karla%7COxygen%7CRubik"> \
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"> \
      <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"> \
      <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script> \
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> \
      <script src="javascripts/placeholder.js"></script> \
      <script src="javascripts/hotels.js"></script> \
      <script src="javascripts/maps.js"></script> \
    </head> \
    <body> \
      <!-- HEADER --> \
      <header> \
        <!-- acts as home button --> \
        <form action="/Homepage" method="get"> \
          <button type = "submit" id="placeholdertext"><span onclick="go_home()"><span class="firstTitleColour">place</span><span class="secondTitleColour">holder</span></span></button> \
        </form> \
        <!-- login signup buttons --> \
        <form action="Signup.html"> \
          <button onclick="signup_button()" class = "login_sign-up btn btn-default" id ="su"> Sign-up </button> \
        </form> \
        <form action="Login.html"> \
          <button onclick="login_button()" class = "login_sign-up btn btn-default" > Login </button> \
        </form> \
      </header> \
      <!-- DISPLAY OF HOTELS --> \
	 <div class="container-fluid text-center feature_page" id="places_and_area_div"> \
        <div class="row content"> \
          <div class="col-sm-12 text-left"> \
            <div class="col-md-12"> \
              <h1>Hotels</h1> \
		    '+div_content+'
              <!--all onclick detail functions pass the name of the hotel--> \
              <button type="button" class="btn btn-default button_details_booknow" onclick="details("InterContinental","Adelaide(CBD)",550,"images/hotel1.jpg")">Details</button> \
              <button type="button" class="btn btn-default button_details_booknow" onclick="book_details_search("InterContinental","Adelaide(CBD)",550)">Book Now</button> \
              <div style="clear:both;"></div> \
              <p class="imageinfo"><img src="images/hotel2.jpg" alt="Hotel 2" class="hotels"><strong>Name: </strong> Hilton <br> <strong>Stars:<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></strong><br> <strong>Price: </strong>$380 per night<br> <strong>Location: </strong>Adelaide (CBD)</p> \
              <button type="button" class="btn btn-default button_details_booknow" onclick="details("Hilton","Adelaide(CBD)",380,"images/hotel2.jpg")">Details</button> \
              <button type="button" class="btn btn-default button_details_booknow" onclick="book_details_search("Hilton","Adelaide(CBD)",380)">Book Now</button> \
              <br> \
            </div> \
          </div> \
        </div> \
        <button type="button" name="button" class="btn btn-default back_button" onclick="back_button_hotels()">Back</button> \
      </div> \
      <!-- FOOTER --> \
      <footer class="container-fluid text-center"> \
        <p>Footer Text</p> \
      </footer> \
    </body> \
  </html>'
);

function write_stars(n) {
	var stars = "";
	var i = 0;
	while (i<n) {
		stars += "<i class='fa fa-star'>";
		i++;
	}
	return stars;
}

var features = ["wifi", "pool", "spa", "undercover parking", "restaurant", "balcony", "etc"];

function write_features(feature_list) {
	var new_list;
	for (var i in feature_list) {
		new_list.push(feature_list[i]);
	}

	return new_list;
}
module.exports = router;
