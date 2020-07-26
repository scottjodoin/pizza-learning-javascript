class PizzaTest {
  constructor (data){
    this.questionIndex = -1;
    this.$container = data.$container;
    this.startTime = 0;
    this.endTime = 0;
    this.score = 0;
    this.currentScore = 0;
    this.timer = undefined;
    this.$questionCard = undefined;
    this.options = data.options || {};
    this.listQuestions = 
      data.pizzaData.map((pizza)=>{
        return new ListQuestion({
          'question': pizza.name,
          'answer': pizza.toppings,
          'choices': data.choices,
          'options': data.options
        });
      });
    this.listQuestions = fisherYatesShuffle(this.listQuestions);
    this.startScreen();
  }
  
  startScreen = ()=>{
    this.$container.empty();
    this.$container.append(ElementBuilder.jumbotron([
      ElementBuilder.heading([ this.options.title || 'Test'], 1),
      ElementBuilder.heading([`${this.listQuestions.length} questions.`], 3),
      ElementBuilder.button("Start Test", this.$startButton_pressed)
        .attr('id', 'next-button')
    ]));
    $('#next-button').focus();
  };

  endScreen = ()=>{
    this.$container.empty();
    let percentage = this.score / this.listQuestions.length;
    let percentageString = toPercentageString(percentage);
    let endClass = (percentage >= 0.9) ? 'text-success' : 'text-warning';
    this.$container.append(ElementBuilder.jumbotron([
      ElementBuilder.heading([`${percentageString
        }</br>${this.score} / ${this.listQuestions.length} correct!`],1)
        .addClass(endClass),
      ElementBuilder.heading([`Final Time: ${this.getTimeString()}`],3),
      ElementBuilder.button('Retry',()=>(window.location.reload()))
        .attr('id', 'next-button')
    ]));
    $('#next-button').focus();
  }

  $startButton_pressed = (e)=>{
    this.clearScreen();
    this.startTime = Date.now();
    this.$questionCard = ElementBuilder.card().attr('id', 'question-card');
    this.$container.append([
      ElementBuilder.heading([
        "Time:",
        $('<span></span>').attr('id','timer')
      ], 1),
      this.$questionCard
    ]);

    this.timer = setInterval(
      this.tick
      , 29);
    this.tick();
    
    this.nextQuestion();
  }

  getCurrentQuestion = ()=>{
    return this.listQuestions[this.questionIndex];
  }

  nextQuestion = ()=>{
    let minSuccess = 0.125;
    if (this.questionIndex >= 0 && !this.checkAnswer()) {
      this.currentScore = (this.currentScore > minSuccess) ? 
        this.currentScore / 2 : 0;
      this.rejectAnswer();
      return;
    }

    this.$questionCard.empty();
    this.questionIndex += 1;
    this.score += this.currentScore;
    this.currentScore = 1;

    if (this.questionIndex == this.listQuestions.length){
      this.endTime = Date.now();
      this.endScreen();
      return;
    }

    this.buildQuestion();
  }

  rejectAnswer = ()=>{
    let answers = this.getCurrentAnswers();
    let incorrects = this.getCurrentQuestion().getIncorrectIndices(answers);
    let $inputs = this.$questionCard.find('input');
    $inputs.each((index, $elem)=>{
      if (!$($elem).hasClass(app.classes.incorrect) && incorrects.includes(index)) $($elem).addClass(app.classes.incorrect);
    });
    this.$questionCard.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    this.$questionCard.find('input')[incorrects[0]].select();
    return;
  }

  getCurrentAnswers = ()=>{
    let answers = [];
    this.$questionCard.find('input').each(
       (index, $elem)=>{answers = answers.concat($($elem).val());});
    return answers;
  }

  checkAnswer = ()=>{
    return this.getCurrentQuestion().isAllCorrect(this.getCurrentAnswers());
  }

  buildQuestion = ()=>{
    this.$questionCard.empty();
    this.getCurrentQuestion().$card = this.$questionCard;
    let heading = `${
      this.questionIndex + 1
    }. ${
      this.getCurrentQuestion().question
    }`;
    this.getCurrentQuestion().build({
      "title": heading
    })
    this.$questionCard.append( $('<div class="container"></div>')
      .append(
        ElementBuilder.button(
        "Next",
        this.nextQuestion
        ).attr('id', this.getCurrentQuestion().answers.length)
      )
    );
    this.$questionCard.find('input').first().focus();
  }

  getTimeString = () => {
    let endTime = Date.now();
    if (this.endTime !== 0){
      endTime = this.endTime;
    }
    let diff = endTime - this.startTime;
    return millisecondsToHMS(diff);
  }

  tick = () => {
    $('#timer').text(this.getTimeString);
    if (this.endTime != 0) clearInterval(this.timer);
  }

  clearScreen = ()=>{
    this.$container.empty();
  }
}

class ListQuestion{

  constructor (data){
    this.question = data.question;
    this.answers = data.answer;
    this.choices = data.choices;
    this.$card = data.$card;
    this.options = data.options || {};
  }

  isAllCorrect = (list)=>{
    let i = 0;
    let incorrects = []
    while (i < list.length && i < this.answers.length){
      let correct = list[i].toLowerCase() == this.answers[i].toLowerCase();
      if (!correct) return false;
      i += 1;
    }
    return true;
  }

  getIncorrectIndices = (list)=>{
    let i = 0;
    let incorrects = []
    while (i < list.length && i < this.answers.length){
      let correct = list[i].toLowerCase() == this.answers[i].toLowerCase();
      if (!correct) incorrects = incorrects.concat(i);
      i += 1;
    }
    return incorrects;
  }

  build = (options)=>{
    options = options || {};
    let title = options.title || this.question;
    this.$card.append(ElementBuilder.heading([title],3).addClass("ml-3 mb-3"));
    let $inputGroup = $('<form autocomplete="off"></form>')
      .append('<div class="autocomplete input-group mb-3"></div>')
      .addClass("input-group mb-3");
    this.$card.append($inputGroup);

    this.answers.forEach((answer, index)=>{
      let $input = $('<input type="text" class="form-control mb-1">').attr('id',index);
      
      if (this.options["firstLetter"] === true) $input.attr('placeholder', answer.charAt(0));
      $inputGroup.append($('<div class="container-fluid"></div>').append($input));
      autocomplete($input,this.choices);
    });
  }

}