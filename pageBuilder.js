class PageBuilder {

  static index(pizzaData){
    let $container = $('#main-container');

    let pizzaCards = [];
    let $cards = [];
    pizzaData.forEach((pizza)=>{
      var $card = ElementBuilder.card();
      var pizzaCard = new PizzaView(pizza, $card);
      pizzaCards = pizzaCards.concat(pizzaCard);
      $cards = $cards.concat(pizzaCard.$card);
    });

    let $toggleButton = ElementBuilder.button(
      "Show / Hide All",
      (e)=>{
        let allShowing = pizzaCards.every((pizzaCard)=>{return pizzaCard.isShowing()});
        let action = (allShowing) ? "hide" : "show";
        pizzaCards.forEach((pizzaCard)=>{pizzaCard[action]()});
      });

    PageBuilder.addElements([
      $toggleButton,
      ElementBuilder.columns($cards, 3)
    ]);
  }


  static test(pizzaData){
    let $container = $('#main-container');
    let pizzaTest = new PizzaTest({
      'pizzaData': pizzaData,
      'choices' : app.allToppings,
    });
    new PizzaTestController(
      pizzaTest,
      $container
    );
  }

  static practice(pizzaData){
    let $container = $('#main-container');
    let pizzaTest = new PizzaTest({
      'pizzaData': pizzaData,
      'choices' : app.allToppings,
      'options': {
        "firstLetter": true,
        "title": "Practice Test"
      }
    });
    new PizzaTestController(
      pizzaTest,
      $container
    );
  }

  static addElements($elems){
    $('#main-container').append($elems);
  }

  
  
}