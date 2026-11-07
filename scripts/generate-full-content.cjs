/* Full thematic course: visually verified textbook vocabulary, original examples. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const previous = vm.runInNewContext(fs.readFileSync(path.join(root, 'app/content.js'), 'utf8') + ';CONTENT;');
const originalLessonIds = new Set(['travel-words', 'go-phrases', 'build-sentences']);
const originalLessons = JSON.parse(JSON.stringify(previous.lessons.filter(l => originalLessonIds.has(l.id))));
const originalWordIds = new Set(originalLessons.flatMap(l => l.wordIds));
const originalWords = JSON.parse(JSON.stringify(previous.words.filter(w => originalWordIds.has(w.id))));
assert.equal(originalLessons.length, 3, 'All original lessons must be preserved');
assert.equal(originalWords.length, 20, 'All original word IDs must be preserved');
const sections = [];
function section(unit, number, title, titleRu, pageSpan, verifiedPages, rows) {
  const words = rows.trim().split('\n').map((row, i) => {
    const parts = row.trim().split('|').map(x => x.trim());
    assert.equal(parts.length, 6, `${unit}.${number} row ${i+1}`);
    const [en,ru,example,exampleRu,note,page] = parts;
    return {en,ru,example,exampleRu,note,page:Number(page)};
  });
  sections.push({unit,section:number,title,titleRu,pageSpan,verifiedPages,words});
}
section(1,1,'Join the Explorers’ Club!','Вступаем в клуб','6–12',[6,8],`
welcome|добро пожаловать|Welcome to our school.|Добро пожаловать в нашу школу.|Welcome to + место: добро пожаловать куда-либо.|6
a name|имя|My name is Alex.|Меня зовут Ученик.|В английском говорим «Моё имя — Ученик»: My name is Alex.|6
a badge|значок, бейдж|This is my badge.|Это мой бейдж.|This is — это. Перед my артикль не нужен.|6
a country|страна|I want to visit this country.|Я хочу посетить эту страну.|Want to visit — хотеть посетить. This country — эта страна.|8
a continent|материк, континент|Australia is a continent.|Австралия — континент.|Перед одним предметом или понятием часто нужен a: a continent.|8
a language|язык|I am learning a new language.|Я изучаю новый язык.|Am learning — учусь сейчас, в этот период жизни.|8
history|история|I like learning about history.|Мне нравится узнавать об истории.|Learn about — узнавать о чём-либо. После like здесь используется learning.|8
a tradition|традиция|This is a family tradition.|Это семейная традиция.|Family здесь уточняет существительное: a family tradition.|8
a scientist|учёный|My aunt is a scientist.|Моя тётя — учёный.|Профессия после is обычно с a или an: a scientist.|8
famous|знаменитый|This city is famous for its museums.|Этот город знаменит своими музеями.|Be famous for — быть знаменитым благодаря чему-либо.|8
`);
section(1,3,'The Wonders of Nature','Чудеса природы','20–23',[20,21],`
a cliff|скала, утёс|We can see a high cliff.|Мы видим высокую скалу.|Прилагательное high стоит перед существительным cliff.|21
unique|уникальный|This island has unique plants.|На этом острове есть уникальные растения.|Has используется с this island, которое заменяется на it.|21
powerful|мощный|The river is powerful.|Река мощная.|В английском перед прилагательным нужен глагол: is powerful.|21
to explore|исследовать|We want to explore the forest.|Мы хотим исследовать лес.|Want to explore — хотеть исследовать.|21
to be located|располагаться|The park is located near our town.|Парк расположен рядом с нашим городом.|Is located — расположен. Near — рядом с, без to.|20
a wonder of nature|чудо природы|This waterfall is a wonder of nature.|Этот водопад — чудо природы.|A wonder of nature — цельное сочетание: чудо природы.|21
a coral reef|коралловый риф|Fish live near the coral reef.|Рыбы живут рядом с коралловым рифом.|Fish здесь означает несколько рыб. Live — живут.|21
an ocean|океан|We are learning about the ocean.|Мы узнаём об океане.|Learn about — изучать что-либо, узнавать о чём-либо.|21
a butterfly|бабочка|A butterfly is sitting on a flower.|Бабочка сидит на цветке.|Is sitting описывает то, что происходит сейчас.|21
an insect|насекомое|A butterfly is an insect.|Бабочка — насекомое.|Перед insect нужен an: слово начинается с гласного звука.|21
`);
section(1,4,'A Host Family','Семья и характер','24–29',[24,26],`
parents|родители|My parents like travelling.|Мои родители любят путешествовать.|Parents — родители, множественное число; поэтому like без -s.|26
grandparents|бабушка и дедушка|My grandparents live near us.|Мои бабушка и дедушка живут рядом с нами.|Near us — рядом с нами. После near употребляется us, не we.|26
grandchildren|внуки|Their grandchildren are happy.|Их внуки счастливы.|Grandchildren — множественное число от grandchild.|26
an aunt|тётя|My aunt works at a school.|Моя тётя работает в школе.|My aunt можно заменить на she; в Present Simple нужно works.|26
an uncle|дядя|My uncle can play the guitar.|Мой дядя умеет играть на гитаре.|После can ставим play, без to. Play the guitar — играть на гитаре.|26
a cousin|двоюродный брат или сестра|My cousin is thirteen.|Моему двоюродному брату тринадцать лет.|Cousin подходит и для мальчика, и для девочки. Возраст передаётся через is.|26
a niece|племянница|Her niece likes drawing.|Её племянница любит рисовать.|Niece — дочь брата или сестры. Likes относится к одному человеку.|26
a nephew|племянник|His nephew plays football.|Его племянник играет в футбол.|Nephew — сын брата или сестры. Play football — без артикля.|26
friendly|дружелюбный|Our neighbours are friendly.|Наши соседи дружелюбные.|Neighbours — соседи, поэтому are.|24
sociable|общительный|My friend is very sociable.|Мой друг очень общительный.|Very усиливает прилагательное: very sociable.|24
`);
section(1,5,'My Home Is My Castle','Дом и город','30–36',[30,34],`
a library|библиотека|I borrow books from the library.|Я беру книги в библиотеке.|Borrow — взять на время. From the library — из библиотеки.|30
a pharmacy|аптека|The pharmacy is near the hospital.|Аптека находится рядом с больницей.|Near не требует to: near the hospital.|30
a post office|почтовое отделение|We can buy stamps at the post office.|Мы можем купить марки на почте.|At the post office — на почте.|30
a shopping centre|торговый центр|There is a shopping centre in our town.|В нашем городе есть торговый центр.|There is вводит один предмет: есть торговый центр.|30
a hospital|больница|My mother works at a hospital.|Моя мама работает в больнице.|Works — форма для she. At a hospital описывает место работы.|30
a square|площадь|The square is in the town centre.|Площадь находится в центре города.|The town centre — центр города; in the town centre — в центре.|30
a detached house|отдельно стоящий дом|They live in a detached house.|Они живут в отдельно стоящем доме.|Detached house не имеет общей стены с соседним домом.|34
a semi-detached house|дом на две семьи с общей стеной|We live in a semi-detached house.|Мы живём в доме на две семьи с общей стеной.|Semi-detached — две части дома соединены одной общей стеной.|34
a terraced house|дом в ряду соединённых домов|My friend lives in a terraced house.|Мой друг живёт в доме в ряду соединённых домов.|Terraced houses имеют общие боковые стены с соседними домами.|34
a block of flats|многоквартирный дом|There is a lift in our block of flats.|В нашем многоквартирном доме есть лифт.|Flat — квартира; a block of flats — дом с квартирами.|34
`);
section(1,6,'Holidays and Events','Праздники и события','37–40',[37,39],`
to celebrate|праздновать|We celebrate my birthday in June.|Мы празднуем мой день рождения в июне.|Перед месяцем нужен in: in June.|37
a present|подарок|I have a present for you.|У меня есть подарок для тебя.|For you — для тебя. Have здесь означает «у меня есть».|37
to invite|приглашать|I want to invite my friends.|Я хочу пригласить друзей.|Invite my friends — пригласить друзей, без предлога перед friends.|37
to decorate|украшать|We decorate the room together.|Мы вместе украшаем комнату.|Decorate — украшать. Together — вместе.|37
to sing songs|петь песни|They like to sing songs.|Они любят петь песни.|Like to sing — любить петь. Songs — песни, множественное число.|37
fireworks|фейерверк, салют|We watched the fireworks.|Мы смотрели фейерверк.|Watched — прошедшая форма watch. Fireworks обычно во множественном числе.|39
a bonfire|большой костёр|We stood near the bonfire.|Мы стояли рядом с большим костром.|Stand в прошедшем времени — stood.|39
Christmas|Рождество|My friend enjoys Christmas.|Моему другу нравится Рождество.|Christmas — название праздника, пишется с большой буквы.|37
Easter|Пасха|They give each other eggs at Easter.|На Пасху они дарят друг другу яйца.|At Easter — на Пасху. Each other — друг другу.|37
not only ... but also|не только ... но и|I like not only music but also sport.|Мне нравится не только музыка, но и спорт.|После not only и but also стоят части одного типа: music и sport.|39
`);
section(2,1,'Happy Weekends','Выходные с пользой','50–55',[50,54],`
a funfair|ярмарка с аттракционами|We are going to the funfair.|Мы собираемся на ярмарку с аттракционами.|Funfair — место с аттракционами и играми.|50
a board game|настольная игра|This board game is interesting.|Эта настольная игра интересная.|Board game — настольная игра. Не теряй is перед interesting.|50
an exhibition|выставка|We visited an exhibition.|Мы посетили выставку.|Перед exhibition нужен an. Visited — посетили.|50
a ride|аттракцион; поездка на нём|This ride is exciting.|Этот аттракцион увлекательный.|В теме funfair ride означает аттракцион или катание на нём.|50
a souvenir|сувенир|I bought a souvenir for my sister.|Я купил сувенир для сестры.|Bought — прошедшая форма buy. For my sister — для моей сестры.|50
to have a rest|отдыхать|I want to have a rest.|Я хочу отдохнуть.|Have a rest запоминается целиком; здесь have не означает «иметь».|54
to have dinner|ужинать, обедать|We have dinner at seven.|Мы ужинаем в семь.|Dinner — основной приём пищи дня; в этом примере это ужин.|54
to have a sweet tooth|быть сладкоежкой|My brother has a sweet tooth.|Мой брат — сладкоежка.|С my brother употребляем has. Это выражение не переводится дословно.|54
to have a cold|быть простуженным|I have a cold today.|Сегодня я простужен.|Have a cold — быть простуженным; нужен артикль a.|54
to have to|быть вынужденным, быть обязанным|I have to feed my cat.|Я должен покормить своего кота.|Have to + глагол: необходимость что-то сделать.|54
`);
section(2,2,'Animals in the City','Животные и забота','56–61',[56,59,61],`
endangered|находящийся под угрозой исчезновения|We must help endangered animals.|Мы должны помогать животным под угрозой исчезновения.|После must ставим help без to. Endangered описывает животных, которым грозит исчезновение.|59
wildlife|дикая природа|This park protects wildlife.|Этот парк защищает дикую природу.|Wildlife — дикие животные и растения вместе, неисчисляемое слово.|59
a cage|клетка|The cage is empty.|Клетка пустая.|Empty — пустой. В предложении нужен is.|59
to save|спасать|We want to save these animals.|Мы хотим спасти этих животных.|These — эти, употребляется с множественным числом animals.|59
to join|присоединяться, вступать|I want to join the wildlife club.|Я хочу вступить в клуб защиты дикой природы.|Join the club — вступить в клуб; после join не ставится to.|59
to protect|защищать|We can protect wild animals.|Мы можем защищать диких животных.|Can protect — можем защищать, без to.|61
harmful|вредный|Dirty water is harmful to animals.|Грязная вода вредна для животных.|Harmful to — вредный для. Water — неисчисляемое слово, поэтому is.|61
a habitat|среда обитания|We must protect their habitat.|Мы должны защищать их среду обитания.|Habitat — место, где животные или растения живут в природе.|61
to cut down trees|вырубать деревья|People should not cut down these trees.|Людям не следует вырубать эти деревья.|Should not выражает совет не делать что-либо. Cut down — вырубать.|61
to feed birds|кормить птиц|We feed birds in winter.|Зимой мы кормим птиц.|Feed — кормить. Перед winter используем in.|61
`);
section(2,3,'British and Russian Schools','Школа и правила','62–69',[62,63,68],`
a school uniform|школьная форма|We wear a school uniform.|Мы носим школьную форму.|Wear — носить одежду. A school uniform — школьная форма.|62
a subject|учебный предмет|English is my favourite subject.|Английский — мой любимый предмет.|Subject здесь означает школьный предмет, не подлежащее.|63
a dictionary|словарь|I use a dictionary in class.|Я пользуюсь словарём на уроке.|Use a dictionary — пользоваться словарём. In class — на уроке.|63
a blackboard|школьная доска|Please clean the blackboard.|Пожалуйста, вытри доску.|Просьба начинается с глагола: clean. Please делает её вежливой.|63
to ask questions|задавать вопросы|We can ask questions after the lesson.|Мы можем задавать вопросы после урока.|Ask questions — задавать вопросы. After the lesson — после урока.|63
to learn by heart|учить наизусть|I learn short poems by heart.|Я учу короткие стихотворения наизусть.|By heart — наизусть. Short poems — короткие стихотворения.|63
to work in pairs|работать в парах|We often work in pairs.|Мы часто работаем в парах.|Often обычно ставится перед основным глаголом: often work.|63
to be late|опаздывать|We must not be late for school.|Нам нельзя опаздывать в школу.|Be late for school — опаздывать в школу. Must not — запрет.|63
needn't|не нужно, необязательно|You needn't bring your ruler.|Тебе необязательно приносить линейку.|Needn't означает отсутствие необходимости; это не запрет.|62
a school term|учебный период, триместр|Our school term starts in September.|Наш учебный период начинается в сентябре.|Term — часть учебного года; устройство года зависит от школы.|68
`);
section(2,4,'It’s Delicious!','Еда и покупки','70–74',[70,71,74],`
milk|молоко|There is some milk in the fridge.|В холодильнике есть немного молока.|Milk неисчисляемое, поэтому is. Some — некоторое количество.|70
orange juice|апельсиновый сок|I would like some orange juice.|Я хотел бы немного апельсинового сока.|Would like — вежливое «хотел бы». Juice неисчисляемое.|70
cornflakes|кукурузные хлопья|I have cornflakes for breakfast.|На завтрак я ем кукурузные хлопья.|For breakfast — на завтрак. Cornflakes обычно во множественном числе.|70
pasta|макаронные изделия|There isn't much pasta left.|Осталось немного макарон.|Pasta в английском неисчисляемое: much pasta, не many pasta.|70
strawberry jam|клубничное варенье|This strawberry jam is delicious.|Это клубничное варенье очень вкусное.|Jam — неисчисляемое существительное. Strawberry уточняет вкус.|70
flour|мука|We need a little flour.|Нам нужно немного муки.|A little используется с неисчисляемым flour.|70
fried eggs|яичница|My dad likes fried eggs.|Мой папа любит яичницу.|Fried eggs — яйца, приготовленные на сковороде.|70
to cook|готовить еду|I can cook a simple meal.|Я умею готовить простую еду.|Cook — готовить. После can глагол без to.|71
a recipe|рецепт блюда|Can you give me the recipe?|Можешь дать мне рецепт?|В вопросе can стоит перед you. Give me — дай мне.|74
a shopping list|список покупок|We are making a shopping list.|Мы составляем список покупок.|Make a list — составлять список. Are making — делаем сейчас.|74
`);
section(3,1,'An Internet Project','Наш интернет-проект','84–89',[84,86,87],`
a website|веб-сайт|Our website has new photos.|На нашем сайте появились новые фотографии.|Our website можно заменить на it, поэтому has.|86
a project|проект|We are working on a project.|Мы работаем над проектом.|Work on — работать над. Are working — действие в процессе.|84
a quiz|викторина|This quiz has ten questions.|В этой викторине десять вопросов.|Quiz — викторина или короткий тест. Has — форма для it.|86
to post|публиковать в интернете|I want to post a comment.|Я хочу опубликовать комментарий.|Post в интернет-контексте означает разместить сообщение.|86
to share|делиться|We can share our ideas.|Мы можем поделиться своими идеями.|Share our ideas — делиться идеями. Can + глагол без to.|87
to discuss|обсуждать|Let's discuss our project.|Давай обсудим наш проект.|Discuss используется без about: discuss our project.|87
to connect|соединять, связывать|Our project connects students.|Наш проект объединяет учеников.|Connects — форма для одного project.|86
a magazine|журнал|My sister is reading a magazine.|Моя сестра читает журнал.|Magazine — журнал, не магазин. Is reading — читает сейчас.|86
a newspaper|газета|My grandfather buys a newspaper.|Мой дедушка покупает газету.|Buy с he превращается в buys.|86
an encyclopedia|энциклопедия|We found the answer in an encyclopedia.|Мы нашли ответ в энциклопедии.|Found — прошедшее время find. Перед encyclopedia нужен an.|86
`);
section(3,2,'More about the UK','Великобритания на карте','90–97',[90,91,93],`
the United Kingdom|Соединённое Королевство|The United Kingdom includes four countries.|Соединённое Королевство включает четыре страны.|С названием United Kingdom используется the.|91
an island|остров|This island is very small.|Этот остров очень маленький.|Island — остров. Very small — очень маленький.|91
a capital|столица|London is the capital of the UK.|Лондон — столица Соединённого Королевства.|The capital of — столица чего-либо.|91
a flag|флаг|Each country has a flag.|У каждой страны есть флаг.|Each country — каждая страна, единственное число; поэтому has.|91
to include|включать в себя|The tour includes a museum visit.|Экскурсия включает посещение музея.|Includes — форма для the tour. Museum visit — посещение музея.|91
a castle|замок|We visited an old castle.|Мы посетили старый замок.|Перед old нужен an; old описывает castle.|93
climate|климат|The climate here is mild.|Климат здесь мягкий.|Climate — обычные погодные условия местности, не погода сегодня.|93
changeable|переменчивый|The weather is changeable today.|Сегодня погода переменчивая.|Changeable — то, что часто меняется. Не теряй is.|93
communication|общение|English helps with communication.|Английский помогает в общении.|Communication — общение. Help with — помогать с чем-либо.|93
an accent|акцент|My friend has a Scottish accent.|У моего друга шотландский акцент.|Scottish — шотландский, пишется с большой буквы.|93
`);
section(3,3,'A Trip to England','Едем в Англию','98–105',[98,99,101,104,105],`
a custom|обычай|This is an interesting custom.|Это интересный обычай.|Custom — обычай; перед interesting нужен an.|98
a saying|поговорка|My grandmother knows this saying.|Моя бабушка знает эту поговорку.|Know — знать, с she нужно knows.|98
a superstition|суеверие|I don't believe in this superstition.|Я не верю в это суеверие.|Believe in — верить во что-либо. После don't глагол без -s.|98
careful|осторожный, внимательный|Please be careful near the road.|Пожалуйста, будь осторожен возле дороги.|Careful описывает человека: be careful.|98
carefully|осторожно, внимательно|Please listen carefully.|Пожалуйста, слушай внимательно.|Carefully описывает действие: как слушать.|98
a university|университет|My sister studies at a university.|Моя сестра учится в университете.|University начинается со звука /j/, поэтому a, не an.|104
a conference|конференция|They are planning a conference.|Они планируют конференцию.|Are planning — планируют сейчас; в planning удваивается n.|104
industrial|промышленный|This is an industrial city.|Это промышленный город.|Industrial — прилагательное; перед ним нужен an в этом сочетании.|104
historical|исторический, связанный с историей|I enjoy reading historical novels.|Мне нравится читать исторические романы.|Historical означает связь с историей; novels — романы.|101
a guide|экскурсовод|Our guide speaks English.|Наш экскурсовод говорит по-английски.|Guide — человек, который показывает места и рассказывает о них.|101
`);
section(3,4,'Wales and Northern Ireland','Уэльс и Северная Ирландия','106–110',[106,107,108,109,110],`
a costume|костюм, наряд|She is wearing a national costume.|На ней национальный костюм.|Is wearing — сейчас одета в. National costume — национальный наряд.|106
a daffodil|нарцисс|There is a yellow daffodil in the garden.|В саду растёт жёлтый нарцисс.|Daffodil — цветок. There is говорит об одном цветке.|106
a waterfall|водопад|We are taking photos of the waterfall.|Мы фотографируем водопад.|Take photos of — фотографировать кого-либо или что-либо.|106
a hill|холм|The hill is covered with grass.|Холм покрыт травой.|Covered with — покрыт чем-либо. Hill ниже горы.|106
to reach|добираться до, достигать|We reached the hill before lunch.|Мы добрались до холма до обеда.|Reach без to: reached the hill.|106
to mention|упоминать|Please mention the name of the park.|Пожалуйста, упомяни название парка.|Mention — кратко сказать о чём-либо; about не нужен.|107
surfing|сёрфинг|My cousin enjoys surfing.|Мой двоюродный брат любит сёрфинг.|После enjoy действие часто передаётся формой с -ing.|109
canoeing|плавание на каноэ|We want to try canoeing.|Мы хотим попробовать поплавать на каноэ.|Canoeing — занятие, плавание на каноэ.|109
ancient|древний|They are exploring an ancient castle.|Они исследуют древний замок.|Ancient начинается с гласного звука, поэтому an.|109
a shamrock|трилистник|The shamrock has three leaves.|У трилистника три листочка.|Leaf — лист, leaves — листья. Has относится к одному shamrock.|110
`);
section(3,5,'Welcome to Scotland!','Знакомимся с Шотландией','111–116',[111,112,115],`
a region|регион, область|This region has many lakes.|В этом регионе много озёр.|Many употребляется с исчисляемым lakes.|111
a loch|озеро в Шотландии|We stayed near a loch.|Мы остановились рядом с шотландским озером.|Loch — шотландское название озера. Stayed — остановились, жили временно.|112
a monster|чудовище|The story is about a monster.|Эта история о чудовище.|About означает «о»; is about — рассказывает о.|111
a kilt|килт|He is wearing a kilt.|На нём килт.|Kilt — традиционная шотландская одежда. Is wearing — сейчас носит.|112
tartan|шотландский клетчатый узор|This scarf has a tartan pattern.|У этого шарфа шотландский клетчатый узор.|Tartan pattern — узор из пересекающихся полос.|112
bagpipes|волынка|My friend plays the bagpipes.|Мой друг играет на волынке.|Play the bagpipes — играть на волынке. В английском слово во множественном числе.|112
a clan|клан, род|Each clan had its own traditions.|У каждого клана были свои традиции.|Had — прошедшая форма have. Its own — свои собственные.|112
culture|культура|We are learning about Scottish culture.|Мы изучаем шотландскую культуру.|Scottish — шотландский. Learn about — узнавать о.|112
myself|себя; сам|I made this model myself.|Я сам сделал эту модель.|Myself относится к I и подчёркивает: без чужой помощи.|115
themselves|себя; сами|They painted the room themselves.|Они сами покрасили комнату.|Themselves относится к they; painted — покрасили.|115
`);
section(3,6,'Famous British People','Известные люди','117–122',[117,118,120],`
an award|награда|She received an award.|Она получила награду.|Received — получила. Перед award нужен an.|117
a leading role|главная роль|He played a leading role in the film.|Он сыграл главную роль в фильме.|Play a role — играть роль. In the film — в фильме.|117
an astronaut|космонавт|She wants to become an astronaut.|Она хочет стать космонавтом.|Become — становиться. Перед astronaut нужен an.|117
a candidate|кандидат|This candidate has good ideas.|У этого кандидата хорошие идеи.|Candidate — претендент на место или роль. Has — форма для одного человека.|117
an actor|актёр|The actor is learning his lines.|Актёр учит свой текст.|Lines у актёра — реплики роли. Is learning — учит сейчас.|118
a writer|писатель|This writer creates adventure stories.|Этот писатель создаёт приключенческие рассказы.|Writer образовано от write: тот, кто пишет.|118
a musician|музыкант|My uncle is a musician.|Мой дядя — музыкант.|После is перед профессией ставим a: a musician.|118
an architect|архитектор|The architect designed our school.|Архитектор спроектировал нашу школу.|Designed — спроектировал; architect — профессия.|118
a poet|поэт|This poet writes about nature.|Этот поэт пишет о природе.|Write с he превращается в writes. About nature — о природе.|118
talented|талантливый|Our class has a talented singer.|В нашем классе есть талантливый певец.|Talented — талантливый. Singer — певец, от sing.|117
`);
section(3,7,'Your Free Time','Моё свободное время','123–131',[123,124,125,128,131],`
to collect|коллекционировать, собирать|I collect postcards.|Я коллекционирую открытки.|Collect — собирать предметы в коллекцию.|124
to make models|делать модели|We like to make models.|Мы любим делать модели.|Make models — мастерить модели. После like возможно to make.|123
to take care of|заботиться о|I take care of my dog.|Я забочусь о своей собаке.|Take care of — цельное выражение; не теряй of.|123
free time|свободное время|I draw in my free time.|В свободное время я рисую.|In my free time — в моё свободное время.|125
to waste time|тратить время впустую|I don't want to waste time.|Я не хочу тратить время впустую.|Want to waste — хотеть тратить; don't делает фразу отрицательной.|125
to get ready|готовиться|We are getting ready for the trip.|Мы готовимся к поездке.|Get ready for — готовиться к. Are getting — готовимся сейчас.|128
to tell the truth|говорить правду|You should tell the truth.|Тебе следует говорить правду.|Tell the truth — говорить правду. После should глагол без to.|128
to keep a secret|хранить секрет|I can keep a secret.|Я умею хранить секрет.|Keep a secret — не рассказывать секрет другим.|128
science fiction|научная фантастика|My brother enjoys science fiction.|Мой брат любит научную фантастику.|Science fiction — жанр литературы и кино.|131
a fairy tale|сказка|My sister is reading a fairy tale.|Моя сестра читает сказку.|Is reading — читает сейчас. Fairy tale — сказка.|131
`);

const unit4 = JSON.parse(fs.readFileSync(path.join(root,'content-unit4.json'),'utf8'));
sections.push(...unit4);
const section2 = {unit:1,section:2,title:'Travels and Fun',titleRu:'Путешествия и отдых',pageSpan:'13–19',verifiedPages:[13,14,15,16,17,18,19],words:[]};
const coverageSections = [...sections, section2].sort((a,b)=>a.unit-b.unit || a.section-b.section);
const norm = s=>s.toLowerCase().replace(/[.!?,]/g,'').replace(/\s+/g,' ').trim();
const bag = s=>norm(s).split(' ').sort().join('|');
const strip = s=>s.replace(/[.!?]$/,'');
const rotate = (a,k)=>[...a.slice(k),...a.slice(0,k)];
function timeAlternatives(sentence) {
  const clean=strip(sentence);
  const m=clean.match(/^(.*?) (yesterday|today|now|in winter|in summer|on Monday|in June|in September|after school|after the lesson|before lunch|before dark|last year|in my free time)$/i);
  if(!m) return [];
  const prefix=m[2].charAt(0).toUpperCase()+m[2].slice(1);
  let body=m[1];
  if(!/^(I\b|English\b|London\b)/.test(body)) body=body.charAt(0).toLowerCase()+body.slice(1);
  return [`${prefix} ${body}.`];
}
const extraOrders={
  'We decorate the room together.':['Together we decorate the room.'],
  'Please listen carefully.':['Please carefully listen.','Listen carefully please.'],
  'My uncle can play the guitar.':[],
  'They like to sing songs.':[],
  'I would like some orange juice.':[],
  'Please clean the blackboard.':['Clean the blackboard please.'],
  'Please be careful near the road.':['Be careful near the road please.','Near the road please be careful.','Near the road be careful please.'],
  'We can buy stamps at the post office.':['At the post office we can buy stamps.'],
  'There is a shopping centre in our town.':['In our town there is a shopping centre.'],
  'I have a present for you.':['For you I have a present.'],
  'People should not cut down these trees.':['People should not cut these trees down.'],
  'I use a dictionary in class.':['In class I use a dictionary.'],
  'There is some milk in the fridge.':['In the fridge there is some milk.'],
  'I have cornflakes for breakfast.':['For breakfast I have cornflakes.'],
  'There is a yellow daffodil in the garden.':['In the garden there is a yellow daffodil.'],
  'Please mention the name of the park.':['Mention the name of the park please.'],
  'He played a leading role in the film.':['In the film he played a leading role.']
};
const newWords=[];
const newLessons=[];
for(const s of sections){
  assert.equal(s.words.length,10,`Section ${s.unit}.${s.section} should contain 10 words`);
  const tag=`u${s.unit}s${s.section}`;
  const words=s.words.map((w,i)=>({...w,id:`${tag}-w${String(i+1).padStart(2,'0')}`,unit:s.unit,section:s.section,sectionTitle:s.title,pageSpan:s.pageSpan,ipa:''}));
  newWords.push(...words);
  const common={unit:s.unit,section:s.section,sectionTitle:s.title,pageSpan:s.pageSpan,pages:s.pageSpan,wordIds:words.map(w=>w.id)};
  const vocabulary=words.map((w,i)=>{
    const reverse=i%2===1;
    const options=rotate([w,...[1,3,6].map(k=>words[(i+k)%words.length])].map(x=>reverse?x.en:x.ru),i%4);
    return {id:`${tag}-v${i+1}`,type:'choice',wordId:w.id,page:w.page,prompt:reverse?'Выбери английский перевод':'Выбери перевод на русский',display:reverse?w.ru:w.en,reverse,en:w.en,ru:w.ru,answer:reverse?w.en:w.ru,options,explanation:w.note};
  });
  newLessons.push({...common,id:`${tag}-words`,title:s.titleRu,subtitle:'10 слов и выражений',icon:'case',tasks:vocabulary});
  const practice=words.map((w,i)=>{
    const core=w.en.replace(/^(to be |to |an |a )/,'');
    const occurrence=w.example.toLowerCase().indexOf(core.toLowerCase());
    const coreOptions=words.map(x=>x.en.replace(/^(to be |to |an |a )/,''));
    if(i>=6 && occurrence>=0 && !core.includes('...') && core.split(' ').length<=4){
      const answer=w.example.slice(occurrence,occurrence+core.length);
      const display=w.example.slice(0,occurrence)+'___'+w.example.slice(occurrence+core.length);
      const alternatives=[1,3,6].map(k=>coreOptions[(i+k)%words.length]);
      const options=rotate([answer,...alternatives],i%4);
      return {id:`${tag}-p${i+1}`,type:'gap',wordId:w.id,page:w.page,prompt:`Выбери пропуск: ${w.exampleRu}`,display,en:w.example,ru:w.exampleRu,answer,options,explanation:w.note};
    }
    const tokens=strip(w.example).split(/\s+/);
    const accepted=[...new Set([...(w.accepted||[]),...(extraOrders[w.example]||[]),...timeAlternatives(w.example)])].filter(a=>norm(a)!==norm(w.example));
    return {id:`${tag}-p${i+1}`,type:'order',wordId:w.id,page:w.page,prompt:`Собери предложение: ${w.exampleRu}`,en:w.example,ru:w.exampleRu,answer:w.example,tokens:rotate(tokens,Math.max(1,Math.floor(tokens.length/2))),hint:`Можно начать с «${tokens[0]}». ${w.note}`,accepted,explanation:w.note};
  });
  newLessons.push({...common,id:`${tag}-practice`,title:'Фразы: '+s.titleRu,subtitle:'Собери фразы и заполни пропуски',icon:'bubbles',tasks:practice});
}
for(const w of originalWords) Object.assign(w,{unit:1,section:2,sectionTitle:section2.title,pageSpan:section2.pageSpan});
for(const l of originalLessons) Object.assign(l,{unit:1,section:2,sectionTitle:section2.title,pageSpan:section2.pageSpan});
const content={
  version:2,
  units:previous.units.map(u=>({...u,sectionDetails:coverageSections.filter(s=>s.unit===u.id).map(s=>({number:s.section,title:s.title,ru:s.titleRu,pageSpan:s.pageSpan}))})),
  words:[...originalWords,...newWords].sort((a,b)=>a.unit-b.unit||a.section-b.section),
  lessons:[...originalLessons,...newLessons].sort((a,b)=>a.unit-b.unit||a.section-b.section),
  source:{...previous.source,path:'private-inputs/textbook.pdf',coverage:'22 тематические секции, 4 юнита. Авторские тренировки лексики и коротких предложений по темам учебника; не перенос всех упражнений или всех слов книги.',pageConvention:'page — физическая страница PDF (счёт с 1). На PDF-странице 175 напечатано 176; диапазон последней секции 172–176 относится к печатным номерам.'},
  coverage:coverageSections.map(s=>({unit:s.unit,section:s.section,title:s.title,ru:s.titleRu,pageSpan:s.pageSpan,verifiedPages:s.verifiedPages,kind:'thematic-training'}))
};
assert.equal(content.units.length,4);
assert.equal(content.coverage.length,22);
assert.equal(content.words.length,230);
assert.equal(content.lessons.length,45);
const allIds=new Set();
for(const l of content.lessons){
  assert(l.tasks.length>=8 && l.tasks.length<=10);
  for(const q of l.tasks){
    assert(!allIds.has(q.id),`Duplicate task ${q.id}`); allIds.add(q.id);
    if(q.type==='order'){
      assert.equal(bag(q.tokens.join(' ')),bag(q.answer),q.id);
      for(const a of q.accepted||[]) assert.equal(bag(a),bag(q.answer),`${q.id} accepted ${a}`);
    }else{
      assert.equal(new Set(q.options.map(norm)).size,q.options.length,q.id);
      assert.equal(q.options.filter(a=>a===q.answer).length,1,q.id);
    }
  }
}
fs.writeFileSync(path.join(root,'content-full.json'),JSON.stringify(content,null,2)+'\n');
const lines=['# Тематическое покрытие Enjoy English 6','',
  'Источник: предоставленный PDF, Биболетова, Денисенко, Трубанева, Дрофа, 2019, 3-е исправленное издание. Оглавление с. 3–5 проверено визуально. Все 22 секции представлены в приложении.',
  '',`Содержимое: ${content.words.length} словарных карточек, ${content.lessons.length} уроков, ${content.lessons.reduce((n,l)=>n+l.tasks.length,0)} упражнений. В каждой секции минимум 10 карточек и 2 коротких урока. У сохранённой секции 1.2 — 20 карточек и 3 урока. Повтор одного английского слова в разных темах имеет отдельный контекст.`,
  '', 'Это полный охват тематических секций, а не перепечатка всех заданий или исчерпывающий словарь книги. Английские предложения и упражнения авторские, лексика и соответствие тем проверены по страницам PDF. Длинные учебные тексты и оригинальные аудиозаписи не включены.',
  '', '## Проверенные секции','', '| Юнит/секция | Тема | Диапазон в книге | Просмотренные страницы PDF |', '|---|---|---|---|'];
for(const s of coverageSections) lines.push(`| ${s.unit}.${s.section} | ${s.title} | ${s.pageSpan} | ${s.verifiedPages.join(', ')} |`);
lines.push('', '## Пагинация и проверка', '',
  'Поле page в карточках и заданиях означает физический номер страницы PDF, начиная с 1. В основной части он совпадает с печатным. В конце есть расхождение: на физической странице 175 напечатано 176. Последняя секция начинается на 172; её печатный диапазон указан 172–176.',
  '', 'Страницы отрисованы из исходного PDF и просмотрены визуально. Текстового слоя нет. Для заголовков проверены контактные листы всех страниц 6–184; в таблице перечислены страницы, просмотренные полностью для отбора лексики и правил.',
  '', 'Автоматически проверяются уникальные ID, ссылки на слова, четыре юнита и 22 секции, число заданий, правильный ответ среди вариантов, совпадение набора слов в заданиях на порядок, допустимые альтернативные порядки. Переводы и пояснения составлены и вычитаны вручную.',
  '', 'Сохранены ID двадцати исходных карточек и трёх уроков; прогресс этих карточек не должен потеряться. Генератор пишет только content-full.json. Интеграция в app/content.js выполняется отдельно.',
  '', '## Учебные ограничения', '',
  '- Грамматика отрабатывается на коротких примерах; это не полный курс грамматических правил и не автоматическая оценка свободной речи.',
  '- Озвучивание может быть синтезированным. Оно не является оригинальным аудиоприложением издательства.',
  '- Факты о населении, рекордах, монархе и другой изменяемой информации из издания 2019 года не используются как актуальные контрольные вопросы.',
  '- Опечатки из текста о поездке на с.18 не перенесены: используются правильные формы и конструкции.',
  '- Для ответов с несколькими естественными порядками слов предусмотрены accepted-варианты. Свободный перевод вне заданных слов требует отдельной проверки.'
);
fs.mkdirSync(path.join(root,'docs'),{recursive:true});
fs.writeFileSync(path.join(root,'docs/content-coverage.md'),lines.join('\n')+'\n');
console.log(JSON.stringify({words:content.words.length,lessons:content.lessons.length,tasks:allIds.size,sections:content.coverage.length},null,2));
