/* Additive exercises: existing lesson, word and reward IDs are never changed. */
(() => {
  'use strict';
  const study=window.TextbookStudy;
  const rows=`
host family|принимающая семья|I am staying with a host family.|Я живу в принимающей семье.|25
hospitable|гостеприимный|The Taylors are hospitable.|Тейлоры гостеприимные.|25
good-looking|симпатичный|Liza is good-looking.|Лиза симпатичная.|25
wavy hair|волнистые волосы|She has wavy red hair.|У неё волнистые рыжие волосы.|25
straight hair|прямые волосы|Roy has straight dark hair.|У Роя прямые тёмные волосы.|25
wear glasses|носить очки|Liza wears glasses.|Лиза носит очки.|25
handsome|красивый (о мужчине)|Roy is handsome.|Рой красивый.|25
independent|самостоятельный|Liza is independent.|Лиза самостоятельная.|25
sociable|общительный|Roy is sociable.|Рой общительный.|25
friendly|дружелюбный|They are friendly.|Они дружелюбные.|24
a sense of humor|чувство юмора|She has a sense of humor.|У неё есть чувство юмора.|25
have a lot in common|иметь много общего|We have a lot in common.|У нас много общего.|25
be fond of sports|увлекаться спортом|Roy is fond of sports.|Рой увлекается спортом.|25
be good at Maths|хорошо разбираться в математике|Roy is good at Maths.|Рой хорошо разбирается в математике.|25
grown-up|взрослый|Fiona is grown-up.|Фиона взрослая.|25
married|женатый, замужняя|Fiona is married.|Фиона замужем.|25
parents|родители|They live with their parents.|Они живут с родителями.|26
grandparents|бабушка и дедушка|My grandparents live in the country.|Мои бабушка и дедушка живут за городом.|29
grandchildren|внуки|They have five grandchildren.|У них пять внуков.|29
an aunt|тётя|My aunt is my mother's sister.|Моя тётя — сестра моей мамы.|26
an uncle|дядя|My uncle is my father's brother.|Мой дядя — брат моего папы.|26
a cousin|двоюродный брат или сестра|Tom is my cousin.|Том — мой двоюродный брат.|25
a niece|племянница|My niece is my sister's daughter.|Моя племянница — дочь моей сестры.|26
a nephew|племянник|My nephew is my brother's son.|Мой племянник — сын моего брата.|26
a grandson|внук|Tom is her grandson.|Том — её внук.|26
a granddaughter|внучка|Liza is her granddaughter.|Лиза — её внучка.|26
a husband|муж|He is her husband.|Он её муж.|26
a wife|жена|She is his wife.|Она его жена.|27
an elder sister|старшая сестра|Their elder sister lives in Liverpool.|Их старшая сестра живёт в Ливерпуле.|26
younger|младше|Roy is a year younger.|Рой на год младше.|25
close relatives|близкие родственники|My close relatives meet every autumn.|Мои близкие родственники встречаются каждую осень.|29
support|поддерживать|They will always support you.|Они всегда тебя поддержат.|27
give you a hand|помочь тебе|They will give you a hand.|Они тебе помогут.|27
cherish|дорожить, беречь|Cherish your family.|Дорожи своей семьёй.|27
argue|спорить|Sometimes we argue.|Иногда мы спорим.|27
get upset|расстраиваться|Sometimes we get upset.|Иногда мы расстраиваемся.|27
do homework|делать домашнюю работу|I do my homework after school.|Я делаю домашнюю работу после школы.|28
do morning exercises|делать утреннюю зарядку|I do morning exercises every day.|Я делаю зарядку каждый день.|28
do the shopping|делать покупки|We do the shopping on Saturday.|Мы делаем покупки в субботу.|28
do well|хорошо справляться|The children are doing well at school.|Дети хорошо учатся в школе.|28
do sports|заниматься спортом|We do sports together.|Мы вместе занимаемся спортом.|28
do my best|делать всё от меня зависящее|I always do my best.|Я всегда стараюсь изо всех сил.|28
make a cake|испечь торт|My mother will make a cake.|Мама испечёт торт.|28
make a mistake|сделать ошибку|It is OK to make a mistake.|Нет ничего страшного в том, чтобы ошибиться.|28
make friends|подружиться|I want to make friends.|Я хочу подружиться.|28
make noise|шуметь|Don't make noise.|Не шуми.|28
make up a family|составлять семью|Parents and children make up a family.|Родители и дети составляют семью.|28
tidy my room|убирать свою комнату|I often tidy my room.|Я часто убираю свою комнату.|28
make my bed|застилать свою кровать|I make my bed every morning.|Я застилаю кровать каждое утро.|28
set the table|накрывать на стол|I set the table for dinner.|Я накрываю на стол к ужину.|28
sweep the floor|подметать пол|I sweep the floor on Sunday.|Я подметаю пол в воскресенье.|28
take out the rubbish|выносить мусор|I take out the rubbish.|Я выношу мусор.|28
water the plants|поливать растения|I water the plants.|Я поливаю растения.|28
walk the dog|выгуливать собаку|I like walking the dog.|Мне нравится гулять с собакой.|28
do the washing-up|мыть посуду|I do the washing-up after dinner.|Я мою посуду после ужина.|28
look after|присматривать за|I look after my younger brother.|Я присматриваю за младшим братом.|28
play hide-and-seek|играть в прятки|We played hide-and-seek.|Мы играли в прятки.|29
take photos|фотографировать|Tom took photos of his family.|Том фотографировал свою семью.|29
tell fairy tales|рассказывать сказки|Grandma tells fairy tales.|Бабушка рассказывает сказки.|29
celebrate a birthday|праздновать день рождения|We came to celebrate her birthday.|Мы пришли отпраздновать её день рождения.|29
`.trim().split('\n').map((line,i)=>{const [en,ru,example,exampleRu,page]=line.split('|');return {id:'tb-host-word-'+(i+1),en,ru,example,exampleRu,page:Number(page),unit:1,section:4}});
  const lessons=[];
  function lesson(id,title,tasks,wordIds=[],pages='24–29') {lessons.push({id:'tb-host-'+id,title,subtitle:'По заданиям A Host Family',unit:1,section:4,icon:'book',pages,wordIds,tasks,study:true})}
  for(let i=0;i<rows.length;i+=10){
    const words=rows.slice(i,i+10);
    const tasks=words.flatMap((w,j)=>[false,true].map(reverse=>{
      const key=reverse?'en':'ru', distractors=rows.filter(x=>x.id!==w.id).slice((i+j+1)%40).slice(0,3);
      return {id:w.id+(reverse?'-en':'-ru'),type:'choice',wordId:w.id,en:w.en,ru:w.ru,page:w.page,reverse,display:reverse?w.ru:w.en,prompt:'Выбери перевод',answer:w[key],options:[w[key],...distractors.map(x=>x[key])],explanation:w.example+' — '+w.exampleRu};
    }));
    lesson('words-'+(i/10+1),['Внешность и характер','Общение и семья','Родственники','Семья и забота','Do, make и дела по дому','Домашние обязанности'][i/10],tasks,words.map(w=>w.id));
  }
  function questions(block, data) {
    return data.trim().split('\n').map((line,i)=>{
      const [en,ru,answer,wrong1,wrong2,explanation,page]=line.split('|');
      return {id:'tb-host-'+block+'-'+(i+1),type:'choice',study:true,en,ru,display:en,answer,options:[answer,wrong1,wrong2],prompt:'Проверь понимание',explanation,page:Number(page)};
    });
  }
  lesson('understand-57','Кого и когда встречает семья?',questions('read57',`
Who is talking to Mrs Taylor?|Кто разговаривает с миссис Тейлор?|Mr Carey|Roy|Tom|Миссис Тейлор звонит мистер Кэри. Упр. 57.|24
How many club members will stay with the Taylors?|Сколько участников клуба будут жить у Тейлоров?|Two|Three|Five|В диалоге названы два гостя. Упр. 57.|24
Where is Melissa from?|Откуда Мелисса?|Canada|Russia|France|Melissa Olby from Canada. Упр. 57.|24
Where is Ilya from?|Откуда Илья?|Russia|Canada|Australia|Ilya Ivanov from Russia. Упр. 57.|24
Are the rooms ready?|Готовы ли комнаты?|Yes, they are.|No, they aren't.|The dialogue doesn't say.|Миссис Тейлор говорит: The rooms are ready. Упр. 57.|24
When should Mrs Taylor meet the children?|Когда нужно встретить детей?|Tomorrow at 11 am|Tonight at 11 pm|Tomorrow at 12 pm|Tomorrow at 11 am — завтра в 11 утра. Упр. 57.|24
Where should they meet?|Где им встретиться?|In the hall of the Club|At the airport|At the railway station|In the hall of the Club — в холле клуба. Упр. 57.|24
Has Mrs Taylor been to Canada and Russia?|Была ли миссис Тейлор в Канаде и России?|No, she hasn't.|Yes, many times.|Only to Russia.|We have never been to Canada and Russia. Упр. 57.|24
`));
  lesson('understand-59','Что мы узнали о Тейлорах?',questions('read59',`
How long are the children staying with British families?|Как долго дети живут в британских семьях?|For a month|For a week|For a year|For a month — в течение месяца. Упр. 59.|25
How many children have Mr and Mrs Taylor got?|Сколько детей у Тейлоров?|Three|Two|Four|Сын Рой и две дочери, Лиза и Фиона. Упр. 59.|25
Where does Fiona live?|Где живёт Фиона?|In Liverpool|In Canada|In Moscow|Fiona is married and lives in Liverpool. Упр. 59.|25
How old is Liza?|Сколько лет Лизе?|Twelve|Eleven|Thirteen|Liza is 12. Упр. 59.|25
How old is Roy?|Сколько лет Рою?|Eleven|Twelve|Ten|Рой на год младше двенадцатилетней Лизы: 12 − 1 = 11. Упр. 59.|25
What is Liza's hair like?|Какие волосы у Лизы?|Wavy and red|Straight and dark|Short and grey|She has wavy red hair. Упр. 59.|25
What does Liza wear?|Что носит Лиза?|Glasses|A uniform in the dialogue|A crown|She wears glasses, like me. Упр. 59.|25
What pets has Liza got?|Какие питомцы у Лизы?|A dog and a parrot|A cat and a dog|Two cats|A dog and a parrot. Упр. 59.|25
What is the parrot's name?|Как зовут попугая?|Roy|Tom|Ilya|Попугая назвали Роем, как брата Лизы. Упр. 59.|25
What is Roy good at?|Что хорошо даётся Рою?|Maths|Cooking in the dialogue|French in the dialogue|He is good at Maths. Упр. 59.|25
What is Roy's dream?|О чём мечтает Рой?|To become a table tennis champion|To become a doctor|To become a singer|His dream is to become a world table tennis champion. Упр. 59.|25
What colour are Roy's eyes?|Какого цвета глаза у Роя?|Brown|Blue|Green|Brown eyes — карие глаза. Упр. 59.|25
Is Liza shorter than Julia?|Лиза ниже Джулии?|No, they are the same height.|Yes, she is.|Julia isn't mentioned.|She is as tall as my cousin Julia. Упр. 59–60.|25
Does the dialogue say the Taylors live in London?|Сказано ли в диалоге, что Тейлоры живут в Лондоне?|No, it doesn't say.|Yes, in the first line.|Yes, in the last line.|Не придумываем факт: город родителей в этом диалоге не назван. Упр. 60.|26
`));
  lesson('grammar','Внешность, сравнения и возраст',questions('grammar',`
Which question asks only about appearance?|Какой вопрос только о внешности?|What does she look like?|What is she like?|What does she like?|Look like — выглядеть; be like — какой человек; like — нравиться. Упр. 58.|24
Which answer describes character?|Какой ответ описывает характер?|She is friendly.|She has red hair.|She is tall.|Friendly — дружелюбная: это характер. Упр. 58.|24
Liza is … tall … Julia.|Лиза такого же роста, как Джулия.|as … as|so … than|more … as|Равенство: as + обычная форма прилагательного + as. Упр. 61.|26
Roy is as … as his sister.|Рой такой же умный, как его сестра.|smart|smarter|smartest|После as нужна обычная форма smart. Упр. 61.|26
Alice's father is … than her mother.|Отец Алисы старше её матери.|older|elder|oldest|С than используется older, не elder. Упр. 67.1.|27
Your cousin is … than my sister, isn't he?|Твой двоюродный брат старше моей сестры, правда?|older|elder|oldest|Older than — старше, чем. Упр. 67.4.|27
Their … daughter works at a hospital.|Их старшая дочь работает в больнице.|elder or older|eldest than|old than|Перед daughter допустимы elder и older; elder подчёркивает родство. Упр. 67.2.|27
What's your … brother's name?|Как зовут твоего старшего брата?|elder or older|elder than|older than|Перед brother допустимы оба слова, без than. Упр. 67.3.|27
`));
  lesson('relatives','Родственники: найди определение',questions('family',`
Who are parents?|Кто такие parents?|A mother and a father|An aunt and an uncle|A brother and a sister|Parents — родители. Упр. 65: 1–g.|26
Who are grandparents?|Кто такие grandparents?|A grandmother and a grandfather|A mother and a father|A grandson and a granddaughter|Grandparents — бабушка и дедушка. Упр. 65: 2–f.|26
Who are grandchildren?|Кто такие grandchildren?|A grandson and a granddaughter|A grandmother and a grandfather|An aunt and an uncle|Grandchildren — внуки. Упр. 65: 3–e.|26
Who is an aunt?|Кто такая aunt?|The sister of your mother or father|The daughter of your brother|The mother of your father|Aunt — тётя. Упр. 65: 4–a.|26
Who is an uncle?|Кто такой uncle?|The brother of your mother or father|The son of your brother|The father of your mother|Uncle — дядя. Упр. 65: 5–h.|26
Who is a cousin?|Кто такой cousin?|A child of your uncle or aunt|A child of your sister|Your mother's brother|Cousin — двоюродный брат или сестра. Упр. 65: 6–b.|26
Who is a niece?|Кто такая niece?|A daughter of your brother or sister|A sister of your mother|A daughter of your aunt|Niece — племянница. Упр. 65: 7–c.|26
Who is a nephew?|Кто такой nephew?|A son of your brother or sister|A brother of your father|A son of your aunt|Nephew — племянник. Упр. 65: 8–d.|26
`));
  lesson('do-make','Do и make: выбираем форму',questions('domake',`
Tomorrow we'll … the shopping and cooking.|Завтра мы займёмся покупками и готовкой.|do|make|doing|После will — начальная форма do. Упр. 72.1.|28
My mother will … a cake for the party.|Моя мама испечёт торт к празднику.|make|do|making|Устойчивое сочетание make a cake. Упр. 72.1.|28
The children are … well in their new school.|У детей всё хорошо в новой школе.|doing|do|making|Are doing: после are здесь нужен глагол-ing. Упр. 72.2.|28
Don't … so much noise: the baby is sleeping!|Не шуми так сильно: малыш спит!|make|do|making|Make noise — шуметь. После don't — начальная форма. Упр. 72.3.|28
My elder sister helps me to … my homework.|Старшая сестра помогает мне делать уроки.|do|make|doing|Do homework — делать домашнее задание. Упр. 72.4.|28
All members of my family … sports.|Все члены моей семьи занимаются спортом.|do|make|does|Do sports; подлежащее во множественном числе. Упр. 72.5.|28
I always … my best.|Я всегда стараюсь изо всех сил.|do|make|makes|Do my best — делать всё возможное. Упр. 71.|28
I want to … friends.|Я хочу подружиться.|make|do|making|Make friends — подружиться. После want to — начальная форма. Упр. 71.|28
`));
  lesson('reading','Шутки, стихотворение и рассказ',questions('reading',`
Why doesn't Fiona's daughter need to talk in the joke?|Почему малышке не нужно говорить в шутке?|She cries and gets what she wants.|She writes letters.|She speaks French.|Шутка 68.2: чтобы получить желаемое, малышке достаточно плакать.|27
What does Mr Plum do in the joke?|Что делает мистер Плам в шутке?|He suffers in silence.|He gives piano lessons.|He takes singing lessons.|Шутка 68.3: Well, I suffer in silence.|27
Who doesn't know French in Robin's joke?|Кто не знает французского в шутке Робина?|His elder sister|His teacher|His mother|Шутка 68.4 намекает, что сестра помогает делать домашние задания.|27
What does “give you a hand” mean in the poem?|Что значит give you a hand в стихотворении?|Help you|Wave goodbye only|Ask you to leave|Это выражение означает «помочь», «протянуть руку помощи». Упр. 70.|27
When do the relatives meet in the story?|Когда родственники встречаются в рассказе?|Every autumn|Every spring|Every winter|Once a year every autumn. Упр. 74.|29
Where do the grandparents live?|Где живут бабушка и дедушка?|In a big house in the country|In a city flat|In a hotel|In a big house in the country. Упр. 74.|29
How many grandchildren have they got?|Сколько у них внуков?|Five|Three|Two|Their five grandchildren. Упр. 74.|29
What did Tom bring to the party?|Что Том принёс на праздник?|A big box and a camera|A guitar and a book|A dog and a parrot|В начале рассказа названы коробка и фотоаппарат. Содержимое коробки здесь не раскрывается. Упр. 74.|29
`));
  CONTENT.words.push(...rows);
  // Keep old lesson order; append additional work within its own section in the course UI.
  CONTENT.lessons.push(...lessons);
  CONTENT.words.push(...(study.extraWords||[]));
  CONTENT.lessons.push(...(study.extraLessons||[]));
  // Practice the actual bilingual materials. These are translation questions,
  // not factual quizzes about possibly dated textbook claims.
  const clean=s=>s.replace(/[\[\]]/g,'');
  const pairs=study.materials.flatMap(m=>m.lines.map((line,i)=>({...line,en:clean(line.en),m,i})))
    .filter(l=>l.en.length>=22&&l.en.length<=220&&l.ru.length>=12&&l.ru.length<=250&&!l.en.includes('\n'));
  for(const unit of CONTENT.units)for(let section=1;section<=unit.sections.length;section++){
    const selected=pairs.filter(l=>l.m.unit===unit.id&&l.m.section===section);
    const tasks=selected.map(l=>{
      const alternatives=[];
      for(const other of pairs){if(other.en===l.en||other.ru===l.ru||alternatives.includes(other.ru)||Math.abs(other.ru.length-l.ru.length)>100)continue;alternatives.push(other.ru);if(alternatives.length===3)break}
      return {id:l.m.id+'-line-'+l.i,type:'choice',study:true,en:l.en,ru:l.ru,display:l.en,answer:l.ru,options:[l.ru,...alternatives],prompt:'Переведи реплику',explanation:'Упр. '+l.m.exercise+': '+l.ru,page:l.m.page,materialId:l.m.id};
    });
    // Tiny groups remain accessible as reading/role play; avoid padding with duplicate questions.
    if(tasks.length<8)continue;
    for(let i=0;i<tasks.length;){let size=Math.min(14,tasks.length-i);if(tasks.length-i-size<8)size=tasks.length-i;
      CONTENT.lessons.push({id:`tb-reading-u${unit.id}-s${section}-${i}`,unit:unit.id,section,title:'Диалоги и переводы · '+(Math.floor(i/14)+1),subtitle:'Фразы из прочитанных заданий',icon:'book',pages:[...new Set(tasks.slice(i,i+size).map(q=>q.page))].join(', '),wordIds:[],tasks:tasks.slice(i,i+size),study:true});i+=size;
    }
  }
  study.wordIds=rows.map(w=>w.id);
  study.lessonIds=lessons.map(l=>l.id);
  for(const lesson of CONTENT.lessons.filter(l=>l.id.startsWith('tb-')))for(const q of lesson.tasks){
    if(!q.options)continue;
    const hash=[...q.id].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,0),shift=hash%q.options.length;
    q.options=[...q.options.slice(shift),...q.options.slice(0,shift)];
  }
})();
