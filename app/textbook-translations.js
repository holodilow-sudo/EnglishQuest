/* Russian-to-English homework from the user-provided book, with example translations. */
(() => {
 'use strict';
 const data=window.TextbookStudy;
 function add(unit,section,page,exercise,title,rows,note='Пример перевода для самопроверки. Другие грамматически правильные формулировки тоже возможны. Сначала выбери режим «Вспоминаю весь английский текст» и переведи самостоятельно.'){
  data.materials.push({id:`tb-translation-${unit}-${exercise}`,unit,section,page,exercise,title,kind:'translation',instruction:'Переведи русское выражение или предложение на английский, затем сравни с примером.',note,lines:rows.trim().split('\n').map(row=>{const [en,ru]=row.split('|');return {speaker:'',en,ru}})});
 }
 add(1,3,42,'ДЗ 8','Перевод: чудеса природы',`
wonders of nature|чудеса природы
a unique national park|уникальный национальный парк
a powerful river|мощная река
explore the underwater world|исследовать подводный мир
Have you seen his film about a trip to Australia? — Not yet.|Ты посмотрел его фильм о поездке в Австралию? — Ещё нет.
The film is worth watching. You will learn a lot of interesting facts about the continent and its nature.|Фильм стоит посмотреть. Ты узнаешь много интересного (много интересных фактов) о континенте и его природе.
I have recently learned about the Krasnoyarsk Pillars. I would like to visit this national park and see its unique rocks.|Я узнал о Красноярских Столбах недавно. Мне бы хотелось побывать в этом национальном парке и увидеть уникальные скалы.
`);
 add(1,6,44,'ДЗ 14','Перевод: праздники и гости',`
congratulate friends|поздравлять друзей
chat with each other|болтать друг с другом
play board games|играть в настольные игры
a traditional present|традиционный подарок
invite guests|приглашать гостей
in honour of the victory|в честь победы
Have you sent a greeting card to your grandma? — Yes, I sent it yesterday.|Ты отправил поздравительную открытку бабушке? — Да. Я отправил её вчера.
What are you going to do on 1st May? — We are going to have a picnic. It is usually warm and sunny on 1st May. Would you like to join us? — Yes, with pleasure.|Что вы собираетесь делать 1 мая? — Мы пойдём на пикник. Обычно 1 мая тепло и солнечно. А вы хотите пойти с нами? — Да, с удовольствием.
It is Alice's birthday next week. She has invited a lot of guests. So the party will be on the lawn in front of the house. Her friends will congratulate Alice, play board games and chat with each other.|На следующей неделе у Алисы день рождения. Она пригласила много гостей. Поэтому вечеринка будет на лужайке перед домом. Друзья будут поздравлять Алису, играть в настольные игры и болтать друг с другом.
`);
 add(2,1,75,'ДЗ 3','Перевод: отдых и обязанности',`
I'm tired. Let's stop and have a rest.|Я устал. Давай остановимся и отдохнём.
Have you been to France? — No. But I will have to go there in spring to take part in a competition.|Ты был во Франции? — Нет. Но я должен буду поехать туда весной, чтобы принять участие в соревновании.
Tourists mustn't go close to the huge stones of Stonehenge.|Туристы не должны подходить близко к огромным камням Стоунхенджа.
Goodbye! Have a good trip!|До свидания! Хорошего путешествия!
When did you have to leave for the competition? — Yesterday evening. But I caught a cold.|Когда ты должен был уехать на соревнование? — Вчера вечером. Но я простудился.
`);
 add(2,2,76,'ДЗ 5','Перевод: животные и природа',`
a rare plant|редкое растение
an endangered animal|животное, находящееся под угрозой вымирания
watch wildlife|наблюдать за живой природой
save animals|спасать животных
Have you ever been to a zoo? — Yes, I went to the zoo recently.|Ты когда-нибудь был в зоопарке? — Да. Я недавно ходил в зоопарк.
The zoo is located in the centre of the town.|Зоопарк расположен в центре города.
You can see a lot of rare and exotic animals in the zoo.|В зоопарке можно увидеть много редких и экзотических животных.
How many species of birds and animals are there in your zoo? — I think there are more than three hundred.|Сколько видов птиц и зверей в вашем зоопарке? — Думаю, более 300.
`);
 add(2,4,76,'ДЗ 10','Перевод: готовим и угощаем',`
Help yourself! — I'm not hungry. I've already had lunch.|Угощайтесь! — Я не голоден, я уже пообедал.
What a delicious pie! What did you put in it? — Five apples, some flour, a cup of sugar and three eggs.|Какой вкусный пирог! Что вы туда положили? — Пять яблок, немного муки, чашку сахара и три яйца.
The Russians and the British drink a lot of tea.|Русские и англичане пьют много чая.
How many mushrooms do we need for this dish? — A few.|Сколько грибов нужно для этого блюда? — Немного.
What do you need to make a pizza? — Some flour and a few eggs for the dough. Also some bacon, a few tomatoes and some cheese.|Что тебе нужно, чтобы приготовить пиццу? — Немного муки и несколько яиц для теста. А также немного бекона, несколько помидоров и немного сыра.
`);
 add(3,2,132,'ДЗ 4','Перевод: Великобритания',`
consist of three countries|состоять из трёх стран
the official name of the whole country|официальное название целой / всей страны
the largest island|самый большой остров
include different countries|включать в себя разные страны
speak English|говорить по-английски
Have you got any ideas? — I'm afraid not.|У тебя есть какие-нибудь идеи? — К сожалению, нет.
English is the official language of the country.|Английский является официальным языком страны.
What is the national flag of the United Kingdom called? — The Union Jack.|Как называется национальный флаг Соединённого Королевства? — Юнион Джек.
Great Britain consists of three countries: England, Wales and Scotland.|Великобритания состоит из трёх стран: Англии, Уэльса и Шотландии.
`,'Примеры перевода заданных предложений. Great Britain здесь — остров с Англией, Уэльсом и Шотландией; United Kingdom также включает Северную Ирландию. Не смешивай эти названия.');
 add(3,7,134,'ДЗ 17','Перевод: свободное время',`
spend free time|проводить свободное время
visit exhibitions|посещать выставки
collect key rings|коллекционировать брелки
make model planes|создавать модели самолётов
go skateboarding|кататься на скейтборде
What do you do in your free time? — I read and play a strategy game.|Чем ты занимаешься в свободное время? — Я читаю и играю в стратегию.
My mother likes gardening in her free time. There are a lot of beautiful flowers and unusual plants in our garden.|Моя мама любит заниматься садом в свободное время. В нашем саду много красивых цветов и необычных растений.
In the evenings she chats on the phone or watches TV. There is no room for sport in her life.|По вечерам она болтает по телефону или смотрит телевизор. В её жизни нет места спорту.
Let's go to the cinema tomorrow! — That's a great idea! I haven't been to the cinema for ages.|Давайте сходим завтра в кино! — Замечательная идея! Я не был в кино тысячу лет.
`);
 add(4,1,176,'ДЗ 5','Перевод: приключения',`
overcome difficulties|преодолевать трудности
work in a team|работать в команде
an exciting adventure|захватывающее приключение
a school team|школьная команда
an extreme journey|экстремальное путешествие
The traveller has written a book about his journey to the South Pole. It is worth reading.|Путешественник написал книгу о своём путешествии на Южный полюс. Её стоит прочитать.
As children, they went swimming and skiing.|В детстве они занимались плаванием и лыжами (катанием на лыжах).
What are you going to do at the weekend? — My brother and I are going to cycle in the park. Will you join us?|Что ты собираешься делать в выходные? — Мы с братом собираемся покататься на велосипедах в парке. Присоединишься к нам?
The Adventure Club invites you to take part in an exciting boat trip along the river.|Клуб «Приключение» приглашает вас принять участие в захватывающем путешествии на лодках по реке.
`);
 add(4,4,177,'ДЗ 10','Перевод: степени сравнения',`
the deepest sea|самое глубокое море
the longest river|самая длинная река
the highest mountain|самая высокая гора
the largest lake|самое большое озеро
the most interesting expedition|самая интересная экспедиция
Cousteau's team came to Lake Baikal in winter.|Команда Кусто приехала на озеро Байкал зимой.
`);
 // The two published Russian versions are preserved as separate reading aids.
 const owl='There was an Old Owl who lived in an oak.\nThe more he heard, the less he spoke.\nThe less he spoke, the more he heard.\nFollow the example of that wise old bird.';
 data.materials.push({id:'tb-owl',unit:1,section:2,page:14,exercise:'23',title:'Мудрая сова: два перевода из книги',kind:'poem',instruction:'Сравни два русских перевода, выбери лучший и предложи свой.',note:'Оба русских варианта взяты из предоставленного учебника. Это творческое задание: выбор нужно объяснить, единственный правильный ответ не назначается.',lines:[{speaker:'Вариант 1',en:owl,ru:'На дубе сова обитала.\nМного слышала, но больше молчала.\nЧем больше молчала, тем больше знала.\nВот и нам такими бы быть не мешало.'},{speaker:'Вариант 2',en:owl,ru:'Жила на дубе старая сова.\nМолчать любила, голос берегла.\nЧем больше слушала, тем больше знала,\nЗа то в лесу мудрейшей прослыла.'}]});
 add(1,4,43,'ДЗ 10A','Тейлоры: родственные связи',`
The Taylors are Melissa's and Ilya's hosts. They've got a [son] and two daughters.|Тейлоры — принимающая семья Мелиссы и Ильи. У них сын и две дочери.
Their [elder] daughter is married. She has got a little daughter.|Их старшая дочь замужем. У неё есть маленькая дочь.
Roy is 11. But he is already an [uncle]. The daughter of his eldest sister is his [niece].|Рою одиннадцать. Но он уже дядя. Дочь его старшей сестры — его племянница.
Mrs Taylor and Mr Taylor are the [grandparents] of this little girl.|Миссис и мистер Тейлор — бабушка и дедушка этой маленькой девочки.
`,'Пропуски заполнены словами из рамки задания 10A и выделены скобками. В 10B у первого ответа в скане опечатка: детей трое — сын и ДВЕ дочери.');
 data.activities.push({id:'host-homework-9',unit:1,section:4,page:43,exercise:'ДЗ 9–10',title:'Домашняя работа: описание и семья Тейлоров',instruction:'Опиши родственника, друга или соседа по плану задания 9. Затем выполни 10A и составь четыре вопроса в 10B.',help:'План: кто это → внешность → волосы и глаза → характер → увлечения. 10B: How many children have the Taylors got? How old is Roy? Is Roy an uncle? Have Mr and Mrs Taylor got a granddaughter?'});
})();
