class PageBuilder {
  static simpleDisplay($pizzaData){

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
    $('#main-container').append($toggleButton);

    PageBuilder.appendColumns($cards);

    return pizzaCards;
  }

  static appendColumns($elems){
    $('#main-container').append(
      ElementBuilder.columns($elems, 3)
      );
  }
  
}

class ElementBuilder {

  static button(text, callback){
    return $('<button></button>').text(text)
      .addClass('btn btn-primary mb-3')
      .on('click', callback);
  }

  static iconList(){
    let $container = $('<span></span>')
      .addClass('row-fluid text-secondary mb-4');
    
    [{
        "code" : app.icons.eyeOpen,
      }]
    .forEach((options)=>{
      $container
      .append(
        ElementBuilder.icon(
          options
        )
      );
    });
    return $container;
  }

  static icon(options){
    return $('<i></i>')
      .addClass(options.code)
      .attr('style',"font-size:24px;")
      .attr('aria-hidden','true')
  }

  static columns($elems, columnCount){

    // $elems is an array
    let $row = $('<div></div>')
      .addClass('row')
      .select();
    let $column = $('<div></div>')
      .addClass('col-sm-4');
    let elemCount = $elems.length;
    let columnSplit = columnCount;
    let columnCapacity = Math.floor(elemCount / columnSplit);
    let i = 0;
    do {
      let $elem = $elems[i]
  
      $column.append($elem);
        
      i += 1;
  
      if (i % columnCapacity == 0
        || i == elemCount){
        
        $row.append($column);
        $column = $('<div></div>')
          .addClass('col-sm-4');
      }
    } while (i < elemCount)
    return $row;
  }

  static card ($contents){
    // Note: does not allow arrays at the moment.

    return $('<div class="pizza-card"></div>')
    .addClass('card mb-4 shadow-sm pt-2')
    .append($contents);
  }

  static heading($elems){
    let $heading = $('<h3></h3>');
    $elems.forEach(($elem)=>{
      $heading.append(
        $('<span></span>')
          .addClass('mr-2')
          .append($elem)
          .css('cursor','pointer')
      );
    });
    return $heading;
  }

  static pizzaDisplay (pizza){

    let $pizzaContainer = $('<div></div>')
      .addClass('container-fluid');
    let $heading = ElementBuilder.heading([
      pizza.name,
      ElementBuilder.iconList()
    ]);

    let $toppingList = $('<ul></ul>')
      .addClass("list-group list-group-flush");
  
    pizza.toppings.forEach((topping)=>{
      let $topping = $('<li></li>')
        .addClass('list-group-item')
        .text(topping);
      $toppingList.append($topping);
    });
    
    return $pizzaContainer
    .append($heading)
    .append($toppingList);
  }
}