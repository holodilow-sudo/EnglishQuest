/* Original learning adventures for English City Quest. Textbook themes, original scenes. */
(function () {
  'use strict';
  const question=(en,ru,prompt,options,answer,why)=>({en,ru,prompt,options,answer,why});
  window.CityStory=[
    {
      id:1,slug:'sunset',name:'Sunset Beach',ru:'Знакомство на побережье',contact:'Leo',role:'Координатор команды',initial:'L',color:'#ff9b82',
      intro:'Ты только приехал в город. Лео приглашает тебя в клуб исследователей. Познакомься с командой и найди место первой встречи.',
      unit:'Meeting New Friends',location:'Клуб у пляжа',trophy:'Компас исследователя',symbol:'✧',
      phone:[
        question('Hi! I am Leo. What is your name?','Привет! Я Лео. Как тебя зовут?','Представься Лео.',['My name is Alex.','I am at the museum.','It is a sunny day.'],0,'На вопрос «What is your name?» отвечаем «My name is…».'),
        question('Welcome to our club! Where are you from?','Добро пожаловать в наш клуб! Откуда ты?','Скажи, что ты из России.',['I am thirteen.','I am from Russia.','I like this city.'],1,'«I am from…» означает «Я из…». Возраст отвечал бы на вопрос «How old are you?».'),
        question('Meet me at the club at three o\'clock.','Встретимся в клубе в три часа.','Где и когда ждёт Лео?',['В музее в три часа','В клубе в два часа','В клубе в три часа'],2,'At the club — в клубе. At three o’clock — в три часа.')
      ],
      drive:[
        question('Go straight ahead.','Езжай прямо.','Выбери направление навигатора.',['left','straight','right','stop'],1,'Go straight ahead — продолжай двигаться прямо.'),
        question('Turn right at the park.','Поверни направо у парка.','Выбери направление навигатора.',['left','straight','right','stop'],2,'Turn right — поверни направо. At the park — у парка.'),
        question('Turn left at the library.','Поверни налево у библиотеки.','Выбери направление навигатора.',['left','straight','right','stop'],0,'Turn left — поверни налево. Library — библиотека.'),
        question('Stop next to the club.','Остановись рядом с клубом.','Мы приехали. Что сделать?',['left','straight','right','stop'],3,'Stop — остановись. Next to — рядом с.')
      ],
      finale:[
        question('The club is opposite the park.','Клуб находится напротив парка.','Ты ищешь клуб. Где он?',['За парком','Напротив парка','Внутри парка'],1,'Opposite — напротив. Behind — за. In — внутри.'),
        question('Our new friend is friendly and helpful.','Наш новый друг дружелюбный и отзывчивый.','Какие слова описывают характер?',['new and our','friend and helpful','friendly and helpful'],2,'Friendly — дружелюбный, helpful — готовый помочь.'),
        question('Would you like to join our team?','Хочешь присоединиться к нашей команде?','Прими приглашение вежливо.',['Yes, I would love to!','I am from Russia.','It is opposite the park.'],0,'«I would love to» — вежливое «С удовольствием».'),
        question('Our adventure starts on Monday.','Наше приключение начинается в понедельник.','В какой день начинается приключение?',['В воскресенье','В понедельник','В пятницу'],1,'Monday — понедельник. Перед днями недели обычно ставим on.')
      ],
      secret:question('Find the place where people borrow books.','Найди место, где люди берут книги почитать.','Где спрятан компас команды?',['Библиотека','Кинотеатр','Стадион'],0,'People borrow books at a library. Borrow — брать на время.'),
      places:['Библиотека','Кинотеатр','Стадион']
    },
    {
      id:2,slug:'neon',name:'Neon Downtown',ru:'Выходные с командой',contact:'Maya',role:'Организатор городских встреч',initial:'M',color:'#d78cff',
      intro:'Майя готовит выходной для команды: музей, кафе и городской парк. Помоги выбрать занятия и договориться о встрече.',
      unit:'Let’s Spend Time Together',location:'Городской музей',trophy:'Неоновый билет',symbol:'◈',
      phone:[
        question('What do you usually do at weekends?','Что ты обычно делаешь по выходным?','Ответь о своём занятии.',['I usually ride my bike.','It is five o\'clock.','My name is Alex.'],0,'Usually — обычно. После I в Present Simple: ride, play, visit.'),
        question('Let\'s go to the museum on Saturday.','Давай пойдём в музей в субботу.','Согласись с предложением.',['I have got a dog.','That is a great idea!','It is a red bike.'],1,'«That is a great idea!» — «Отличная идея!».'),
        question('The museum opens at ten. Please don\'t be late.','Музей открывается в десять. Пожалуйста, не опаздывай.','К какому времени приехать?',['К девяти','К одиннадцати','К десяти'],2,'At ten — в десять. Don’t be late — не опаздывай.')
      ],
      drive:[
        question('Turn left at the cinema.','Поверни налево у кинотеатра.','Слушай и выбери манёвр.',['left','straight','right','stop'],0,'Cinema — кинотеатр. Turn left — поверни налево.'),
        question('Go straight past the school.','Езжай прямо мимо школы.','Слушай и выбери манёвр.',['left','straight','right','stop'],1,'Past the school — мимо школы. Продолжай прямо.'),
        question('Turn right at the traffic lights.','Поверни направо у светофора.','Слушай и выбери манёвр.',['left','straight','right','stop'],2,'Traffic lights — светофор. Right — направо.'),
        question('Stop in front of the museum.','Остановись перед музеем.','Выбери последний манёвр.',['left','straight','right','stop'],3,'In front of — перед. Мы достигли музея.')
      ],
      finale:[
        question('The tickets cost five pounds each.','Каждый билет стоит пять фунтов.','Какова цена одного билета?',['Пять фунтов','Два фунта','Десять фунтов'],0,'Each — каждый. Five pounds each — по пять фунтов.'),
        question('Please keep quiet in the museum.','Пожалуйста, соблюдай тишину в музее.','Какое правило нужно соблюдать?',['Можно громко петь','Нужно говорить тихо','Нужно бегать'],1,'Keep quiet — вести себя тихо, соблюдать тишину.'),
        question('I would like a sandwich and some juice, please.','Я хотел бы сэндвич и немного сока, пожалуйста.','Что заказал Лео после экскурсии?',['Салат и воду','Суп и чай','Сэндвич и сок'],2,'I would like… — вежливая просьба «Я хотел бы…».'),
        question('Did you enjoy the exhibition?','Тебе понравилась выставка?','Ответь, что выставка была интересной.',['Yes, it was interesting.','I am thirteen.','Turn left at the cinema.'],0,'О прошедшем событии: «It was interesting» — «Это было интересно».')
      ],
      secret:question('Find the place where people watch films.','Найди место, где люди смотрят фильмы.','Где спрятан неоновый билет?',['Кафе','Кинотеатр','Библиотека'],1,'People watch films at a cinema. Watch — смотреть.'),
      places:['Кафе','Кинотеатр','Библиотека']
    },
    {
      id:3,slug:'harbour',name:'Royal Harbour',ru:'Британский маршрут',contact:'Alex',role:'Гид по британскому кварталу',initial:'A',color:'#65e8e8',
      intro:'Алекс проводит городской квест о Великобритании. Прочитай сообщения, найди достопримечательности и собери маршрут для друзей.',
      unit:'The Fact File of the UK',location:'Городская башня',trophy:'Ключ от башни',symbol:'♜',
      phone:[
        question('What is the capital of the United Kingdom?','Как называется столица Соединённого Королевства?','Помоги Алексу заполнить карточку.',['London','Oxford','Manchester'],0,'London is the capital of the United Kingdom — Лондон является столицей Соединённого Королевства.'),
        question('Would you like to visit the castle or the park?','Ты хотел бы посетить замок или парк?','Скажи, что хотел бы посетить замок.',['It is a beautiful park.','I would like to visit the castle.','The park is next to the school.'],1,'I would like to visit… — Я хотел бы посетить… Castle — замок.'),
        question('The tower is next to the river.','Башня находится рядом с рекой.','Где искать башню?',['Рядом со школой','За музеем','Рядом с рекой'],2,'Tower — башня. River — река. Next to — рядом с.')
      ],
      drive:[
        question('Go straight towards the bridge.','Езжай прямо в сторону моста.','Следуй маршруту Алекса.',['left','straight','right','stop'],1,'Towards — по направлению к. Bridge — мост.'),
        question('Turn left after the bridge.','Поверни налево после моста.','Следуй маршруту Алекса.',['left','straight','right','stop'],0,'After the bridge — после моста. Left — налево.'),
        question('Turn right at the castle.','Поверни направо у замка.','Следуй маршруту Алекса.',['left','straight','right','stop'],2,'Castle — замок. Turn right — поверни направо.'),
        question('Stop opposite the tower.','Остановись напротив башни.','Найди точку встречи.',['left','straight','right','stop'],3,'Opposite — напротив. Tower — башня.')
      ],
      finale:[
        question('The United Kingdom consists of four countries.','Соединённое Королевство состоит из четырёх стран.','Сколько стран входит в Соединённое Королевство?',['Две','Три','Четыре'],2,'Consists of — состоит из. Four — четыре.'),
        question('Scotland is famous for its beautiful lakes.','Шотландия известна своими красивыми озёрами.','Что означает «is famous for»?',['Боится','Известна благодаря','Находится рядом'],1,'Be famous for — быть известным чем-либо.'),
        question('Excuse me, how can I get to the station?','Извините, как мне добраться до станции?','Турист спрашивает дорогу. Что ответить?',['Go straight and turn left.','I like English.','You are welcome to our team.'],0,'Go straight and turn left — идите прямо и поверните налево.'),
        question('We visited the castle yesterday.','Мы посетили замок вчера.','Когда команда была в замке?',['Завтра','Вчера','Каждый день'],1,'Yesterday — вчера. Visited — прошедшее время от visit.')
      ],
      secret:question('Find the place where trains arrive and leave.','Найди место, куда прибывают и откуда отправляются поезда.','Где спрятан ключ от башни?',['Музей','Парк','Станция'],2,'Trains arrive and leave at a station. Arrive — прибывать, leave — отправляться.'),
      places:['Музей','Парк','Станция']
    },
    {
      id:4,slug:'wild',name:'Wild Coast',ru:'Экспедиция команды',contact:'Sam',role:'Проводник по побережью',initial:'S',color:'#a4f9a6',
      intro:'Последняя глава: команда собирается в поход. Подготовь вещи, пойми прогноз погоды и помоги друзьям добраться до лагеря.',
      unit:'An Adventure Holiday',location:'Лагерь у озера',trophy:'Знак экспедиции',symbol:'▲',
      phone:[
        question('We are going camping. What should we take?','Мы собираемся в поход. Что нам взять?','Выбери подходящее снаряжение.',['A tent and a sleeping bag.','A sofa and a television.','A ticket to the cinema.'],0,'Tent — палатка. Sleeping bag — спальный мешок.'),
        question('It may rain tomorrow. Take your raincoat.','Завтра возможен дождь. Возьми дождевик.','Что советует взять Сэм?',['Солнцезащитные очки','Дождевик','Билет'],1,'May rain — может пойти дождь. Raincoat — дождевик или плащ.'),
        question('Our journey starts at eight in the morning.','Наше путешествие начинается в восемь утра.','Когда выезжаем?',['В восемь вечера','В десять утра','В восемь утра'],2,'In the morning — утром. In the evening — вечером.')
      ],
      drive:[
        question('Turn right at the campsite sign.','Поверни направо у указателя лагеря.','Помоги команде доехать до лагеря.',['left','straight','right','stop'],2,'Campsite — место для палаточного лагеря. Sign — знак или указатель.'),
        question('Go straight through the forest.','Езжай прямо через лес.','Помоги команде доехать до лагеря.',['left','straight','right','stop'],1,'Through the forest — через лес. Go straight — двигайся прямо.'),
        question('Turn left before the lake.','Поверни налево перед озером.','Помоги команде доехать до лагеря.',['left','straight','right','stop'],0,'Before the lake — перед озером. Left — налево.'),
        question('Stop next to the campsite.','Остановись рядом с лагерем.','Мы приехали. Выбери действие.',['left','straight','right','stop'],3,'Next to the campsite — рядом с лагерем. Stop — остановись.')
      ],
      finale:[
        question('We must keep the campsite clean.','Мы должны поддерживать чистоту в лагере.','Как поступить после пикника?',['Оставить мусор','Собрать мусор с собой','Спрятать мусор в траве'],1,'Must — должен. Keep clean — поддерживать чистоту.'),
        question('Have you ever slept in a tent?','Ты когда-нибудь спал в палатке?','Ответь, что такой опыт у тебя есть.',['Yes, I have.','Yes, I am.','Yes, I do.'],0,'На вопрос «Have you ever…?» коротко отвечаем «Yes, I have» или «No, I haven’t».'),
        question('The weather was sunny, but it was windy.','Погода была солнечной, но ветреной.','Какая была погода?',['Дождливая и холодная','Снежная','Солнечная и ветреная'],2,'Sunny — солнечно. Windy — ветрено. But — но.'),
        question('Thank you for an amazing adventure!','Спасибо за удивительное приключение!','Ответь на благодарность.',['You are welcome!','I am late.','It is next to the river.'],0,'You are welcome! — Пожалуйста! Так отвечают на благодарность.')
      ],
      secret:question('Find the place where people put up tents.','Найди место, где люди ставят палатки.','Где спрятан знак экспедиции?',['Лагерь','Вокзал','Кинотеатр'],0,'Put up a tent — поставить палатку. Campsite — место для палаточного лагеря.'),
      places:['Лагерь','Вокзал','Кинотеатр']
    }
  ];
})();
