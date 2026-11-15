(() => {
const B=window.TextbookBuilder;
B.activities(4,3,`
50|158|Британский спорт: слушаем|Заполни два предложения.|Оригинальная запись необходима; печатные тексты 53 изучаются отдельно.|audio
51|158|Названия спорта|Прочитай список и переведи.|Swimming, skating, skiing — плавание, коньки, лыжи; horse/boat/motor racing — скачки/гребные гонки/автогонки. Не путай skating и skiing.
52|158|Круговая диаграмма|Сравни популярность видов спорта по книге.|Football 35%, tennis 17%, swimming 10%, boxing 9%, motor racing 8%, cricket 7%, skiing 6%, golf 4%, darts/badminton по 2%. Это данные диаграммы, не текущий опрос.
53|158|Четыре текста о спорте|Соотнеси тексты с фотографиями.|A tennis, B racing, C football, D cricket. Переводы всех текстов находятся в теме.
54|159|Пропущенные предложения|Определи, куда вставить четыре предложения.|1 cricket; 2 football; 3 boat racing; 4 tennis. Смысловые вставки с переводом ниже; формулировки рекордов рассматриваем как текст книги.
55|159|Восемь вопросов|Вставь вопросительные слова и ответь.|1 What country — England по тексту; 2 Where — Wimbledon; 3 What kinds of — horse/motor/boat; 4 When — 1829; 5 How many — four; 6 What — команды названы в статье, оценка историческая; 7 Where — страны из вставки; 8 What — две команды по 11, бросок и удар битой.
56|159|Спорт в России|Сравни популярность и объясни мнение.|I think … is popular because … . Отличай личное наблюдение от статистики.
57|160|Рейтинг класса|Оцени 12 видов, затем собери ответы группы.|Подсчитай реальные голоса. The most popular sport in our group is … .
58|160|Интервью Олега|Назови его занятия по записи.|Печатная версия 59 доступна с переводом, но исходное аудио отсутствует.|audio
59|160|Вопросы к интервью|Соедини три вопроса с ответами.|1–B; 2–C; 3–A. Олег плавает, занимается карате, зимой катается на коньках, весной/летом — на роликах.
60|161|Мой ответ корреспонденту|Ответь на пять вопросов лично.|Любимые виды, умения, соревнования по ТВ, школьные объекты, досуг. I can play … / We have … .
61|161|Согласие и несогласие|Выучи пять разговорных фраз.|I think/believe that; Yes, I agree; That's an excellent idea; Do you really think so? I'm not so sure about that.
62|161|Интервью об английском спорте|Построй разговор по схеме.|Попроси помощь → два вопроса → мнение о спорте → согласие/сомнение с причиной → приглашение на матч. Ниже образец с переводом.
63|162|Угадай игру по правилам|Подбери четыре игры.|1 volleyball; 2 rugby; 3 basketball в упрощённом историческом описании; 4 football. Правила 3 и 4 неполны/неточны для современного спорта: не учим их как действующий регламент.
64|162|Статья о школьном событии|Напиши по четырём пунктам.|Когда, где, участники, впечатление. Past Simple для прошедшего матча, because для оценки.
ДЗ 7|177|История регби|Прочитай текст и составь пять вопросов.|When did people start playing rugby in Wales? What is the national sport of Wales? Where did the game appear? Who ran with the ball? Is rugby popular nowadays?
ДЗ 8|177|Спорт в России|Вставь шесть слов.|popular; international; important; successful; national; free. Первый popular уже стоит в начале; после national and идёт international. Полный вариант ниже.
`);
B.rule(4,3,'tb-rule-u4-opinion',161,'61, 64','Мнение с аргументом','I think / I believe вводит мнение, because — причину. Agree употребляется как глагол: I agree, без am. Для прошедшего события нужны was/were и Past Simple.',`Yes, I agree because sport brings people together.|Да, согласен: спорт объединяет людей.
I'm not so sure about that.|Я в этом не так уверен.
The match took place on Friday.|Матч состоялся в пятницу.
Our team won.|Наша команда победила.`);
B.text(4,3,'tb-text-u4-sport-inserts',159,'54','Вставки в спортивные тексты',`
Cricket|But it is also popular in Australia, India, Pakistan and Southern Africa.|Но он также популярен в Австралии, Индии, Пакистане и на юге Африки.
Football|It is not true because similar games were played in different countries. The English suggested the laws of the game in 1863.|Это не совсем так: похожие игры существовали в разных странах. Англичане предложили правила в 1863 году.
Boat racing|It takes place on the River Thames and it usually lasts 15–20 minutes.|Гонка проходит по Темзе и обычно длится 15–20 минут.
Tennis|It is the oldest competition and the only one where the players still play on grass.|Автор называет его старейшим соревнованием и единственным с игрой на траве. Последнее верно лишь при ограничении сравнения соответствующей группой турниров, а не всеми соревнованиями мира.
`,'Предложения к вставке в 53; оценки турнира переданы с пояснением.');
B.text(4,3,'tb-text-u4-oleg',160,'59','Интервью Олега Петрова',`
Correspondent|What sports games are popular in Russia?|Какие спортивные игры популярны в России?
Oleg|Various sports. But I think football, ice hockey and figure skating are the most popular sports in Russia. Other popular sports are basketball, volleyball, car racing and skiing. A lot of fans go to local stadiums to support their favourite teams and sportsmen.|Разные. Думаю, самые популярные — футбол, хоккей и фигурное катание. Также баскетбол, волейбол, автогонки и лыжи. Болельщики ходят на стадионы поддержать любимые команды и спортсменов.
Correspondent|What do you do to keep fit?|Что ты делаешь, чтобы быть в форме?
Oleg|Although I like sports, I do not want to go in for sport professionally. Besides swimming and karate, I like skating in winter. Skating is a popular activity among my friends. There are a number of skating rinks in our town. And we often go there at weekends. In summer and spring I often roller skate in the park.|Хотя люблю спорт, профессионально заниматься не хочу. Кроме плавания и карате, зимой люблю коньки. Они популярны у моих друзей. В городе несколько катков, куда мы ходим по выходным. Весной и летом часто катаюсь на роликах в парке.
Correspondent|Is sport important for your family?|Важен ли спорт для твоей семьи?
Oleg|Yes, it is. My family takes sport seriously. My father is fond of volleyball. My mother likes swimming. My elder sister is a student at medical college and hasn't got too much time for sport. That's why she tries to get fit at home. She has a lot of books and CDs with instructions how to do home exercise programmes. My father and I like to watch football, ice hockey and chess championships on TV. My mother and my sister prefer to watch figure skating competitions on TV.|Да, семья относится к спорту серьёзно. Папа любит волейбол, мама — плавание. Старшая сестра учится в медицинском колледже, времени мало, поэтому занимается дома по книгам и дискам. Мы с папой смотрим футбол, хоккей и шахматные чемпионаты, мама с сестрой предпочитают фигурное катание.
`,'Ответы расположены по вопросам.','dialogue');
B.text(4,3,'tb-text-u4-sport-model',161,'62','Образец интервью по схеме',`
Student 1|Mike, I'm doing a presentation about sports that are popular in the English-speaking countries. Could you help me?|Майк, я делаю презентацию о спорте в англоязычных странах. Поможешь?
Student 2|Of course. What do I need to do, Olga?|Конечно. Что нужно сделать, Ольга?
Student 1|Just answer some questions.|Просто ответь на несколько вопросов.
Student 2|OK. I'm ready.|Хорошо, я готов.
Student 1|What team games are popular in Britain? Is tennis popular too?|Какие командные игры популярны в Британии? Теннис тоже популярен?
Student 2|I think football and cricket are popular. I believe tennis is popular too. It is important to do sports no matter where you live.|Думаю, футбол и крикет популярны. И теннис тоже. Важно заниматься спортом независимо от места жительства.
Student 1|Yes, I agree. Sport helps us keep fit. Would you like to play volleyball with us tomorrow?|Согласна: спорт помогает быть в форме. Сыграешь с нами завтра в волейбол?
Student 2|That's an excellent idea. I'd love to.|Отличная идея. С удовольствием.
`,'Первые четыре реплики из схемы; последующие — созданный учебный образец, не оригинальный диалог.','dialogue');
B.text(4,3,'tb-text-u4-rugby',177,'ДЗ 7','Rugby',`
|People started to play rugby in Wales in the 1880s. Nowadays rugby is the national sport of the country. The sport gets its name after Rugby School. It was the place where the game appeared.|В Уэльсе начали играть в регби в 1880-х годах. В тексте оно названо национальным спортом. Название связано со школой Rugby, где возникла игра.
|According to the legend, in 1823 while playing football William Webb Ellis caught the ball and ran with the ball in hand towards the opponent goal. Soon the new sport game became very popular in Wales. Nowadays rugby is played in more than 100 countries.|По легенде, в 1823 году Уильям Уэбб Эллис во время футбольного матча схватил мяч и побежал с ним к чужим воротам. Новая игра стала популярна в Уэльсе. По учебнику, в регби играют более чем в ста странах.
`,'История Эллиса в самом тексте названа легендой.');
B.text(4,3,'tb-text-u4-russian-sport',177,'ДЗ 8','Спорт в России: заполненный текст',`
|Many sports are popular in Russia. There are many stadiums, swimming pools and sports gyms here. A lot of national and international matches and competitions are regularly held in our country. They attract a large number of fans. Most of the important games are shown on TV.|В России популярны многие виды спорта. Есть стадионы, бассейны и спортзалы. Регулярно проходят национальные и международные соревнования, привлекающие болельщиков. Важные матчи показывают по телевизору.
|Russia has been successful in a number of different sports, especially in ice hockey. The national team of Russia has won the World Hockey championships many times. Nowadays sport plays an important role in the lives of most Russians. They spend their free time playing football, basketball, volleyball, going swimming and doing other sports. In winter lots of Russians go skiing and skating. There are hundreds of skating rinks in the cities and towns of Russia.|Россия добивалась успехов в разных видах спорта, особенно хоккее. Сборная неоднократно выигрывала чемпионаты мира. Автор подчёркивает роль спорта в жизни людей: в свободное время играют в футбол, баскетбол, волейбол, плавают, зимой катаются на лыжах и коньках. В городах много катков.
`,'Описание спортивной жизни — по учебнику.');
B.vocabulary(4,3,'tb-vocab-u4-s3','Говорим о спорте',`
keep fit|поддерживать форму|I swim to keep fit.|Я плаваю, чтобы быть в форме.|160
support a team|поддерживать команду|Fans support their team.|Болельщики поддерживают команду.|160
skating rink|каток|We went to the skating rink.|Мы пошли на каток.|160
horse racing|скачки|Horse racing is mentioned in the text.|В тексте упомянуты скачки.|158
boat racing|гребные гонки|They watched boat racing.|Они смотрели гребные гонки.|158
championship|чемпионат|We watched the championship.|Мы смотрели чемпионат.|158
agree|соглашаться|Yes, I agree.|Да, я согласен.|161
take place|происходить|The match took place on Monday.|Матч состоялся в понедельник.|162
`);
B.quiz(4,3,'tb-check-u4-s3','Спорт: проверка понимания',`
Which universities take part in the boat race in the text?|Какие университеты участвуют в гонке?|Oxford and Cambridge|Oxford and Leeds|London and Cardiff|Пара названа в тексте B.|158
How many players are in one cricket team in the text?|Сколько игроков в одной команде?|Eleven|Five|Twenty-two|Две команды по одиннадцать.|158
What does Oleg do in winter?|Что Олег делает зимой?|Goes skating|Only sails|Only plays golf|В ответе C названы коньки.|160
What does Oleg's mother like?|Что любит мама Олега?|Swimming|Car racing|Boxing|В ответе A — swimming.|160
Why does his sister exercise at home?|Почему сестра занимается дома?|She has little time|She dislikes all sport|She is a professional coach|Учёба оставляет мало времени.|160
Yes, I … .|Да, я согласен.|agree|am agree|agreeing only|Agree — глагол, am не нужен.|161
The match … yesterday.|Матч состоялся вчера.|took place|take place|has take|Yesterday требует Past Simple.|162
Where does the name rugby come from in the text?|Откуда название регби?|Rugby School|A river|A flower|Игра названа по школе.|177
`);
B.coverage(4,3,50,64,['7','8']);
})();
