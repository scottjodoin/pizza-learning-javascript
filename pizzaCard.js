class PizzaCard {

  constructor(pizza, $card){
    this.pizza = pizza;
    this.$card = $card;
    this.$card.append(
      ElementBuilder.pizzaDisplay(this.pizza)
    );
    this.$header().on('click',this.$header_clicked);
  }

  $header = () => {
    return this.$card.find('h3').first();
  }

  $showHideEye = () => {
    return this.$card.find('i.show-hide').first();
  }

  $list = () => {
    return this.$card.find('ul').first();
  }

  isShowing = () => {
    return this.$list().css("display") !== "none"
  }

  toggle = () => {
    if (this.isShowing()){
      this.$list().attr("style","display:none");
      this.$showHideEye().attr("class",app.icons.eyeClosed)
      return true;
    } else {
      this.$list().attr("style","display:block");
      this.$showHideEye().attr("class",app.icons.eyeOpen)
      return false;
    }
  }
  
  $header_clicked = (e) => {
    this.toggle();
  }
}