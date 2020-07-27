class Stopwatch{
  constructor(){
    this.stopwatch = undefined;
    this.startTime = 0;
    this.endTime = 0;
  }

  start = (callback)=>{
    this.startTime = Date.now();
    this.endTime = 0;
    this.stopwatch = setInterval(
      ()=>{this.tick(callback)}
      , 29)
    this.tick(callback);
  }

  tick = (callback)=>{
    callback(this.getTime());
  }

  getTime = ()=>{
    if (this.startTime === 0) return 0;
    if (this.endTime === 0) return Date.now() - this.startTime;
    return this.endTime - this.startTime;
  }

  stop = ()=>{
    this.endTime = Date.now();
    clearInterval(this.stopwatch);
  }

}

class PizzaTest{
  constructor (data){
    this.score = data.score || 0;
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
  }
}

class PizzaTestController{
  constructor(pizzaTest, $container){
    this.score = pizzaTest.score;
    this.listQuestions = pizzaTest.listQuestions;
    this.options = pizzaTest.options;

    this.view = new PizzaTestView($container);
    this.stopwatch = new Stopwatch();
    this.questionIndex = -1;
    this.currentScore = 0;
    this.view.renderStartScreen({
      "title" : this.options.title || "Test",
      "questionCount": this.listQuestions.length,
      "callback" : this.startTest
    });
  }

  startTest = ()=>{

    this.view.buildQuestionCardContainer();
    this.stopwatch.start(this.view.updateStopwatch);

    this.nextQuestion();
  }

  getCurrentQuestion = ()=>{
    return this.listQuestions[this.questionIndex];
  }

  checkAnswer = ()=>{
    return this.getCurrentQuestion()
    .isAllCorrect(this.view.getCurrentAnswers());
  }

  rejectAnswer = ()=>{

    let answers = this.view.getCurrentAnswers();
    let incorrects = this.getCurrentQuestion().getIncorrectIndices(answers);
    this.view.showIncorrectAnswers(incorrects);
  }

  nextQuestion = ()=>{
    let minSuccess = 0.125;
    if (
        this.questionIndex >= 0 &&
        !this.checkAnswer(this.getCurrentQuestion())
      ) {
      this.currentScore = (this.currentScore > minSuccess) ?
        this.currentScore / 2 : 0;
      this.rejectAnswer();
      return;
    }
    this.questionIndex += 1;
    this.score += this.currentScore;
    this.currentScore = 1;

    if (this.questionIndex == this.listQuestions.length){
      this.stopwatch.stop();
      this.view.renderEndScreen({
        "score": this.score,
        "questionCount": this.listQuestions.length,
        "percentage": this.score / this.listQuestions.length,
        "time":this.stopwatch.getTime()
      });
      return;
    }

    this.view.renderQuestion({
      "questionIndex": this.questionIndex + 1,
      "options": this.options,
      "listQuestion": this.getCurrentQuestion()
    }, this.nextQuestion);
  }
}

class PizzaTestView{
  constructor($container)
  {
    this.$container = $container;
    this.$questionCard = undefined;
  }

  renderStartScreen = (data)=>{
    this.$container.empty();
    this.$container.append(ElementBuilder.jumbotron([
      ElementBuilder.heading([data.title], 1),
      ElementBuilder.heading([`${data.questionCount} questions.`], 3),
      ElementBuilder.button("Start Test", data.callback)
        .attr('id', 'next-button')
    ]));
    $('#next-button').focus();
  };

  buildQuestionCardContainer = ()=>{
    this.$container.empty();
    this.$questionCard = ElementBuilder.card().attr('id', 'question-card');
    this.$container.append([
      ElementBuilder.heading([
        "Time:",
        $('<span></span>').attr('id','stopwatch')
      ], 1),
      this.$questionCard
    ]);
  }

  updateStopwatch = (milliseconds)=>{
    $('#stopwatch').text(millisecondsToHMS(milliseconds));
  }

  showIncorrectAnswers = (incorrects)=>{
    let $inputs = this.$questionCard.find('input');
    $inputs.each((index, $elem)=>{
      if (!$($elem).hasClass(app.classes.incorrect) && incorrects.includes(index)) $($elem).addClass(app.classes.incorrect);
    });
    this.$questionCard.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    this.$questionCard.find('input')[incorrects[0]].select();
  }

  renderEndScreen = (data)=>{
    this.$container.empty();
    let percentageString = toPercentageString(data.percentage);
    let endClass = (data.percentage >= 0.9) ? 'text-success' : 'text-warning';
    this.$container.append(ElementBuilder.jumbotron([
      ElementBuilder.heading([`${percentageString
        }</br>${data.score} / ${data.questionCount} correct!`],1)
        .addClass(endClass),
      ElementBuilder.heading([`Final Time: ${millisecondsToHMS(data.time)}`],3),
      ElementBuilder.button('Retry',()=>(window.location.reload()))
        .attr('id', 'next-button')
    ]));
    $('#next-button').focus();
  }

  renderQuestion = (data, callback)=>{

    this.$questionCard.empty();

    (new ListQuestionView(this.$questionCard)).render(
      data.listQuestion,
      data.options);
      this.$questionCard.find('h3').first().prepend(`${data.questionIndex}. `);
      this.$questionCard.append( $('<div class="container"></div>')
      .append(
        ElementBuilder.button(
        "Next",
        callback
        ).attr('id', data.listQuestion.answers.length)
      ));

    this.$questionCard.find('input').first().focus();
  }


  getCurrentAnswers = ()=>{
    let answers = [];
    this.$questionCard.find('input').each(
       (index, $elem)=>{answers = answers.concat($($elem).val());});
    return answers;
  }
}

class ListQuestion{
  constructor(data){
    this.question = data.question;
    this.answers = data.answer;
    this.choices = data.choices;
    this.options = data.options || {};
  }

  isAllCorrect = (list)=>{
    return this.getIncorrectIndices(list).length === 0;
  }

  getIncorrectIndices = (list)=>{
    let i = 0;
    let incorrects = []
    while (i < list.length && i < this.answers.length){
      let correct = list[i].toLowerCase().trim() == this.answers[i].toLowerCase();
      if (!correct) incorrects = incorrects.concat(i);
      i += 1;
    }
    return incorrects;
  }
}

class ListQuestionController{
  constructor(listQuestion, $container, options){
    this.options = options || {};
    this.listQuestion = listQuestion;
    this.view = ListQuestionView($container);
  }

  show = ()=>{
    this.view.render(this.listQuestion);
  }
}

class ListQuestionView{
  constructor ($container){
    this.$container = $container;
  }

  static empty = ()=>{
    this.$container.empty();
  }

  render = (data, options)=>{

    let title = data.question;
    this.$container.append(ElementBuilder.heading([title],3).addClass("ml-3 mb-3"));
    let $inputGroup = $('<form autocomplete="off"></form>')
      .append('<div class="autocomplete input-group mb-3"></div>')
      .addClass("input-group mb-3");
    this.$container.append($inputGroup);

    data.answers.forEach((answer, index)=>{
      let $input = $('<input type="text" class="form-control mb-1">')
        .attr('id',index)
        .focus(function() { $(this).select(); } );

      if (options.firstLetter === true) $input.attr('placeholder', answer.charAt(0));
      $inputGroup.append($('<div class="container-fluid"></div>').append($input));
      autocomplete($input,data.choices);
    });
  }
}