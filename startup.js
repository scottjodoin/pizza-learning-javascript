let app = {}

app.pizzaData = [{"name": "Cheese","toppings": ["Tomato sauce","Mozzarella"]}, {"name": "Classic","toppings": ["Tomato sauce","Pepperoni","Mozzarella","Green peppers","Mushrooms"]}, {"name": "Hawaiian","toppings": ["Tomato sauce","Mozzarella","Ham","Bacon","Pineapple"]}, {"name": "Vegetarian","toppings": ["Tomato sauce","Red onions","Mozzarella","Red Peppers","Green Peppers","Tomatoes","Mushrooms","Black olives"]}, {"name": "Meat lovers","toppings": ["Tomato sauce","Pepperoni","Chourico","Ground beef","Mozzarella","Ham","Bacon"]}, {"name": "Chicken Cordon Bleu","toppings": ["White garlic sauce","Chicken","Mozzarella","Ham","Tomatoes","Green onions"]}, {"name": "Bella Luiza","toppings": ["Luiza sauce","Red onions","Chourico","Mozzarella","Red peppers","Banana peppers","Black olives"]}, {"name": "Mexican","toppings": ["Tomato sauce","Salsa & refried bean mix","Mexican Beef","Tacos","Blended cheese","Red Peppers","Green Peppers","Jalapenos"]}, {"name": "Theophilus's Greek","toppings": ["Tzatziki Sauce","Red onions","Gyros","Mozzarella","Tomatoes"]}, {"name": "Smoked Beef Brisket","toppings": ["Tomato sauce","White onions","Blended cheese","Brisket","Mushrooms","Green onions"]}, {"name": "Greek","toppings": ["Half Tomato sauce","Half Greek sauce","Red onions","Mozzarella","Tomatoes","Red peppers","Black olives","Feta cheese"]}, {"name": "Anton's Chicken","toppings": ["Tomato sauce","Red onions","Chicken","Mozzarella","Banana Peppers","Pineapple"]}]
app.otherToppings =["Ranch", "BBQ Sauce", "Extra Cheese"];

// App display function
let url = window.location.pathname;
var route = url.split('/').pop().split('.').shift() || "";
let router = {
  'index': ()=>{return PageBuilder.index(app.pizzaData)},
  'test': ()=>{return PageBuilder.test(app.pizzaData)},
  'practice': ()=>{return PageBuilder.practice(app.pizzaData)}
};
app.initialize = router[route];

// App icons
app.icons = {
  "eyeOpen" : "fa fa-eye show-hide",
  "eyeClosed" : "fa fa-eye-slash show-hide",
  "correct" : "fa fa-check is-correct badge badge-success",
  "incorrect" : "fa fa-times badge badge-danger"
}
app.classes = {
  "incorrect" : "incorrect"
}

// Get all unique toppings
app.allToppings = [];
app.pizzaData.forEach((pizza)=>{
  app.allToppings = mergeNoDuplicates(
    app.allToppings,
    pizza.toppings
  );
})

app.allToppings = mergeNoDuplicates(
  app.allToppings,
  app.otherToppings);

// Utility functions

function mergeNoDuplicates(array1, array2){
  for (let i = 0; i < array2.length; i++) {
    let elem = array2[i];
    let searchResult = binarySearch(
      array1,
      elem,
      compareString
      );
    if (searchResult.found === true) continue;
    array1.splice(searchResult.index,0,elem);
  }
  return array1;
}

function compareString(string1, string2){
  return string1.toLowerCase().localeCompare(string2.toLowerCase());
}

function binarySearch(ar, el, compare_fn) {
  var m = 0;
  var n = ar.length - 1;
  while (m <= n) {
      var k = (n + m) >> 1;
      var cmp = compare_fn(el, ar[k]);
      if (cmp > 0) {
          m = k + 1;
      } else if(cmp < 0) {
          n = k - 1;
      } else {
          return {"index": k,"found":true};
      }
  }
  return {"index":m,"found":false};
}

function millisecondsToHMS(diff) {

  let ms = diff % 1000;
  diff = (diff - ms) / 1000;
  let s = diff % 60;
  diff = (diff - s) / 60;
  let m = diff % 60;
  diff = (diff - m) / 60;

  let mss = padNum(ms, 3);
  let ss = padNum(s,2);
  let mm = padNum(m,2);

  return mm + ':' + ss + '.' + mss;
}

function padNum(num, padlen, padchar) {
  var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
  var pad = new Array(1 + padlen).join(pad_char);
  return (pad + num).slice(-pad.length);
}

function fisherYatesShuffle(array) {

  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function toPercentageString(num){
  return parseFloat(num * 100).toFixed(2)+"%";
}