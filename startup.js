let app = {}

app.pizzaData = [{"name": "Cheese","toppings": ["Crust","Tomato sauce","Mozzarella"]}, {"name": "Classic","toppings": ["Crust","Tomato sauce","Pepperoni","Mozzarella","Green peppers","Mushrooms"]}, {"name": "Hawaiian","toppings": ["Crust","Tomato sauce","Mozzarella","Ham","Bacon","Pineapple"]}, {"name": "Vegetarian","toppings": ["Crust","Tomato sauce","Red onions","Mozzarella","Red Peppers","Green Peppers","Tomatoes","Mushrooms","Black olives"]}, {"name": "Meat lovers","toppings": ["Crust","Tomato sauce","Pepperoni","Chourico","Ground beef","Mozzarella","Ham","Bacon"]}, {"name": "Chicken Cordon Bleu","toppings": ["Crust","White garlic sauce","Chicken","Mozzarella","Ham","Tomatoes","Green onions"]}, {"name": "Bella Luiza","toppings": ["Crust","Luiza sauce","Red onions","Chourico","Mozzarella","Red peppers","Banana peppers","Black olives"]}, {"name": "Mexican","toppings": ["Crust","Tomato sauce","Salsa & refried bean mix","Mexican Beef","Tacos","Blended cheese","Red Peppers","Green Peppers","Jalapenos"]}, {"name": "Theophilus's Greek","toppings": ["Crust","Tzatziki Sauce","Gyros","Mozzarella","Tomatoes"]}, {"name": "Smoked Beef Brisket","toppings": ["Crust","Tomato sauce","White onions","Blended cheese","Brisket","Mushrooms","Green onions"]}, {"name": "Greek","toppings": ["Crust","Half Tomato sauce","Half Greek sauce","Red onions","Mozzarella","Tomatoes","Red peppers","Black olives","Feta cheese"]}, {"name": "Anton's Chicken","toppings": ["Crust","Tomato sauce","Red onions","Chicken","Mozzarella","Banana Peppers","Pineapple"]}]
app.otherToppings =["Ranch", "BBQ Sauce", "Extra Cheese"];

// App display function
let url = window.location.pathname;
var route = url.split('/').pop().split('.').shift() || "";
let router = {
  'index': ()=>{return PageBuilder.simpleDisplay(app.pizzaData)}
};
app.populate = router[route];

// App icons
app.icons = {
  "eyeOpen" : "fa fa-eye mr-2 show-hide",
  "eyeClosed" : "fa fa-eye-slash mr-2 show-hide"
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