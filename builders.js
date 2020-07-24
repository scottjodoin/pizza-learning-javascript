class PageBuilder {
  static simpleDisplay($pizzaData){

    let $pizzaCards = [];
    $pizzaData.forEach((pizza)=>{
      $pizzaCards = $pizzaCards.concat(
        ElementBuilder.card(
          ElementBuilder.pizza(pizza)));
    });
    PageBuilder.populateColumns($pizzaCards);
    return $pizzaCards;
  }

  static populateColumns($elems){
    $('#main-container').append(
      ElementBuilder.columns($elems, 3)
      );
  }
  
}

class ElementBuilder {
  static iconList(pizza){
    let $container = $('<span></span>')
      .addClass('row-fluid text-secondary mb-4')
      .select();
    [
      {
        "code" : app.icons.eyeOpen,
        "callback": ClickHandler.toggleCard
      }
    ]
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
      .on("click", options.callback);
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
    //TODO: Allow arrays to by inputted using typeof

    return $('<div></div>')
    .addClass('card mb-4 shadow-sm pt-2')
    .append($contents);
  }
  static pizza (pizza){

    let $pizzaContainer = $('<div></div>')
      .addClass('container-fluid');
    let $heading = $('<h3></h3')
    .append(
      ($('<span></span>')
        .text(pizza.name + ' ')
    ))
    .append(
      ElementBuilder.iconList(pizza)
    );

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