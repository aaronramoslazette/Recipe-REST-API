//required libraries
var express = require('express');
var router = express.Router();
var http = require('http');

//API KEY FOR FOOD2FORK
const API_KEY = 'd81a7bb9246bef0cb8c58d485a1051e0'

//GET Requests end up here
router.get('/', function(req, res, next) {
	let ingredient = req.query.ingredient;

	//If ingredient list is empty/undefined, send default page back, otherwise parse data
	if(ingredient == '' || ingredient == undefined){
		res.render('index', { title: 'Food4Thought' });
	}else{
		getRecipes(ingredient, res);
	}

});

//Takes data recieved from api and render html, using pug view.
function parseData(apiResponse, res) {
  let apiData = ''
  apiResponse.on('data', function (chunk) {
  	apiData += chunk
  })
  apiResponse.on('end', function () {
		apiData = JSON.parse(apiData);	//turn json string to obj

		var numRecipes = apiData["count"];	//get number
		var recipeData = apiData["recipes"]	//get array of recipe objects

		res.status(200);
		res.render('food', { title: 'Food4Thought', data: recipeData });

  });
}

//Queries the food2fork api with the ingredients, sends resulting data to parseData
function getRecipes(ingredient, res){

	ingredient = escape(ingredient);

  const options = {
     host: 'www.food2fork.com',
     path: `/api/search?q=${ingredient}&key=${API_KEY}`
  }
	console.log("Getting Recipes for: " + ingredient)

	http.request(options, function(apiResponse){
    parseData(apiResponse, res)
  }).end()
}

//Alerts user that post was received. POST is not used, but the function is still present to prevent timeouts
router.post('/', function (req, res) {
    console.log(req.body.title);
    console.log(req.body.description);
    res.send('Post page');
});

module.exports = router;
