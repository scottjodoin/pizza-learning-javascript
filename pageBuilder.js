class PageBuilder {

  static index($pizzaData){
    let pizzaCards = [];
    let $cards = [];
    $pizzaData.forEach((pizza)=>{
      var $card = ElementBuilder.card();
      var pizzaCard = new PizzaCard(pizza, $card);
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
    new PizzaTest({
      'pizzaData': pizzaData,
      'choices' : app.allToppings,
      '$container': $container
    });
  }

  static addElements($elems){
    $('#main-container').append($elems);
  }

  
  
}