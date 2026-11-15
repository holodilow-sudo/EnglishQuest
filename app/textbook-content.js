/* Transcribed from the user-provided Enjoy English 6 (2019). Russian translations are learning aids. */
(() => {
  'use strict';
  const materials = [];
  function add(id, page, exercise, title, kind, instruction, rows, note='') {
    materials.push({id,unit:1,section:4,page,exercise,title,kind,instruction,note,
      lines:rows.trim().split('\n').map(row=>{const [speaker,en,ru]=row.split('|');return {speaker,en,ru}})});
  }
  add('host-57',24,'57','Звонок принимающей семье','dialogue','Прочитай разговор. Кого и во сколько должна встретить миссис Тейлор?',`
Mrs Taylor|Good morning, Mr Carey!|Доброе утро, мистер Кэри!
Mr Carey|Morning, Mrs Taylor! I’d like to tell you about the children who are going to stay with your family next week.|Доброе утро, миссис Тейлор! Я хотел бы рассказать вам о детях, которые будут жить в вашей семье на следующей неделе.
Mrs Taylor|We are waiting for our guests. The rooms are ready. We’ve thought about the cultural programme, too. Who are our guests?|Мы ждём наших гостей. Комнаты готовы. Мы также подумали о культурной программе. Кто наши гости?
Mr Carey|Two members of our Explorers’ Club will stay with your family: Melissa Olby from Canada and Ilya Ivanov from Russia.|В вашей семье будут жить два участника нашего Клуба исследователей: Мелисса Олби из Канады и Илья Иванов из России.
Mrs Taylor|Very good. We have never been to Canada and Russia. I hope the children will tell us lots of interesting things about their countries, won’t they?|Очень хорошо. Мы никогда не были ни в Канаде, ни в России. Надеюсь, дети расскажут нам много интересного о своих странах, правда?
Mr Carey|I hope they will. They are very sociable and friendly. You should take them tomorrow at 11 am in the hall of the Club … (SH-SH)|Надеюсь. Они очень общительные и дружелюбные. Вам следует забрать их завтра в 11 утра в холле клуба… (помехи)
Mrs Taylor|Mr Carey, Mr Carey I can’t hear you …|Мистер Кэри, мистер Кэри, я вас не слышу…`);
  add('host-59',25,'59','Мелисса рассказывает маме','dialogue','Прочитай диалог. Что Мелисса рассказала маме о семье Тейлоров?',`
Melissa|Hi, Mum! How are you?|Привет, мама! Как дела?
Mother|Hi, honey! I’m fine. And what about you?|Привет, дорогая! У меня всё хорошо. А у тебя?
Melissa|I’m OK. I’ve got some news. The members of the Explorers’ Club who have come here from all over the world are staying with British families for a month!|У меня всё хорошо. Есть новости. Участники Клуба исследователей, приехавшие сюда со всего мира, целый месяц будут жить в британских семьях!
Mother|Really? That will be a good experience!|Правда? Это будет полезный опыт!
Melissa|Yes, I am staying with the Taylors. Wendy says they are friendly and hospitable.|Да, я живу у Тейлоров. Венди говорит, что они дружелюбные и гостеприимные.
Mother|Are there any children of your age in the family?|В этой семье есть дети твоего возраста?
Melissa|Yes, there are. Mr and Mrs Taylor have got a son, Roy, and two daughters, Liza and Fiona. Fiona is grown-up. She is married and lives in Liverpool.|Да. У мистера и миссис Тейлор есть сын Рой и две дочери — Лиза и Фиона. Фиона уже взрослая. Она замужем и живёт в Ливерпуле.
Mother|What about Liza and Roy? Do they live with their parents?|А Лиза и Рой? Они живут с родителями?
Melissa|Yes, they do. Liza is 12. And Roy is a year younger. Both of them are members of our Explorers’ Club.|Да. Лизе двенадцать лет. Рой на год младше. Они оба участники нашего Клуба исследователей.
Mother|So you’ve met them already. Have you made friends with Liza and Roy?|Значит, ты уже познакомилась с ними. Ты подружилась с Лизой и Роем?
Melissa|Yes, sure! I’ve got a lot in common with Liza. Roy is a nice person, too.|Да, конечно! У нас с Лизой много общего. Рой тоже очень приятный человек.
Mother|What is Liza like?|Какая Лиза?
Melissa|Well, she is good-looking. She has wavy red hair. She is as tall as my cousin Julia. Liza is a smart and independent girl. And she wears glasses, like me. She reads a lot and likes animals. She says she has two pets at home.|Она симпатичная. У неё волнистые рыжие волосы. Она такого же роста, как моя двоюродная сестра Джулия. Лиза умная и самостоятельная. Она носит очки, как и я. Она много читает и любит животных. Говорит, что у неё дома два питомца.
Mother|That’s so nice! What are the pets?|Как хорошо! А какие питомцы?
Melissa|A dog and a parrot. She called her parrot Roy like her brother.|Собака и попугай. Она назвала попугая Роем, как брата.
Mother|I think she has a sense of humor. And what about Roy?|Думаю, у неё есть чувство юмора. А что насчёт Роя?
Melissa|Roy is as smart as his sister. He is good at Maths. And he is fond of sports too. His dream is to become a world table tennis champion.|Рой такой же умный, как его сестра. Ему хорошо даётся математика. А ещё он увлекается спортом. Его мечта — стать чемпионом мира по настольному теннису.
Mother|What is he like?|А какой он?
Melissa|Roy is quite handsome. He has short straight dark hair and brown eyes. He is as sociable as his sister. I think we’ll be good friends. Sorry, Mum. But I have to go. I’ll phone you later. Bye!|Рой довольно симпатичный. У него короткие прямые тёмные волосы и карие глаза. Он такой же общительный, как его сестра. Думаю, мы станем хорошими друзьями. Извини, мама, мне пора. Я позвоню тебе позже. Пока!
Mother|Bye-bye. Take care!|Пока-пока. Береги себя!`);
  add('host-68a',27,'68.1','Почему бабушка поседела?','dialogue','Прочитай шутку и разыграй её по ролям.',`
Mother|Paul, you are a naughty boy. You never do what I tell you. If you were a good son, my hair wouldn’t turn grey so early.|Пол, ты непослушный мальчик. Ты никогда не делаешь то, что я тебе говорю. Если бы ты был хорошим сыном, я бы не поседела так рано.
Paul|But Mum, it seems to me you never did what your mother told you. It’s because of you Granny has such grey hair.|Но мама, мне кажется, ты тоже никогда не делала то, что говорила тебе твоя мама. Это из-за тебя у бабушки такие седые волосы.`);
  add('host-68b',27,'68.2','Нужно ли малышке говорить?','dialogue','Прочитай шутку и объясни, как малышка получает то, что хочет.',`
Roy|Fiona, can your little daughter talk?|Фиона, твоя маленькая дочка уже умеет говорить?
Fiona|No, my daughter doesn’t need to talk. All she needs to do is to cry, and she gets everything she wants.|Нет, моей дочке не нужно говорить. Ей достаточно заплакать, и она получает всё, что хочет.`);
  add('host-68c',27,'68.3','Музыкальная семья','dialogue','Прочитай шутку. Что делает мистер Плам, пока семья занимается музыкой?',`
Mr Plum|All the members of my family work hard. My wife gives piano lessons, my son is learning to play the guitar and my daughter takes singing lessons.|Все члены моей семьи много трудятся. Моя жена даёт уроки фортепиано, сын учится играть на гитаре, а дочь берёт уроки пения.
Mr Plum’s aunt|And what about you? What do you do?|А ты? Чем занимаешься ты?
Mr Plum|Well, I suffer in silence.|Ну, я молча страдаю.`);
  add('host-68d',27,'68.4','Кто помогает с уроками?','dialogue','Прочитай шутку. Почему упражнения по немецкому получаются лучше?',`
Teacher|Your German exercises are always better than your French ones. Can you explain why?|Твои упражнения по немецкому всегда лучше, чем по французскому. Ты можешь объяснить почему?
Robin|Yes, I can. It’s because my elder sister doesn’t know French.|Да, могу. Это потому, что моя старшая сестра не знает французского.`);
  add('host-70',27,'70','What Is a Family?','poem','Прочитай стихотворение О. Кларк. Учи по строфам, скрывая английский текст.',String.raw`
|What is a family?\nWell, let me see.\nWhen we all sit together\nAround the table happily.|Что такое семья?\nДайте подумать.\nКогда мы все счастливо сидим вместе\nВокруг стола.
|Sometimes we argue\nAnd then get upset.\nBut soon we’ll forget it\nAnd won’t feel sad.|Иногда мы спорим\nИ потом расстраиваемся.\nНо скоро мы это забудем\nИ перестанем грустить.
|What is a family?\nThere is no pretend.\nThey will always support you\nAnd give you a hand.|Что такое семья?\nЗдесь нет притворства.\nТебя всегда поддержат\nИ протянут руку помощи.
|Cherish your family\nAnd wherever you go\nRemember to call them\nOr send a short ‘hello’.|Дорожи своей семьёй\nИ куда бы ты ни отправился,\nНе забывай звонить родным\nИли посылать короткий привет.`,'Смысловой перевод для понимания, без сохранения рифмы. Озвучка приложения синтезированная.');
  add('host-74',29,'74','Подарок для бабушки','reading','Прочитай начало рассказа. Посмотри на картинку в учебнике и предположи, какой сюрприз приготовил Том.',`
|Once a year every autumn all my close relatives meet and have a party. They all come to my grandma’s birthday. My grandparents live in a big house in the country. And they are always happy to see their five grandchildren and their parents.|Раз в год, каждую осень, все мои близкие родственники собираются на праздник. Все они приезжают на день рождения моей бабушки. Мои бабушка и дедушка живут в большом доме за городом. Они всегда рады видеть своих пятерых внуков и их родителей.
|It was a couple of years ago. We visited my grandma to celebrate her birthday. Our grandma got a lot of presents. But Tom’s present was the best, I think. Tom, my cousin, is 11. He came to the birthday party with a nice big box and a camera.|Это было пару лет назад. Мы приехали к бабушке отпраздновать её день рождения. Бабушка получила много подарков. Но, думаю, подарок Тома был самым лучшим. Моему двоюродному брату Тому одиннадцать. Он пришёл на праздник с красивой большой коробкой и фотоаппаратом.`,'Окончание рассказа в задании 75 дано только в аудиоприложении издательства. В предоставленном PDF его нет; выдуманного окончания и ответов к нему здесь нет.');
  // Verse newlines are represented as literal escapes so the row format stays unambiguous.
  for(const m of materials)for(const line of m.lines)for(const key of ['en','ru'])line[key]=line[key].replace(/\\n/g,'\n');
  const rules=[
    {id:'host-58',page:24,exercise:'58',title:'Характер или внешность?',text:'What is he/she like? — Какой он / какая она? Ответ может описывать характер, внешность или и то и другое. What does he/she look like? — Как он / она выглядит? Это вопрос только о внешности.',examples:[['What is Melissa like?','Какая Мелисса?'],['She is smart and friendly.','Она умная и дружелюбная.'],['What does Ilya look like?','Как выглядит Илья?'],['He is slim. He has got short dark wavy hair.','Он стройный. У него короткие тёмные волнистые волосы.']]},
    {id:'host-61',page:26,exercise:'61–63',title:'Сравниваем: as … as',text:'as + прилагательное + as — такой же …, как. not so + прилагательное + as — не такой …, как. В отрицании также допустимо not as … as. Между as ставим обычную форму: tall, а не taller.',examples:[['Liza’s hair is as long as my hair.','У Лизы такие же длинные волосы, как у меня.'],['English is not so difficult as French.','Английский не такой трудный, как французский.']]},
    {id:'host-66',page:26,exercise:'66–67',title:'Older и elder',text:'Older — старше по возрасту; используется и с than. Elder — старший в семье, обычно перед существительным (elder sister). Не говорим elder than. В некоторых фразах перед родственником возможны оба слова: my elder / older brother.',examples:[['Liza is a year older than Roy.','Лиза на год старше Роя.'],['Their elder sister lives in Liverpool.','Их старшая сестра живёт в Ливерпуле.']]},
    {id:'host-71',page:28,exercise:'71–72',title:'Do или make?',text:'Do часто обозначает работу или занятие, make — создание чего-либо. Но сочетания нужно запоминать целиком: do homework, do the shopping, do sports, do one’s best; make a cake, make a mistake, make friends, make noise. Форма глагола зависит от предложения: are doing, will make.',examples:[['do homework / morning exercises','делать домашнюю работу / утреннюю зарядку'],['do well / badly','хорошо / плохо справляться'],['make up a family','составлять семью']]}
  ];
  const activities=[
    [56,24,'Что происходит на перемене?','Посмотри на рисунок. Расскажи, что сейчас делают участники клуба. Используй am/is/are + глагол-ing.','Пример: Melissa is reading a book. — Мелисса читает книгу. Остальные ответы опираются на рисунок.'],
    [57,24,'Разговор по телефону','Послушай синтезированное чтение или прочитай диалог. Назови гостей, время и место встречи.','Melissa Olby and Ilya Ivanov; tomorrow at 11 am in the hall of the Club.'],
    [58,24,'Внешность и характер','Разбери разницу между двумя вопросами в памятке.','What is she like? — в целом о человеке; What does she look like? — только о внешности.'],
    [59,25,'Разговор Мелиссы с мамой','Прочитай диалог по ролям. Перескажи, что узнал о Тейлорах.','Сначала попробуй сам, затем проверь сведения в диалоге.'],
    [60,26,'Правда или ошибка?','Проверь шесть утверждений по диалогу и исправь неверные.','1: в диалоге не сказано, в каком городе живут родители — не делаем вывод о Лондоне. 2: неверно — Liza is a year older than Roy. 3: верно. 4: неверно — Liza is as tall as Melissa’s cousin. 5: верно. 6: верно.'],
    [61,26,'Правило сравнений','Прочитай памятку as … as / not so … as. Придумай своё сравнение.','Равенство: as tall as. Неравенство: not so tall as / not as tall as.'],
    [62,26,'Вставляем сравнения','Закончи пять предложений с as … as или not so … as. Для личных оценок объясни свой выбор.','2: India is not so large as the Russian Federation. В 1, 3, 4, 5 допустимы разные оценки: важны грамматика и объяснение.'],
    [63,26,'Описываем Илью и Роя','По рисунку сравни рост, волосы и глаза. Используй подсказки учебника.','Шаблон: Ilya and Roy are … . Roy is … . He is as … as … . He has got … hair.'],
    [64,26,'Произношение','Повтори группы слов с [æ], [ɑː], [ʌ], [ð]. Синтезированный голос может отличаться от британской записи книги.','grandmother, grandfather, grandchildren, grandparents; father, grandpa, grandma, aunt; mother, son, uncle, brother, cousin, husband; mother, father, grandmother, grandfather, they.'],
    [65,26,'Кто кому родственник?','Соедини названия родственников и определения. Затем проверь себя в блице.','1–g; 2–f; 3–e; 4–a; 5–h; 6–b; 7–c; 8–d.'],
    [66,26,'Старше и старший','Прочитай памятку older / elder.','Older than, но elder sister.'],
    [67,27,'Older или elder?','Заполни четыре предложения. Помни, что перед названием родственника older тоже может быть правильным.','1 older; 2 elder / older; 3 elder / older; 4 older.'],
    [68,27,'Семейные шутки','Прочитай четыре сценки с переводом. Выбери самую смешную и сыграй роль.','Скрывай свои реплики, оставляя реплики собеседника видимыми.'],
    [69,27,'Интервью о семье','Задай собеседнику пять вопросов о семье. Личные ответы не имеют единственного ключа.','Have you got a brother? What is his name? How old is he? What is he like? What does he look like?'],
    [70,27,'Стихотворение о семье','Прочитай, послушай синтезированную озвучку по строфам и выучи стихотворение.','Прочитай строфу → открой перевод → скрой английский → произнеси по памяти → проверь.'],
    [71,28,'Сочетания с do и make','Выучи сочетания с переводами и примерами.','Не выбирай глагол по одному русскому слову «делать» — запоминай сочетание.'],
    [72,28,'Do и make в предложениях','Заполни пять предложений, выбирая нужную форму глагола.','1 do, make; 2 doing; 3 make; 4 do; 5 do.'],
    [73,28,'Мои обязанности','Расскажи, что любишь и не любишь делать дома, что делаешь часто, иногда или никогда.','Пример: I often tidy my room. I like walking the dog. I don’t like doing the washing-up.'],
    [74,29,'Начало рассказа','Прочитай историю о подарке и предположи, что находится в коробке.','Это предположение по рисунку, а не ответ из отсутствующей аудиозаписи.'],
    [75,29,'Окончание рассказа — аудио','Для выполнения нужна оригинальная запись издательства. PDF содержит только вопросы.','Без записи нельзя достоверно выбрать варианты. Можно пока повторить лексику и начало рассказа.'],
    [76,29,'Мой семейный праздник','Напиши небольшой рассказ о последнем семейном празднике. Используй Past Simple и слова для порядка событий.','Last time we met … . First … . Then … . At that moment … . After that … . Finally … . Перечитай: где, когда, кто и что делал?']
  ].map(([exercise,page,title,instruction,help])=>({id:'host-ex-'+exercise,exercise,page,title,instruction,help,unit:1,section:4}));
  window.TextbookStudy={materials,rules,activities};
})();
