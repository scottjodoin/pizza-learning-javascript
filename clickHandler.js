class ClickHandler {

  static toggleCard (event){
    let $icon = $(event.target);
    let $list = $icon.parent().parent().next().toggle();
    $icon.attr(
      "class",
      $list.css('display') === 'none' ? app.icons.eyeClosed : app.icons.eyeOpen
    );
    $list.prop("selected", false);
  }

}