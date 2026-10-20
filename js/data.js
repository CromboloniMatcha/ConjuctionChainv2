/* Content: conjunctions and questions. Edit this file to change the lessons. */
// ===== Teacher: edit conjunctions and questions here =====
const CONJ = {
  "and":{use:"Adds more information.",syn:"also, as well as, plus"},
  "but":{use:"Shows a contrast (something different).",syn:"however, yet"},
  "or":{use:"Shows a choice or alternative.",syn:"otherwise, either … or"},
  "so":{use:"Shows a result.",syn:"therefore, as a result, thus"},
  "because":{use:"Shows a reason.",syn:"since, as, due to"},
  "since":{use:"Shows a reason (like “because”).",syn:"because, as"},
  "although":{use:"Shows an unexpected contrast.",syn:"though, even though"},
  "though":{use:"Shows an unexpected contrast.",syn:"although, even though"},
  "yet":{use:"Shows a surprising contrast.",syn:"but, however"},
  "therefore":{use:"Shows a result.",syn:"so, as a result"},
  "otherwise":{use:"Shows what happens if you don’t do something.",syn:"or, or else"},
  "while":{use:"Shows two things happening at the same time.",syn:"and, whereas"}
};
const QUESTIONS = [
  {top:"I was very tired",bottom:"I went to bed early",answer:["so","therefore"]},
  {top:"I like tea",bottom:"I don’t like coffee",answer:["but","yet"]},
  {top:"Hurry up",bottom:"you will miss the bus",answer:["or","otherwise"]},
  {top:"She stayed at home",bottom:"she was sick",answer:["because","since"]},
  {top:"Tom is playing football",bottom:"Anna is reading a book",answer:["and","while"]},
  {top:"We played football",bottom:"it was raining",answer:["although","though"]}
];
