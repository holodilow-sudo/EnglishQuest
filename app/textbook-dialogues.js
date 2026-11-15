/* Printed dialogues from the supplied textbook. Bracketed completions are learning examples. */
(() => {
  'use strict';
  const out=window.TextbookStudy.materials;
  const model='Слова и вопросы в квадратных скобках — учебный вариант заполнения пропусков. Это не расшифровка отсутствующей аудиозаписи. Сверь исходное задание по кнопке «Сверить с учебником».';
  function add(unit,section,page,exercise,title,rows,note=model){out.push({id:`tb-dialogue-${unit}-${exercise}`,unit,section,page,exercise,title,kind:'dialogue',instruction:'Прочитай по ролям. Попробуй понять реплику сам, затем открой перевод. Для пересказа выбери свою роль.',note,lines:rows.trim().split('\n').map(row=>{const [speaker,en,ru]=row.split('|');return {speaker,en,ru}})})}
  add(1,1,6,'2A','Знакомство в клубе',`
Kevin|Hello! Glad to see you! [Welcome] to our Explorers’ Club! I’m Kevin. This is Wendy. What’s your name?|Привет! Рад тебя видеть! Добро пожаловать в наш Клуб исследователей! Я Кевин. Это Венди. Как тебя зовут?
Ilya|Hello, Wendy! Hello, Kevin! I’m Ilya Ivanov.|Привет, Венди! Привет, Кевин! Я Илья Иванов.
Kevin|[Let me see]. Ilya Ivanov, Ilya Ivanov. Are you from Russia or from Bulgaria?|Дай посмотреть. Илья Иванов, Илья Иванов. Ты из России или из Болгарии?
Ilya|I’m from Russia.|Я из России.
Kevin|Here is your badge. Just wait for a minute in the hall, please. The meeting will start very soon.|Вот твой бейдж. Пожалуйста, подожди минутку в холле. Встреча начнётся совсем скоро.
Ilya|[Thank you]!|Спасибо!`);
  add(1,2,16,'28','Нора и руководитель клуба',`
Mr Green|Hello. What’s your name?|Здравствуй. Как тебя зовут?
Nora|My name’s Nora.|Меня зовут Нора.
Mr Green|[Pleased to meet you], Nora. I’m Mr Green, the head of the Club.|Рад познакомиться, Нора. Я мистер Грин, руководитель клуба.
Nora|Nice to meet you too, Mr Green.|Мне тоже приятно познакомиться, мистер Грин.
Mr Green|And where are you from?|А откуда ты?
Nora|I’m from Canada. Have you been to Canada?|Я из Канады. Вы бывали в Канаде?
Mr Green|[Not yet]. But I’d like to visit your country one day. When did you come to London?|Пока нет. Но я хотел бы когда-нибудь посетить вашу страну. Когда ты приехала в Лондон?
Nora|[Two days ago].|Два дня назад.
Mr Green|You went sightseeing, didn’t you?|Ты осматривала достопримечательности, правда?
Nora|[Yes, that’s right]. I visited the Tower of London and walked in Hyde Park.|Да, верно. Я посетила Лондонский Тауэр и погуляла в Гайд-парке.
Mr Green|[That sounds wonderful]. Did you enjoy your London trip, Nora?|Звучит замечательно. Тебе понравилась поездка в Лондон, Нора?
Nora|Yes, I took a lot of photos.|Да, я сделала много фотографий.
Mr Green|Very good. In a few minutes we are going to have a football match. Could you take some photos, please?|Очень хорошо. Через несколько минут у нас будет футбольный матч. Ты могла бы сделать несколько фотографий?
Nora|[With great pleasure].|С большим удовольствием.
Mr Green|Very good. Let’s hurry up and take our seats.|Отлично. Давай поторопимся и займём места.`);
  add(1,5,33,'87A','В кафе',`
A|Good evening!|Добрый вечер!
B|Good evening! Can I have a [cup of] coffee, please?|Добрый вечер! Можно мне чашку кофе, пожалуйста?
A|Any sugar?|Сахар нужен?
B|No, thank you.|Нет, спасибо.
A|[Anything] else?|Что-нибудь ещё?
B|No, thanks.|Нет, спасибо.
A|One pound, [please].|Один фунт, пожалуйста.
B|Thanks.|Спасибо.
A|Thank you.|Спасибо вам.`);
  add(1,5,33,'87B','В библиотеке',`
A|Hello! Can I [help] you?|Здравствуйте! Могу я вам помочь?
B|Hello! Can I have ‘Harry Potter’ by Joanne Rowling, [please]?|Здравствуйте! Можно мне «Гарри Поттера» Джоан Роулинг, пожалуйста?
A|Just [a minute]. Here you are.|Одну минуту. Вот, пожалуйста.
B|Oh, the book is quite thick and there aren’t any pictures in it!|О, книга довольно толстая, и в ней совсем нет картинок!
A|But the book is very interesting. It’s really [worth] reading.|Но книга очень интересная. Её действительно стоит прочитать.
B|I know. [Thank] you.|Я знаю. Спасибо.
A|You should bring the book back in 10 days. [Enjoy] reading it!|Нужно вернуть книгу через десять дней. Приятного чтения!
B|OK. Thanks.|Хорошо. Спасибо.`);
  add(1,5,33,'87C','В аптеке: учебный диалог',`
A|Good morning. Can I help you?|Доброе утро. Могу я вам помочь?
B|Good morning. Have you got anything for a sore throat?|Доброе утро. У вас есть что-нибудь от боли в горле?
A|Have you got a [cough]?|У вас есть кашель?
B|No, I haven’t, only a sore throat.|Нет, только болит горло.
A|I see. Anything else?|Понятно. Что-нибудь ещё?
B|No, thanks.|Нет, спасибо.`);
  add(1,5,33,'87D','Обмен валюты',`
A|Hello. Can I help you?|Здравствуйте. Могу я вам помочь?
B|Hello. Can I [change] euros into British pounds?|Здравствуйте. Можно обменять евро на британские фунты?
A|Sure. [How much] would you like to change?|Конечно. Сколько вы хотели бы обменять?
B|50 euros.|Пятьдесят евро.
A|Here you are.|Вот, пожалуйста.
B|Thanks. [Goodbye].|Спасибо. До свидания.
A|Bye.|До свидания.`);
  add(1,5,34,'92','Дом Роберта в Честере',`
Asha|Robert, do you live in the south or in the north of England?|Роберт, ты живёшь на юге или на севере Англии?
Robert|In the northwest, in the [city of] Chester.|На северо-западе, в городе Честер.
Asha|Chester? A city which is [famous for] its medieval city walls and Eastgate clock?|Честер? Город, знаменитый своими средневековыми стенами и часами Истгейт?
Robert|Yes, our clock is the second most famous English clock after Big Ben. It is really unique.|Да, наши часы — вторые по известности в Англии после Биг-Бена. Они действительно уникальны.
Asha|Do you live in the centre of Chester?|Ты живёшь в центре Честера?
Robert|No, but I live [not far from] the centre. The centre is always full of tourists. There are many restaurants and shops there. It takes me 15 minutes to get to the centre.|Нет, но я живу недалеко от центра. В центре всегда много туристов. Там много ресторанов и магазинов. Я добираюсь до центра за пятнадцать минут.
Asha|I see. Do you live in [a block of flats]?|Понятно. Ты живёшь в многоквартирном доме?
Robert|No, we live in a semi-detached house. There are three bedrooms and a sitting room and a large [kitchen] in the house.|Нет, мы живём в доме на две семьи. В доме три спальни, гостиная и большая кухня.
Asha|Do you have a garden?|У вас есть сад?
Robert|We have a garden behind the house and a very small garden with patio and flower pots in front of it. My mother spends [a lot of time] in the garden. So we have nice flowers and a green lawn around the house.|За домом у нас сад, а перед ним — совсем маленький садик с внутренним двориком и цветочными горшками. Мама проводит в саду много времени. Поэтому вокруг дома красивые цветы и зелёная лужайка.
Asha|Sounds lovely.|Звучит чудесно.
Robert|Look, why don’t you come and stay with us sometime in summer. We’ll have a nice tour [around the city]. And we can also visit Chester Zoo which is the largest in Britain.|Слушай, почему бы тебе не приехать к нам погостить летом? Мы устроим хорошую экскурсию по городу. А ещё можем посетить Честерский зоопарк, который в тексте назван крупнейшим в Британии.
Asha|Well, that would be great. It is very kind of you to invite me, Robert. I’ll think over your invitation.|Было бы здорово. Очень мило с твоей стороны пригласить меня, Роберт. Я обдумаю твоё приглашение.`,model+' Продолжение на стр. 35. Оценки достопримечательностей переданы как в тексте книги, а не как современный рейтинг.');
  add(2,1,54,'18A','Пора ужинать',`
Monica|Mum, are we going to [have] dinner? I’m very hungry. It was a busy day at school and I [didn’t have] lunch.|Мама, мы будем ужинать? Я очень голодна. В школе был насыщенный день, и я не обедала.
Mum|Right now! As soon as you wash your hands and set the table.|Прямо сейчас! Как только ты вымоешь руки и накроешь на стол.`);
  add(2,1,54,'18B','Роб неважно себя чувствует',`
Mum|Why are you still in bed, Rob? You [had to] get up half an hour ago. You’ll be late for school.|Почему ты ещё в постели, Роб? Ты должен был встать полчаса назад. Опоздаешь в школу.
Rob|Oh, Mum, I don’t feel well. I [have] a sore throat and a terrible headache.|Мама, я плохо себя чувствую. У меня болит горло и очень сильно болит голова.
Mum|Oh, dear! You [have to] stay in bed. I’ll send for the doctor.|Бедняжка! Тебе придётся остаться в постели. Я вызову врача.`);
  add(2,1,54,'18C','Подарок для Сьюзен',`
Alice|Tomorrow is Susan’s birthday. But I [haven’t bought a present for her yet].|Завтра день рождения Сьюзен. Но я ещё не купила ей подарок.
Ben|Well, what about a big box of chocolates. Susan [has] a sweet tooth. I’m sure, she’ll be really happy to get that as a present.|А как насчёт большой коробки шоколадных конфет? Сьюзен сладкоежка. Уверен, она будет очень рада такому подарку.`,model+' В отсканированном задании есть неоднозначное место перед buy. Здесь приведена естественная фраза о ещё не купленном подарке; она не выдаётся за единственный ключ к аудио.');
  add(2,1,54,'18D','Можно в кино?',`
Diana|Granny, I [don’t have] any homework for Thursday. Can I go to the cinema with my friends?|Бабушка, на четверг у меня нет домашнего задания. Можно пойти в кино с друзьями?
Granny|OK. [Have] a good time. But you [have to] come back at 8.|Хорошо. Приятно провести время. Но ты должна вернуться в восемь.
Diana|All right.|Хорошо.`);
  add(2,1,54,'18E','Правила в школе',`
David|[Do] you [have] any special rules at school?|У вас в школе есть особые правила?
Clara|Nothing special. We [have to] respect others, wear a school uniform, do our homework and not be late for school.|Ничего особенного. Мы должны уважать других, носить форму, делать домашнее задание и не опаздывать в школу.`);
  add(2,3,63,'45','Школьный день Лизы',`
Ilya|[What time does your school day begin?]|Во сколько начинается твой учебный день?
Liza|At 8.50 when the registration begins. The teacher marks down whether the student is at school or not in a special book. The teacher tells us about our school day and any special events that will take place that day or that week. Then we have the first lesson, which lasts an hour.|В 8:50, когда начинается перекличка. Учитель отмечает в специальном журнале, присутствует ли ученик в школе. Нам рассказывают о предстоящем дне и особых событиях этого дня или недели. Затем начинается первый урок, который длится час.
Melissa|[Do you have all your lessons in the same classroom?]|Все уроки проходят в одном кабинете?
Liza|No, I have lessons in different rooms and places around the school.|Нет, уроки проходят в разных кабинетах и помещениях школы.
Melissa|[Does one teacher teach you all the subjects?]|Один учитель ведёт у вас все предметы?
Liza|No, different teachers teach us different subjects.|Нет, разные учителя ведут разные предметы.
Ilya|[How many lessons do you have every day?]|Сколько уроков у вас каждый день?
Liza|Five or six. We finish at 3.20 pm.|Пять или шесть. Занятия заканчиваются в 15:20.
Ilya|[How do you address your teachers?]|Как вы обращаетесь к учителям?
Liza|Parents and pupils in primary schools (5–11 years) always address teachers by their surname, for example Mr, Mrs or Miss Clarke. But in secondary schools (11–16 years), we usually address the teachers as Miss or Sir.|В начальной школе (5–11 лет) родители и ученики обращаются к учителям по фамилии, например мистер, миссис или мисс Кларк. А в средней школе (11–16 лет) мы обычно обращаемся к учителям «мисс» или «сэр».
Melissa|[Do you have lunch at school?]|Ты обедаешь в школе?
Liza|Yes, sure. My mother gives me a packed lunch to take to school. And I have my lunch after the fourth period at 1.30 pm, when we have a 40-minute lunch break. Sometimes I buy lunch from the canteen.|Да, конечно. Мама даёт мне с собой упакованный обед. Я обедаю после четвёртого урока в 13:30, когда у нас сорокаминутный перерыв. Иногда покупаю обед в столовой.
Ilya|[Do you go to any after-school clubs?]|Ты ходишь в какие-нибудь кружки после уроков?
Liza|Three times a week I have after-school clubs. There are lots of different clubs which you can go to at lunchtime or after school: dance, tennis, cooking, music and chess. I joined the Photography Club last year. I am also a member of the Drama Club which performs a play at the end of each year.|Три раза в неделю у меня кружки после школы. Во время обеденного перерыва или после уроков можно заниматься танцами, теннисом, кулинарией, музыкой и шахматами. В прошлом году я записалась в фотокружок. Ещё я занимаюсь в театральном кружке: в конце каждого года мы ставим спектакль.
Melissa|[What play did you perform last year?]|Какой спектакль вы поставили в прошлом году?
Liza|We performed ‘Treasure Island’ based on the Robert Louis Stevenson novel. Believe it or not, I played the part of Ben Gunn. We also composed a couple of songs for it with the help of our drama teacher. It was a great success.|Мы поставили «Остров сокровищ» по роману Роберта Льюиса Стивенсона. Хочешь верь, хочешь нет, я играла Бена Ганна. С помощью преподавателя мы также сочинили для спектакля пару песен. Он имел большой успех.
Ilya|[What sports facilities does your school have?]|Какие спортивные площадки и помещения есть в школе?
Liza|The school has very good sports facilities: tennis courts, a big gym and a large sports field where students play football. Roy spends almost every afternoon there.|В школе отличные условия для спорта: теннисные корты, большой спортзал и большое поле, где ученики играют в футбол. Рой проводит там почти каждый день после уроков.
Ilya|[What school events do you have?]|Какие школьные мероприятия у вас бывают?
Liza|We have different school events: school trips, music concerts, Maths week, Science week, festivals, etc. I like to travel, so school trips are my favourite school events. During the holidays, we go camping in Scotland. It’s really a great adventure! As for Roy, he prefers Sports Day where we take part in lots of different sports competitions.|У нас бывают поездки, концерты, недели математики и естественных наук, праздники и другие мероприятия. Я люблю путешествовать, поэтому больше всего люблю школьные поездки. На каникулах мы ходим в походы в Шотландии. Это настоящее приключение! А Рой предпочитает День спорта, когда мы участвуем в разных соревнованиях.`,model+' Продолжение на стр. 64. Описание конкретной школы из учебного диалога, а не единые правила всех британских школ.');
  add(2,3,65,'48A','Можно войти?',`
A|Sorry, [may] I come in?|Извините, можно войти?
B|Come in and sit down. Don’t waste time, please. Open your Student’s Book on page 40.|Входи и садись. Пожалуйста, не теряй времени. Открой учебник на странице сорок.`);
  add(2,3,65,'48B','Одолжи линейку',`
A|I’ve left my ruler at home. [Can] I borrow your ruler?|Я оставил линейку дома. Можно одолжить твою?
B|Yes, of course. Here you are.|Да, конечно. Вот, пожалуйста.`);
  add(2,3,65,'48C','Выбираем подарок',`
A|[Can] I help you?|Могу я вам помочь?
B|Yes, please. I need a present for my grandma. [Could] you recommend me anything?|Да, пожалуйста. Мне нужен подарок для бабушки. Вы могли бы что-нибудь посоветовать?`);
  add(2,3,65,'48D','Во сколько вернуться?',`
A|Mum, [can] I go to the cinema with Jack?|Мама, можно пойти в кино с Джеком?
B|Yes, of course. Remember that you have to be back at 7.30 pm.|Да, конечно. Помни, что нужно вернуться к половине восьмого вечера.`);
  add(2,3,65,'48E','Можно ещё торта?',`
A|Granny, [may] I have a little more cake, please?|Бабушка, можно мне ещё немного торта, пожалуйста?
B|Yes, of course. Help yourself.|Да, конечно. Угощайся.`);
  add(2,4,70,'65','Готовим йоркширский пудинг',`
Mrs Taylor|Liza, I’m going to make a Yorkshire pudding. Will you help me?|Лиза, я собираюсь приготовить йоркширский пудинг. Поможешь мне?
Liza|Of course, Mum! What do we need for it?|Конечно, мама! Что нам для него нужно?
Mrs Taylor|Just some flour, oil, eggs and milk.|Только немного муки, масла, яйца и молоко.
Liza|How [much] flour do we need?|Сколько муки нам нужно?
Mrs Taylor|A cup of flour. Get some eggs and milk from the fridge.|Чашка муки. Достань из холодильника яйца и молоко.
Liza|Oh! How [many] eggs shall I get out? There’s [a little] milk and [a few] eggs in the fridge.|О! Сколько яиц достать? В холодильнике немного молока и несколько яиц.
Mrs Taylor|We need three eggs and a cup of milk for the pudding.|Для пудинга нам нужны три яйца и чашка молока.
Liza|Here you are. Anything else? Sugar? Salt?|Вот, пожалуйста. Что-нибудь ещё? Сахар? Соль?
Mrs Taylor|Some salt, please. There isn’t any sugar in the Yorkshire pudding.|Немного соли, пожалуйста. В йоркширский пудинг сахар не добавляют.
Liza|How [much] salt shall I get?|Сколько соли взять?
Mrs Taylor|Just [a little]. Hm. The batter is ready. Now let’s cook it.|Совсем немного. Так, тесто готово. Теперь давай его приготовим.`,model+' Продолжение на стр. 71. Much — с неисчисляемыми flour, milk, salt; many — с исчисляемыми eggs.');
  add(2,4,74,'73','Список покупок',`
Mrs Taylor|Liza, let’s make a shopping list for dad and Roy. Have we got any yoghurt?|Лиза, давай составим список покупок для папы и Роя. У нас есть йогурт?
Liza|No, there isn’t [any] yoghurt in the fridge. But there is [some] milk and a little cheese.|Нет, в холодильнике нет йогурта. Но есть немного молока и сыра.
Mrs Taylor|OK. Have we got [any] bread?|Хорошо. Хлеб есть?
Liza|Yes. But we haven’t got [any] sugar and there is only a little butter and strawberry jam.|Да. Но у нас нет сахара и осталось совсем немного масла и клубничного варенья.
Mrs Taylor|What about pasta? How [much] have we got?|А макароны? Сколько у нас осталось?
Liza|There is [some]. But I think we have to buy [some] pasta. All of us love pasta. There isn’t enough.|Немного есть. Но, думаю, нужно купить ещё макарон. Мы все их любим. Их недостаточно.
Mrs Taylor|How [many] eggs are there in the fridge?|Сколько яиц в холодильнике?
Liza|Only two eggs. We need more. Mum, can I have [some] orange juice?|Только два. Нам нужно больше. Мама, можно мне апельсинового сока?
Mrs Taylor|Of course.|Конечно.`);
  add(2,4,74,'74','Вежливо за столом',`
A|Could you pass me the bread, please?|Не могли бы вы передать мне хлеб?
B|Yes, of course. Here you are.|Да, конечно. Вот, пожалуйста.
A|Would you like some apple juice?|Хотите яблочного сока?
B|Yes, please. I’d love some.|Да, пожалуйста. С удовольствием.
A|Can I help you?|Могу я вам помочь?
B|Yes, I’d like some ice cream with nuts, please.|Да, я хотел бы мороженое с орехами, пожалуйста.
A|Could I have some more apricot jam?|Можно ещё немного абрикосового варенья?
B|Yes, of course. Here you are.|Да, конечно. Вот, пожалуйста.
A|This cake is delicious. Can you give me the recipe, please?|Этот торт очень вкусный. Вы можете дать мне рецепт?
B|Certainly. I’m glad you like it.|Конечно. Рада, что он вам понравился.
A|Would you like some tea or coffee?|Вы хотите чай или кофе?
B|Coffee with milk, please.|Кофе с молоком, пожалуйста.`,'Пары вопросов и ответов из задания соединены для тренировки. Один подходящий ответ используется дважды.');
  add(3,1,85,'4','Приглашение в интернет-проект',`
Mike|Hi, Rachel!|Привет, Рейчел!
Rachel|Hello, Mike! I’m just calling to ask what you are doing this weekend.|Привет, Майк! Звоню спросить, что ты делаешь в эти выходные.
Mike|Nothing special, I’m afraid. I may go to the cinema or go roller skating with my friends. Why?|Боюсь, ничего особенного. Возможно, пойду в кино или покатаюсь на роликах с друзьями. А что?
Rachel|Because I want to suggest something interesting. Would you like to take part in an Internet project?|Хочу предложить кое-что интересное. Ты хотел бы участвовать в интернет-проекте?
Mike|An Internet project?… Sounds interesting. What’s the project?|Интернет-проект? Звучит интересно. Что за проект?
Rachel|A website for our Explorers’ Club. Would you like to become a member of the team?|Сайт для нашего Клуба исследователей. Хочешь стать участником команды?
Mike|Yes, I would like to join your team. It seems to me that lots of our classmates would like to take part in this project.|Да, я хотел бы присоединиться. Мне кажется, многие одноклассники тоже захотят участвовать.
Rachel|I believe they would. I’ve already phoned some of them. We are having a meeting tomorrow. Will you come?|Думаю, да. Я уже позвонила некоторым из них. Завтра мы собираемся. Ты придёшь?
Mike|Yes.|Да.
Rachel|OK. See you tomorrow, then.|Хорошо. Тогда до завтра.
Mike|Bye!|Пока!`,'Реплики из упражнения расположены в связном порядке для чтения и разыгрывания.');
  add(3,2,90,'28','Что разместить на сайте?',`
Rachel|Hey, guys! We’ve come here to discuss the Internet project. We’ve got to do it! It says here we should find out the most interesting [facts] about our country and post them on the site. Have you got any [ideas]?|Привет, ребята! Мы собрались обсудить интернет-проект. Нам нужно его сделать! Здесь сказано найти самые интересные факты о нашей стране и разместить их на сайте. Есть идеи?
Sue|Well, we can [post] information about famous people who were born in Great Britain. There are a lot of interesting facts about them, after all.|Мы можем разместить информацию об известных людях, родившихся в Великобритании. О них ведь есть много интересных фактов.
Rachel|Right you are. And there are some unusual [festivals] — Pancake Day or Bonfire Night, for example. As the project is [international], people from other countries might be interested in them.|Верно. А ещё есть необычные праздники, например Блинный день или Ночь костров. Проект международный, и людям из других стран это может быть интересно.
Mike|And what about sport? The British are famous for loving sport. Just think of football, [cricket], boxing, running, even swimming. And let’s not forget about the popular tennis competitions in Wimbledon!|А как насчёт спорта? Британцы известны своей любовью к спорту. Вспомните футбол, крикет, бокс, бег и даже плавание. И не забудем популярные теннисные соревнования в Уимблдоне!
Nick|I [think] we should also say something about the history and traditions of the United Kingdom. Some geographical facts will be interesting, too.|Думаю, стоит рассказать об истории и традициях Соединённого Королевства. Некоторые географические факты тоже будут интересны.
Rachel|OK. I agree with all your suggestions. We have some time to do research on all the topics. And we’ll meet tomorrow to [discuss] the details.|Хорошо. Согласна со всеми предложениями. У нас есть время изучить все темы. Завтра встретимся и обсудим подробности.`);
  add(3,3,103,'70','Планируем поездку в Англию',`
Harry|Hello. What can I do for you?|Здравствуйте. Чем могу помочь?
Tourist|Hello! I would like to spend my spring holidays in England next month. What can you suggest?|Здравствуйте! Я хотел бы провести весенние каникулы в Англии в следующем месяце. Что вы можете предложить?
Harry|You should visit the capital first of all.|Прежде всего стоит посетить столицу.
Tourist|[Why should I visit London?]|Почему стоит посетить Лондон?
Harry|Because it’s one of the most beautiful cities in the world, with long and interesting history. It is rich in historical buildings, numerous monuments, famous theatres and green parks.|Потому что это один из красивейших городов мира с долгой и интересной историей. В нём много исторических зданий, памятников, знаменитых театров и зелёных парков.
Tourist|[Is there a river in London?]|В Лондоне есть река?
Harry|There is the River Thames. You can enjoy wonderful views when travelling by boat.|Там протекает Темза. Во время прогулки на лодке можно любоваться прекрасными видами.
Tourist|[What other cities can I visit?]|Какие ещё города можно посетить?
Harry|You can also visit other cities like Oxford, Cambridge or Chester.|Можно посетить другие города, например Оксфорд, Кембридж или Честер.
Tourist|[When is the National Day of England?]|Когда отмечается национальный день Англии?
Harry|The National Day of England is 23rd April.|Национальный день Англии — двадцать третьего апреля.
Tourist|Oh, can you imagine, that’s my birthday!|Представляете, это мой день рождения!
Harry|That’s great! Well, I hope you’ll enjoy your trip very much.|Здорово! Надеюсь, поездка вам очень понравится.`);
  add(3,5,113,'99','С гидом по Шотландии',`
Guide|Hello! I’m your guide. I’ll show you around Scotland this week. Have you got any questions?|Здравствуйте! Я ваш гид. На этой неделе я покажу вам Шотландию. Есть вопросы?
Nick|Hello!|Здравствуйте!
Melissa|Hello! And what will we visit first?|Здравствуйте! А что мы посетим сначала?
Guide|We are going to Edinburgh first. It is the cultural centre and the capital of Scotland. On Sunday, we’ll take part in the Festival of Music and Drama.|Сначала отправимся в Эдинбург — столицу и культурный центр Шотландии. В воскресенье примем участие в фестивале музыки и театра.
Nick|A festival? That sounds amazing! I can’t wait [to hear] the bagpipes. Will the Grand Parade take place tomorrow?|Фестиваль? Звучит потрясающе! Не могу дождаться, когда услышу волынки. Большой парад будет завтра?
Guide|Yes, it will be tomorrow. Every year the Grand Parade takes place with over 3,500 musicians, singers, bands and dancers from all over the world. All of them will be in their national costume.|Да, завтра. В тексте говорится, что ежегодно в Большом параде участвуют более 3500 музыкантов, певцов, музыкальных коллективов и танцоров со всего мира. Все будут в национальных костюмах.
Melissa|Fantastic! Where can we watch the Parade?|Здорово! Где можно посмотреть парад?
Guide|They will parade through the city streets. It won’t be far from your hotel.|Участники пройдут по улицам города. Это будет недалеко от вашего отеля.
Nick|Great! We’ll manage to see the Grand Parade, then.|Отлично! Значит, мы успеем увидеть Большой парад.`,'Реплики упорядочены. В строке Nick исправлена форма из скана: can’t wait to hear. Числа и описание фестиваля передают учебный текст, а не актуальную программу мероприятий.');
  add(3,6,117,'117A','Угадай спортсмена',`
Rachel|Mike, do you have a favourite person?|Майк, есть человек, которым ты восхищаешься?
Mike|Yes, he is a famous driver.|Да, это известный гонщик.
Rachel|Why do you like him?|Почему он тебе нравится?
Mike|He is a talented sportsman. At school he played football, went karting and studied karate.|Он талантливый спортсмен. В школе играл в футбол, занимался картингом и карате.
Rachel|What is he famous for?|Чем он знаменит?
Mike|He is the youngest ever Formula One World champion. He is a racing driver for McLaren.|В реплике учебника он назван самым молодым чемпионом мира Формулы-1 и гонщиком команды McLaren.
Rachel|Oh, maybe it is Lewis Hamilton?|Может быть, это Льюис Хэмилтон?
Mike|Yes, it’s him!|Да, это он!`,'Сохранён текст учебного диалога. Сведения о рекорде и команде устарели; не используй их как текущие факты и ответы на современную спортивную викторину.');
  add(3,6,117,'117B','Угадай актрису',`
Mike|Sue, do you have a favourite person?|Сью, есть человек, которым ты восхищаешься?
Sue|Yes, she is a well-known actress.|Да, это известная актриса.
Mike|Who is she?|Кто она?
Sue|Try to guess. She has taken part in lots of international film festivals.|Попробуй угадать. Она участвовала во многих международных кинофестивалях.
Mike|Has she got any awards?|У неё есть награды?
Sue|Yes, she has received lots of them.|Да, она получила много наград.
Mike|Has she starred in any popular films?|Она снималась в популярных фильмах?
Sue|Yes, she had the leading role in Titanic.|Да, она играла главную роль в «Титанике».
Mike|Oh, I think it is Kate Winslet, isn’t it?|Думаю, это Кейт Уинслет, верно?
Sue|You are right!|Ты прав!`,'Печатный диалог из задания 117B.');
  add(3,6,117,'117C','Угадай космонавта',`
Nick|Do you have a favourite person, Rachel?|Есть человек, которым ты восхищаешься, Рейчел?
Rachel|Yes, I do.|Да.
Nick|Is it a man or a woman?|Это мужчина или женщина?
Rachel|She is a strong woman.|Это сильная женщина.
Nick|What is she famous for?|Чем она известна?
Rachel|She was the first British astronaut.|Она была первым британским космонавтом.
Nick|Oh, she must be really brave!|Она, должно быть, очень смелая!
Rachel|Yes, to become an astronaut she beat 13,000 other candidates.|Да, чтобы стать космонавтом, она обошла 13 тысяч других кандидатов.
Nick|Does she have any awards?|У неё есть награды?
Rachel|Yes, she has the Order of the British Empire and a British school is named after her.|Да, у неё есть орден Британской империи, а одна британская школа названа в её честь.
Nick|OK, I see. It is Helen Sharman.|Понятно. Это Хелен Шарман.
Rachel|Yes, you are right.|Да, ты прав.`,'Печатный диалог из задания 117C; сведения переданы в контексте книги.');
  add(4,1,144,'10','Бобби собирается в поход',`
Sue|Hi, Bobby! [Nice] to meet you! You look so [happy]. Why?|Привет, Бобби! Рада тебя видеть! Ты выглядишь таким счастливым. Почему?
Bobby|Hi, Sue! I’m really happy. Today I am going on a hiking [trip] for the first time.|Привет, Сью! Я действительно счастлив. Сегодня я впервые иду в пеший поход.
Sue|Are you? Is it a day trip?|Правда? Это однодневный поход?
Bobby|No, it’s a weekend break. We are taking [sleeping] bags and [tents] with us. Imagine, we are going to spend a [night] in the forest!|Нет, поход на выходные. Мы берём спальные мешки и палатки. Представь, мы проведём ночь в лесу!
Sue|That sounds [exciting]! Have a good [time]!|Звучит захватывающе! Хорошо провести время!`);
  add(4,4,168,'79','Поход в океанариум',`
Mike|Hi, Sandra! Why didn’t you come with us to the new aquarium?|Привет, Сандра! Почему ты не пошла с нами в новый океанариум?
Sandra|I was preparing for the Maths test. Was it an interesting trip?|Я готовилась к контрольной по математике. Поездка была интересной?
Mike|Yes, it was an [unforgettable] experience!|Да, это было незабываемое впечатление!
Sandra|Pleased to hear it! What did you see there?|Рада слышать! Что вы там видели?
Mike|We saw a lot of sea creatures: octopuses, sea turtles, seahorses, sharks and lots of colourful fishes.|Мы видели много морских обитателей: осьминогов, морских черепах, морских коньков, акул и множество разноцветных рыб.
Sandra|I wish I had been there.|Как жаль, что меня там не было.
Mike|We can go there next weekend. Would you like to? Bring your little sister with you. I know they have parties which are a lot of [fun] for kids.|Можем пойти туда в следующие выходные. Хочешь? Возьми с собой младшую сестру. Я знаю, там проводят праздники, на которых детям очень весело.
Sandra|That’s a good [idea]!|Хорошая идея!`);
})();
