(() => {
const B=window.TextbookBuilder;
B.activities(3,6,`
116|117|Угадай знаменитость по голосам|Соотнеси диалоги с фотографиями.|Для аудирования нужна запись; в напечатанных диалогах 117 названы Lewis Hamilton, Kate Winslet, Helen Sharman.|audio
117|117|Три разговора о людях|Прочитай и разыграй один диалог.|Все три диалога переведены в теме. Спортивные рекорды и команда Hamilton в тексте исторические, не текущие.
118|118|Названия профессий|Образуй слова и выучи окончания.|act—actor, write—writer, art—artist, science—scientist, music—musician, architecture—architect. Police officer — современный нейтральный вариант policeman.
119|118|Кто кем был?|Назови известных представителей профессий.|Sergei Rachmaninoff was a pianist and composer. Проверь профессию человека, а не только узнаваемость имени.
120|118|Шесть биографий|Соедини описания с портретами.|A–6 Paul McCartney; B–4 Isaac Newton; C–3 J. K. Rowling; D–2 Horatio Nelson; E–1 Robert Burns; F–5 David Beckham.
121|119|Загадка о человеке|Расскажи без имени, чтобы класс угадал.|Профессия, работа/достижение, место или дата. Не называй имя до ответа.
122|119|Принцесса Диана|Выбери причину прозвища по записи.|Нужна запись; не заменяем аудирование общими знаниями.|audio
123|119|Звуки в биографии|Прочитай пять групп слов.|Charity, candidate, award, astronaut, performance. Отдельно повтори ударение.
124|119|Дэниел Рэдклифф|Выбери шесть слов для биографии.|1 actor; 2 literary; 3 TV show; 4 film; 5 richest; 6 Award. Полный заполненный текст переведён ниже.
125|120|Обычно или сейчас?|Сравни Present Simple и Continuous.|Every day, often — регулярность; now, at the moment — процесс. Continuous также обозначает договорённость на ближайшее будущее.
126|120|Формы глаголов|Раскрой скобки в шести ситуациях.|1 lives; 2 are waiting; 3 comes; 4 am writing; 5 is … doing / is trying; 6 are … doing / see.
127|120|Киплинг и Индия|Прочитай биографию и объясни связь писателя с Индией.|Он родился там, работал журналистом и путешествовал по стране, изучая людей и традиции.
128|121|Вопросы о Киплинге|Ответь по тексту, затем добавь опыт чтения.|1865, India; журналист и путешественник; писал детям и взрослым; The Jungle Book; Nobel Prize 1907. Последние вопросы — мнение и личный опыт.
129|121|Что означают числа?|Соотнеси шесть чисел с биографией.|1865 рождение; 6 лет — уехал учиться в Англию; 1882 вернулся в Индию; 24 года — вернулся в Британию; 1907 премия; 1936 смерть.
130|121|Синонимы из биографии|Найди семь слов/выражений.|well-known—famous; come back—return; reporter—journalist; planet—world в контексте; custom—tradition; exciting—thrilling; take a trip—travel.
131|121|Какие рассказы ты читал?|Спроси одноклассников о шести названиях.|Have you read … yet? Yes, I have. / No, I haven't. Названия: «Братья Маугли», «Слонёнок», «Кошка, гулявшая сама по себе», «Рикки-Тикки-Тави», рассказы о горбе верблюда и глотке кита.
132|122|Шесть слуг-вопросов|Прочитай стихотворение и перевод Колкера.|What, Why, When, How, Where, Who — «слуги», помогающие узнавать мир. Все пять строф и печатный перевод добавлены ниже.
ДЗ 15|134|Профессии из основ|Образуй нужные существительные.|1 actor; 2 policeman; 3 artist; 4 musician; 5 chemist / writer; 6 sportsman; 7 architect.
ДЗ 16|134|Роберт Бёрнс|Заполни биографию словами из рамки.|eldest, hard, favourite, started, became, national, celebrate, over; was born дано как образец. Полный перевод ниже.
`);
B.rule(3,6,'tb-rule-u3-biography',120,'118, 125','Профессии и времена','Суффикс профессии нужно запоминать со словом: writer, scientist, musician, architect. Present Simple описывает регулярное действие, Continuous — текущий процесс; биография с датой обычно требует Past Simple.',`She writes stories every day.|Она пишет рассказы каждый день.
She is writing a story now.|Сейчас она пишет рассказ.
He was born in 1865.|Он родился в 1865 году.
Music — musician; science — scientist.|Музыка — музыкант; наука — учёный.`);
B.text(3,6,'tb-text-u3-famous',118,'120','Шесть людей: соединённые биографии',`
A|Sir Paul McCartney is an English singer and songwriter. He was a member of the popular rock band the Beatles, the most successful rock band in the history of popular music.|Сэр Пол Маккартни — английский певец и автор песен. Он был участником «Битлз», которую автор называет самой успешной рок-группой в истории популярной музыки.
B|Sir Isaac Newton is still the most important scientist in the world. He discovered many laws of physics. He discovered the theory of gravity by watching the fall of an apple from a tree.|Автор называет сэра Исаака Ньютона важнейшим учёным. Он открыл многие законы физики. История о наблюдении за падающим яблоком связывается с его теорией тяготения.
C|J. K. Rowling is an English writer and producer, but she is best known as the author of Harry Potter books. They have become the best-selling book series in history. In 2010 J. K. Rowling was named the 'most influential woman in Britain'.|Дж. К. Роулинг — английская писательница и продюсер, известная прежде всего книгами о Гарри Поттере. В тексте они названы самой продаваемой серией, а в 2010 году Роулинг получила звание «самой влиятельной женщины Британии».
D|Lord Horatio Nelson was a famous English officer in the Royal Navy. Of his several victories the most well-known is the Battle of Trafalgar in 1805, during which he died. There is a great monument in his honour in Trafalgar Square in London.|Лорд Горацио Нельсон был известным офицером британского флота. Самая знаменитая победа — Трафальгарское сражение 1805 года, в котором он погиб. На Трафальгарской площади в Лондоне стоит памятник ему.
E|Robert Burns was a Scottish poet. He was born in 1759. Scots simply call him 'The Bard'. His birthday is on 25th January. Every year on that day people all over the world remember him and read his poems.|Роберт Бёрнс — шотландский поэт, родившийся в 1759 году. Шотландцы называют его Бардом. Его день рождения — 25 января; ежегодно люди вспоминают его и читают стихи.
F|David Beckham is a famous English footballer. He played for the England national team, Manchester United, Real Madrid and many other clubs. He was the winner of different international competitions for a long time. In 2004 he was on the FIFA 100 list of the world's greatest living players.|Дэвид Бекхэм — известный английский футболист. Он играл за сборную Англии, Manchester United, Real Madrid и другие клубы, побеждал в международных соревнованиях. В 2004 году вошёл в список FIFA 100 выдающихся живущих игроков.
`,'Имена вставлены по подписанным портретам. Оценочные превосходные степени — мнение/формулировка книги; история о яблоке — известный рассказ, не описание одного мгновения открытия всей теории.');
B.text(3,6,'tb-text-u3-radcliffe',119,'124','Daniel Jacob Radcliffe',`
|Daniel Jacob Radcliffe is an English actor. He was born on 23rd July 1989 into the family of a literary agent. Radcliffe started acting in school plays when he was in primary school. When he was ten years old, he played the part of the young David Copperfield in a TV show.|Дэниел Джейкоб Рэдклифф — английский актёр. Родился 23 июля 1989 года в семье литературного агента. Начал играть в школьных постановках в начальных классах. В десять лет сыграл юного Дэвида Копперфилда в телепостановке.
|In 2001 he played the lead role in the film 'Harry Potter and the Philosopher's Stone'. Now he is most famous for playing Harry in all eight films based on Harry Potter books. It makes Radcliffe one of the richest young people in the United Kingdom. It helps him to support different charities, for example, several children's hospitals. In 2007, he received the National Movie Award 'Best Male Performance'.|В 2001 году сыграл главную роль в «Гарри Поттере и философском камне». Известен ролью Гарри во всех восьми фильмах. Автор пишет, что доходы позволили ему стать одним из богатейших молодых людей UK и поддерживать благотворительность, включая детские больницы. В 2007 году получил National Movie Award за лучшую мужскую роль.
`,'Заполненный текст учебника; now относится ко времени его написания.');
B.text(3,6,'tb-text-u3-kipling',120,'127','Joseph Rudyard Kipling',`
|Joseph Rudyard Kipling (1865–1936) was one of the most famous British writers and poets. He was born in India which was a colony of Great Britain at that time. His father was an artist and a teacher. When the boy was six, he went to England and got British education. He returned to India in 1882 and worked there as a journalist.|Джозеф Редьярд Киплинг (1865–1936) — один из известнейших британских писателей и поэтов. Родился в Индии, бывшей тогда британской колонией. Отец был художником и учителем. В шесть лет мальчик уехал учиться в Англию. В 1882 году вернулся в Индию и работал журналистом.
|Kipling liked India. To get material for his newspaper he travelled around India and learnt a lot about the country, its traditions and its people. At the same time he started writing poems and stories in his free time.|Киплинг любил Индию. Собирая газетные материалы, путешествовал и многое узнал о стране, традициях и людях. Тогда же начал писать стихи и рассказы в свободное время.
|At twenty-four Kipling returned to Great Britain and quickly became a famous writer and poet for children and adults. Lots of people from all over the world like his books 'Just So Stories', 'The Elephant's Child' or 'The Cat that Walked by Himself'. But his most famous work is 'The Jungle Book' which consists of several short stories. They are 'Mowgli's Brothers', 'Tiger! Tiger!', 'Rikki-Tikki-Tavi' and others.|В двадцать четыре года вернулся в Британию и быстро стал известен как писатель и поэт для детей и взрослых. Во всём мире любят его «Сказки просто так», «Слонёнка», «Кошку, гулявшую сама по себе». Самое известное произведение — «Книга джунглей», сборник рассказов, включая «Братьев Маугли», «Тигр! Тигр!», «Рикки-Тикки-Тави».
|'Mowgli's Brothers' is a thrilling story about the small boy who was lost in the jungle. He grows up with the help of Baloo the bear, Bagheera the Black Panther and then fights with the tiger, Shere Khan.|«Братья Маугли» — увлекательная история о мальчике, потерявшемся в джунглях. Он растёт с помощью медведя Балу и чёрной пантеры Багиры, затем сражается с тигром Шер-Ханом.
|During his life Rudyard Kipling travelled a lot around the world. He described his adventures and impressions in his travel stories. In 1907 Kipling was awarded the Nobel Prize for Literature. He was the first English writer who received this prize.|Киплинг много путешествовал по миру и описывал приключения и впечатления в путевых рассказах. В 1907 году получил Нобелевскую премию по литературе, став первым английским писателем — её лауреатом.
`);
B.text(3,6,'tb-text-u3-six-servants',122,'132','I keep six honest serving-men',String.raw`
|I keep six honest serving-men\n(They taught me all I knew);\nTheir names are What and Why and When\nAnd How and Where and Who.|Шестёрка слуг — Кто, Где, Когда,\nЧто, Почему и Как —\nВсегда находится в трудах,\nЧтоб не попасть впросак.
|I send them over land and sea,\nI send them east and west;\nBut after they have worked for me,\nI give them all a rest.|Идут по суше и морям,\nНа Запад и Восток,\nИ всё, что я не знаю сам,\nОни готовят впрок.
|I let them rest from nine till five,\nFor I am busy then,\nAs well as breakfast, lunch, and tea,\nFor they are hungry men.|Но я даю им отдохнуть,\nПусть поедят, поспят.\nОкончен день — им снова в путь —\nУже пробило пять.
|But different folk have different views.\nI know a person small —\nShe keeps ten million serving-men,\nWho get no rest at all!|Но у меня есть юный друг,\nТак, девочка одна.\nЕй служат сотни тысяч слуг\nБез отдыха и сна.
|She sends 'em abroad on her own affairs,\nFrom the second she opens her eyes —\nOne million Hows, two million Wheres,\nAnd seven million Whys!|С утра она их шлёт везде,\nКуда, я не пойму,\nСто тысяч Как, сто тысяч Где,\nСто тысяч Почему.
`,'Редьярд Киплинг. Русский стихотворный перевод Я. М. Колкера напечатан на странице 122; он передаёт образ, а не буквально каждую строку и число.','poem');
B.text(3,6,'tb-text-u3-burns',134,'ДЗ 16','Robert Burns',`
|Robert Burns, a well-known Scottish poet, was born in 1759. His father was a farmer. There were seven children in the family and Robert was the eldest. He helped his father on the farm and had to work hard. However, from his childhood Robert liked reading. His favourite writer was William Shakespeare.|Известный шотландский поэт Роберт Бёрнс родился в 1759 году. Его отец был фермером. Роберт — старший из семи детей — помогал отцу и много работал. С детства любил читать, любимым писателем был Шекспир.
|At the age of 15 Robert Burns started writing poems. His poems and songs were about ordinary people, their feelings and the beauty of nature. Soon they became very popular. Robert Burns was the author of the famous song 'Auld Lang Syne'. It has become a national song. Nowadays Scottish people sing it when they celebrate New Year's Day on 1st January. Robert Burns died in 1796. People all over the world know and love his poems and songs.|В пятнадцать лет начал писать стихи об обычных людях, чувствах и красоте природы. Вскоре они стали популярны. Он автор слов знаменитой «Auld Lang Syne», ставшей национальной песней; в тексте её поют на Новый год. Бёрнс умер в 1796 году. Его стихи и песни знают и любят во всём мире.
`);
B.vocabulary(3,6,'tb-vocab-u3-s6','Биографии и профессии',`
award|награда|She received an award.|Она получила награду.|117
leading role|главная роль|He played the leading role.|Он сыграл главную роль.|117
charity|благотворительность|He supports charity.|Он поддерживает благотворительность.|119
scientist|учёный|Newton was a scientist.|Ньютон был учёным.|118
musician|музыкант|She is a musician.|Она музыкант.|118
journalist|журналист|Kipling worked as a journalist.|Киплинг работал журналистом.|120
discover|открывать|Scientists discover new things.|Учёные открывают новое.|118
ordinary|обычный|He wrote about ordinary people.|Он писал об обычных людях.|134
`);
B.quiz(3,6,'tb-check-u3-s6','Знаменитые люди: проверка',`
Who wrote the Harry Potter books?|Кто написал книги о Гарри Поттере?|J. K. Rowling|Daniel Radcliffe|David Beckham|Роулинг — автор, Рэдклифф — актёр.|118
Who was a member of the Beatles?|Кто входил в «Битлз»?|Paul McCartney|Isaac Newton|Robert Burns|Соответствие A–6.|118
Where was Kipling born?|Где родился Киплинг?|India|Canada|Wales|Место рождения указано в 127.|120
Why did Kipling travel around India?|Зачем он путешествовал по Индии?|To collect newspaper material|To play football|To build a stadium|Он работал журналистом.|121
When did Kipling receive the Nobel Prize?|Когда получил Нобелевскую премию?|1907|1759|1882|Дата в последнем абзаце.|121
She … the piano every day.|Выбери время.|plays|is play|playing|Every day — регулярное действие.|120
Listen! Someone … .|Действие сейчас.|is singing|sing|sings every year|Listen привлекает внимание к текущему процессу.|120
Who are the six serving-men in the poem?|Кто шесть слуг в стихотворении?|Question words|Six musicians|Six kings|Это What, Why, When, How, Where, Who.|122
`);
B.coverage(3,6,116,132,['15','16']);
})();
