var express = require('express');
var router = express.Router();
var CLIENT_ID = '584993438587-ooj1akeui4rsb2g96aphfcs7497tnvoq.apps.googleusercontent.com';
var {OAuth2Client} = require('google-auth-library');
var client = new OAuth2Client(CLIENT_ID);
var prev_pages = [];
var current_page = '/';
var logged_in = false;
var number_adults;
var number_children;
var date_arrival;
var date_departure;
var search_index;
var bookings = [];

/// OPEN ID
var next_user = 1;
var uniqueID = 0;
var empty_user = {"uID" : 0, "username":"", "lname":"", "dob":"", "email":"", "pwd":"", "tel":"","hotel":"","location":"","n_nights":"", "n_adults":"", "n_children":"","arr_date":"","dep_date":"","price_total":""};
var users =[{'username':"sofia", "email":"sofia@g", 'pwd': "cool", 'google': "102998056835987459663","hotel":"Magical Hotel","location":"Magical Land","n_nights":"5", "n_adults":"1", "n_children":"0","arr_date":"05/05/2000","dep_date":"05/06/2000","price_total":"$1"}];

router.post('/login', function(req, res) {
	var create_new = true;
	var req_object = (req.body)
	if (req_object.idtoken !== undefined){
		console.log("Google token received");
		async function verify() {
			const ticket = await client.verifyIdToken({
    		idToken: req_object.idtoken,
    		audience: CLIENT_ID
			});
  		const payload = ticket.getPayload();
  		const userid = payload['sub'];
			for (var i = 0; i < users.length; i++){
				// if we have a matching user, log them in
				if (users[i].google === userid){
					console.log("Username: " +users[i].username);
					req.session.current_user = users[i];
					logged_in = true;
					console.log("Logged in!")
					res.redirect("LoginSignupRedirect");
					create_new = false;
				}
			}
			// if we dont have a matching user, create a new user and log them in
			if (create_new) {
				console.log("New user signed up!")
				var new_user = {'google': userid, 'username': req_object.name};
				users.push(new_user);
				req.session.current_user = new_user;
				logged_in = true;
				res.redirect("LoginSignupRedirect");
			}
		}
		verify().catch(console.error);
	}
	//res.redirect("Login.html");

});

router.post('/Confirmation', function(req, res) {
	// TODO: send data to server
	prev_pages.push(current_page);
	current_page = "Confirmation.html";
	res.redirect('Home.html');
});


// HOME PAGE
router.get('/', function(req, res, next) {
  prev_pages.push(current_page);
  current_page = "Home.html";
	res.redirect("Home.html");
});
// MAP PAGE
router.get('/Map', function(req,res) {
  prev_pages.push(current_page);
	current_page = "Map.html";
	res.redirect("Map.html");
});


// LOGINSIGNUPREDIRECT IS OBSELETE AND REPLACED WITH LOGINREDIRECT AND SIGNUPREDIRECT
// DO WE GO TO LOGIN SIGNUP PAGE
router.get('/LoginSignupQuery', function(req, res){
	prev_pages.push(current_page);
  // if we are logged in
  if (logged_in){
    res.redirect("Confirmation.html");
  }
  res.redirect("/LoginSignup");
});
// LOGINSIGNUP PAGE
router.get('/LoginSignup', function(req, res){
  prev_pages.push(current_page);
  //console.log("LoginSignup Page: "+prev_pages);
  current_page = "LoginSignup.html";
  res.redirect("LoginSignup.html");
});
// LOGIN PAGE
router.get('/Login', function(req, res){
  prev_pages.push(current_page);
  //current_page = "Login.html";
  res.redirect("Login.html");
});
//SIGNUP PAGE
router.get('/Signup', function(req, res){
  prev_pages.push(current_page);
  //current_page = "Signup.html";
  res.redirect("Signup.html");
});
router.get('/HotelDetails', function(req, res){
  prev_pages.push(current_page);
  current_page = "HotelDetails.html";
  res.redirect("HotelDetails.html");
});

router.get('/Confirmation', function(req, res){
  prev_pages.push(current_page);
  current_page = "Login.html";
  res.redirect("Confirmation.html");
});

router.get('/LoginSignupRedirect', function(req, res) {
	logged_in = true;
     if (current_page=="LoginSignup.html"){
       res.redirect("Confirmation.html");
       return;
     }
     res.redirect(prev_pages[prev_pages.length - 1]);
});

router.post('/LoginRedirect', function(req, res) {
	console.log(req.body.email + " with " + req.body.pwd);
	if (check_email(req.body.email)) {
		if (check_password(req.body)) {
			// password matches username
			// add user to session
			logged_in = true;
			console.log("correct email and password");
			req.session.current_user = get_user_from_email(req.body.email);
			if (prev_pages[prev_pages.length - 1] != "LoginSignup.html"){
				res.redirect(prev_pages[prev_pages.length - 1]);
			}
			res.redirect("Confirmation.html");
			return;
		} else {
			// password does not match username
			console.log("correct email wrong password");
			res.redirect("login.html" /* passwd does not match email... how to display message? */);
			return;
		}
	} else {
		// no matching username
		console.log("no matching email");
		res.redirect("/Signup");
		return;
	}
	logged_in = true;
     if (current_page=="LoginSignup.html"){
       res.redirect("Confirmation.html");
       return;
     }
     res.redirect(prev_pages[prev_pages.length - 1]);
});

router.post('/SignupRedirect', function(req, res) {
	new_user = {"username":req.body.fname, "email":req.body.email, "pwd":req.body.pwd};
	req.session.current_user = new_user;
	users.push(new_user);
	logged_in = true;
	if (prev_pages[prev_pages.length - 1] != "LoginSignup.html"){
		res.redirect(prev_pages[prev_pages.length - 1]);
	}
	res.redirect("Confirmation.html");
});

// EDIT USERS BOOKING DETAILS
router.post('/confirmation_sent',function(req, res){
	console.log('HEYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY THIS WORKS');
	console.log(req.body);
	var details_object = req.body;
	var hotel = details_object.hotel;
	var location = details_object.location;
	var n_nights = details_object.n_nights;
	var n_adults = details_object.n_adults;
	var n_children = details_object.n_children;
	var arr_date = details_object.arr_date;
	var dep_date = details_object.dep_date;
	var price_total = details_object.price_total;
	req.session.current_user.hotel = hotel;
	req.session.current_user.location = location;
	req.session.current_user.n_nights = n_nights;
	req.session.current_user.n_adults = n_adults;
	req.session.current_user.n_children = n_children;
	req.session.current_user.arr_date = arr_date;
	req.session.current_user.dep_date = dep_date;
	req.session.current_user.price_total = price_total;
});

router.get('/gohome', function(req, res) {
	prev_pages.push(current_page);
	current_page = "/";
	res.redirect("/");
});


// DONT NEED EITHER OF THESE
router.get('/BookingDetails', function(req, res) {
	prev_pages.push(current_page);
	current_page = "BookingDetails.html";
	res.redirect("BookingDetails.html");
});


// DONT NEED EITHER OF THESE
// router.get('/SearchHotels', function(req, res) {
//   prev_pages.push(current_page);
// 	current_page = "SearchHotels.html";
// 	res.redirect("SearchHotels.html");
// });



// BACK BUTTON
router.get('/back', function(req,res) {
	console.log("back: " + prev_pages.join(" > "));
	current_page = prev_pages[prev_pages.length-1];
	prev_pages.splice(-1,prev_pages.length-1);
  // checks if previous pages are identical
  if (current_page == prev_pages[prev_pages.length-1]){
    prev_pages.splice(-1,prev_pages.length-1);
  }
  if (current_page == undefined){
    res.redirect('/');
		return
  }
  res.redirect(current_page);

});




router.post('/LoginSignupRedirect', function(req, res) {
  logged_in = true;
  // TODO: create user from form data
  if (current_page=="LoginSignup.html"){
    res.redirect("Confirmation.html");
    return;
  }
  res.redirect(prev_pages[prev_pages.length - 1]);
  //res.redirect(current_page);

});



function check_email(given_email) {
	// iterate through users
	for (var i = 0; i < users.length; i++) {
		// if any match return true
		if (users[i].email == given_email) { //CHANGED
			return true;
		}
	}
	// if none pass, return false
	return false;
}

function get_user_from_email(given_email) {
	// iterate through users
	for (var i = 0; i < users.length; i++) {
		// if any match return the user
		if (users[i].email == given_email) {
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
  img_src: 'images/hotel1.jpg',
  description: "Exclusively positioned on the banks of the River Torrens, InterContinental Adelaide provides luxury city centre accommodation, dining and meeting facilities. Situated adjacent to the Adelaide Festival Centre, Convention Centre, Casino and directly opposite the spectacular Adelaide Oval, our location provides effortless exploring and entertainment at your fingertips."
};

var Hilton = {
  name: "Hilton",
  location: {lat: -34.929143, lng: 138.598906},
  city: "Adelaide",
  price: 330,
  features: [0,1,3,4],
  stars: 4,
  img_src: 'images/hotel2.jpg',
  description: "Overlooking Victoria Square, Hilton Adelaide is set in the heart of the city’s entertainment, shopping and dining precincts. The Central Market, Chinatown and Gouger Street - Adelaide’s most vibrant dining destinations – are also minutes away."
};

router.get('/SearchQuery', function(req, res) {
	prev_pages.push(current_page);
	// var key = document.getElementById;
	current_page = "SearchHotels.html?searchTerm=" + req.query.searchTerm;
	res.redirect(current_page);
});

var all_hotels = [InterContinental, Hilton];
var searchedHotels = [];
router.get('/SearchHotels', function(req, res) {
	console.log(req.query.searchTerm)
	searchedHotels = hotels_from_search(req.query.searchTerm);

  var div_content='';
  for (var i = 0; i < searchedHotels.length; i++) {
	  div_content += '<link rel="stylesheet" type = "text/css" href="stylesheets/placeholder.css"> \
					<script src="javascripts/placeholder.js"></script> \
          <p class="imageinfo"><img style = "width: 30%;float:left;display: inline-block;margin: 0px 10px 10px 0px;" src='+searchedHotels[i].img_src+ " " +
	  			'alt="Hotel '+i+ " " +
					'class="hotels"><strong>Name: </strong> '+searchedHotels[i].name+
					'<br> <strong>Stars: '+write_stars(searchedHotels[i].stars)+
					'</strong><br> <strong>Price: </strong>$'+searchedHotels[i].price+
					'per night<br> <strong>Location: </strong>'+searchedHotels[i].city+
					'</p><p>'+ write_features(searchedHotels[i].features).join(" | ") +'</p> \
					<form action="/HotelDetails" method="get">\
						<button type="submit" class="btn btn-default button_details_booknow">Details</button>\
					</form>\
					<form action="/BookingDetails" method="get">\
						<button type="submit" onclick = "store_name_price(\''+searchedHotels[i].name+'\', '+searchedHotels[i].price+', \''+searchedHotels[i].city+'\')" class="btn btn-default button_details_booknow">Book Now</button>\
					</form>\
					<div style="clear:both;"></div>';
  }

  res.send(div_content);
});

function write_stars(n) {
	var stars = "";
	var i = 0;
	while (i<n) {
		stars += "<i class='fa fa-star'></i>";
		i++;
	}
	return stars;
}

var features = ["wifi", "pool", "spa", "undercover parking", "restaurant", "balcony", "etc"];

function write_features(feature_list) {
	var new_list = [];
	for (var i = 0; i < feature_list.length; i ++) {
		new_list.push(features[feature_list[i]]);
	}

	return new_list;
}
function hotels_from_search(search_word) {
	var new_list=[];
	for (var i = 0 ; i < all_hotels.length; i ++) {

		if (all_hotels[i].city == search_word) {
			new_list.push(all_hotels[i]);
		}
	}
	//return new_list;
  return new_list;
}




/////////////////////////////////  MANAGEMENT ///////////////////////////////

var FirstHotel = {
	username:"a",
	password:"a",
	numRooms:59,
	hotelName:"InterContinental",
	address:"Adelaide",
	price:550,
	stars:4

};
var SecondHotel = {
	username:"SecondHotel",
	password:"SecondHotel",
	numRooms:20,
	hotelName:"Hilton",
	address:"Adelaide",
	price:330,
	stars:4
};

var HotelManagementDetails=[FirstHotel, SecondHotel];

router.post("/ManagemntLoginCheck", function(req, res){
	prev_pages.push(current_page);
	current_page = "HotelManagementLogin.html";
	var username = req.body.username;
	var password = req.body.password;
	console.log(username + " " + password);
	for (var i = 0; i < HotelManagementDetails.length; i ++){
		if (HotelManagementDetails[i].username == username && HotelManagementDetails[i].username == password){
			res.redirect("HotelCurrentStatus.html");
		}
	}
	res.redirect("HotelManagementLogin.html");


});


///// writing to log in / signup div /////

router.get('/logged_in_query', function(req, res) {
	var to_send;
	// && req.session.current_user
	if (logged_in) {
		to_send = {valid:"true", name:req.session.current_user.username};
	} else {
		to_send = {"valid":"false", "name":"false"};
	}
	console.log(to_send);
	res.send(JSON.stringify(to_send));
});

router.get('/Logout', function(req, res) {
	req.session.current_user = 0;
	logged_in = false;
	res.redirect("/")
});


////////////////////////////// HOTEL MANAGEMENT //////////////////////////////

// HOTEL MANAGEMENT LOGIN PAGE
router.get('/HotelManagementLogin', function(req, res){
  prev_pages.push(current_page);
  current_page = "HotelManagementLogin.html";
  res.redirect("HotelManagementLogin.html");
});

// HOTEL MANAGEMENT CURRENT STATUS
router.get('/HotelCurrentStatus', function(req, res){
  // if back button is pressed here we only want to go back to
  // the home page (becase they must have logged in or signed up)
  prev_pages.push("/");
  current_page = "HotelCurrentStatus.html";
  res.redirect("HotelCurrentStatus.html");
});
// HOTEL MANAGEMENT
router.get('/HotelManagement', function(req, res){
  prev_pages.push(current_page);
  current_page = "HotelManagement.html";
  res.redirect("HotelManagement.html");
});


/////////////////////////////// MANAGE MY ACCOUNT ////////////////////////////////
router.get('/ManageAccount', function(req, res){
	prev_pages.push(current_page);
	current_page = "ManageAccount.html";
	prev_pages.push(current_page);
	res.redirect("ManageAccount.html");
});

router.get('/ChangeMyDetails', function(req,res){
	res.redirect("ChangeMyDetails.html");
});
router.get('/ViewMyBookings', function(req,res){
	res.redirect("ViewMyBookings.html");
});


///////////////BOOKING/////////////////

router.post('/StoreHotelDetails', function(req, res) {
	// if we are logged in
	number_adults = req.body.adult_number;
	number_children = req.body.child_number;
	date_arrival = req.body.from_date;
	date_departure = req.body.to_date;
	if (logged_in == true) {
		prev_pages.push(current_page);
		current_page = "Confirmation.html";
		res.redirect("Confirmation.html");
	}
	else {
		prev_pages.push(current_page);
		current_page = "LoginSignup.html";
		res.redirect("/LoginSignup");
	}
});

var temp_hotel_name;
var temp_hotel_price;

router.post('/StoreNamePrice', function(req, res) {
	var object = (req.body);
	console.log(req.body);
	temp_hotel_name = object.hotel_name;
	temp_hotel_price = object.hotel_price;
	temp_hotel_city = object.location;
	prev_pages.push(current_page);
	current_page = "BookingDetails.html";
	res.redirect("BookingDetails.html");
});

router.get('/fillHotelDetails', function(req, res) {
	console.log(number_adults);
	var details_object = {
		'hotel_name': temp_hotel_name,
		'price': temp_hotel_price,
		'location': temp_hotel_city,
		'adult_number': number_adults,
		'child_number': number_children,
		'from_date': date_arrival,
		'to_date': date_departure
	}
	res.send(details_object);
});

function assign_number_nights(from,to) {
	var t1 = toDate(from),
	    t2 = toDate(to);
	number_nights = days_between(t1,t2);
}

function toDate(s) {
	// splits up date string
	var b = s.split(/\D/);
	// uses these values to become dates
	return new Date(b[0], --b[1], b[2]);
}

function days_between(t1, t2) {
	var cd = 24 * 60 * 60 * 1000,
	    d1 = Math.floor(t1 / cd),
	    d2 = Math.floor(t2 / cd);
	return (d2-d1);
}

router.get('/confirm_booking', function(req, res) {
	assign_number_nights(date_arrival, date_departure);
	var id;
	if (req.session.current_user.google !== undefined)
	{
		id = req.session.current_user.google;
	}
	else
	{
		id = req.session.current_user.username;
	}
	var booking_object = {
		'id': id,
		'hotel_name': temp_hotel_name,
		'price': temp_hotel_price,
		'location': temp_hotel_city,
		'adult_number': number_adults,
		'child_number': number_children,
		'from_date': date_arrival,
		'to_date': date_departure,
		'n_nights': number_nights,
		'price_total': temp_hotel_price * number_nights
	}
	bookings.push(booking_object);
	console.log(bookings);
	res.redirect('/'); //make a "thank you for booking with us page"?
});
var user_bookings;
router.post('/get_booking_details', function(req, res) {
	user_bookings = req.body;
	console.log(req.body);
	res.send(bookings);
});

router.get('/send_booking_details', function(req, res) {
	res.send(user_bookings);
});


module.exports = router;
