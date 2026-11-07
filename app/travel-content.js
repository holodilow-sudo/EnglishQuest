/* Original practical travel course. Independent of the textbook and its page numbers. */
(() => {
  'use strict';
  const source = [
    ['basics','Первые слова','bubbles','Вежливость, знакомство и просьбы','Could you…? — вежливая просьба. Please и thank you помогают в любом разговоре.',`
Hello! My name is Alex.|Здравствуйте! Меня зовут Ученик.|Представься новому знакомому.
Excuse me, could you help me?|Извините, вы могли бы мне помочь?|Вежливо обратись за помощью.
Could you speak more slowly, please?|Вы могли бы говорить помедленнее?|Собеседник говорит слишком быстро.
Could you say that again, please?|Повторите это, пожалуйста.|Ты не расслышал фразу.
I don't understand.|Я не понимаю.|Объясни, что смысл непонятен.
Could you write it down, please?|Запишите это, пожалуйста.|Ты хочешь увидеть информацию на бумаге.
What does this word mean?|Что означает это слово?|Спроси о незнакомом слове.
Thank you for your help.|Спасибо за вашу помощь.|Поблагодари человека, который помог.
I'm travelling with my family.|Я путешествую с семьёй.|Расскажи, с кем ты приехал.
Do you speak English?|Вы говорите по-английски?|Узнай, можно ли общаться на английском.
`],
    ['airport','Аэропорт','case','Регистрация, багаж и посадка','Check-in — регистрация; gate — выход на посадку; boarding pass — посадочный талон.',`
Where is the check-in desk?|Где стойка регистрации?|Найди место регистрации на рейс.
Here is my passport.|Вот мой паспорт.|Передай паспорт сотруднику.
Can I have a window seat, please?|Можно мне место у окна?|Выбери место у окна в самолёте.
Can we sit together?|Можно нам сидеть вместе?|Попроси соседние места для семьи.
Is this bag allowed as hand luggage?|Эту сумку можно взять в ручную кладь?|Уточни, можно ли взять сумку в салон.
Where is the security check?|Где досмотр безопасности?|После регистрации найди досмотр.
Which gate does our flight leave from?|С какого выхода отправляется наш рейс?|Уточни выход на посадку.
What time does boarding start?|Во сколько начинается посадка?|Узнай время начала посадки.
Has the gate changed?|Выход на посадку изменился?|На табло другая информация: уточни выход.
Our flight has been delayed.|Наш рейс задержали.|Сообщи о задержке рейса.
`],
    ['flight','В самолёте','globe','Комфорт, просьбы и пересадка','Could I have…? — «Можно мне…?»; connecting flight — стыковочный рейс.',`
Excuse me, this is my seat.|Извините, это моё место.|Кто-то сел на твоё место.
Could you help me with my bag?|Вы могли бы помочь мне с сумкой?|Попроси помочь убрать сумку.
Could I have some water, please?|Можно мне немного воды?|Попроси воду у бортпроводника.
Could I have a blanket, please?|Можно мне одеяло?|В салоне холодно: попроси одеяло.
Where is the toilet?|Где туалет?|Уточни, где туалет в самолёте.
I feel sick.|Меня тошнит.|Сообщи бортпроводнику о плохом самочувствии.
How long is the flight?|Сколько длится полёт?|Спроси о продолжительности полёта.
What time do we land?|Во сколько мы приземлимся?|Уточни время прибытия самолёта.
I have a connecting flight.|У меня стыковочный рейс.|Объясни, что дальше летишь другим рейсом.
Do I need to collect my luggage here?|Мне нужно забрать багаж здесь?|Уточни порядок получения багажа при пересадке.
`],
    ['border','Паспортный контроль','shield','Цель поездки, документы и таможня','Отвечай о своей реальной поездке. I am here on holiday — «Я здесь на отдыхе».',`
I am here on holiday.|Я здесь на отдыхе.|Объясни цель туристической поездки.
We are staying for two weeks.|Мы остаёмся на две недели.|Сообщи длительность поездки.
We are staying at a hotel.|Мы остановимся в отеле.|Скажи, где вы будете жить.
Here is our hotel booking.|Вот наша бронь отеля.|Покажи подтверждение проживания.
Here is our return ticket.|Вот наш обратный билет.|Покажи билет домой.
I am travelling with my parents.|Я путешествую с родителями.|Объясни, какие взрослые тебя сопровождают.
My parents are over there.|Мои родители вон там.|Покажи, где стоят родители.
Do I need to fill in this form?|Мне нужно заполнить эту форму?|Уточни, требуется ли анкета.
Where is customs?|Где таможня?|Найди таможенный контроль.
Where can I declare these items?|Где я могу задекларировать эти вещи?|Спроси, куда обратиться с вещами для декларирования.
`],
    ['baggage','Получение багажа','case','Лента, потерянный или повреждённый чемодан','Luggage и baggage — багаж. Luggage tag — багажная бирка.',`
Where is baggage claim?|Где выдача багажа?|После прилёта найди багажные ленты.
Which carousel is for our flight?|На какой ленте багаж нашего рейса?|Уточни номер багажной ленты.
My suitcase hasn't arrived.|Мой чемодан не прибыл.|Сообщи, что чемодана нет на выдаче.
My suitcase is damaged.|Мой чемодан повреждён.|Покажи повреждение чемодана.
Here is my luggage tag.|Вот моя багажная бирка.|Передай номер зарегистрированного багажа.
It is a large blue suitcase.|Это большой синий чемодан.|Опиши потерянный чемодан.
Where is the lost luggage desk?|Где стойка розыска багажа?|Найди сотрудника, который занимается пропавшим багажом.
Could you give me a reference number?|Вы могли бы дать мне номер обращения?|Попроси номер заявления о пропаже.
Can you deliver it to our hotel?|Вы можете доставить его в наш отель?|Узнай о доставке найденного чемодана.
When should I contact you again?|Когда мне снова связаться с вами?|Уточни время следующего обращения.
`],
    ['hotel','Заселение в отель','home','Бронь, завтрак и удобства','Reservation — бронь. Check in — заселиться; check out — выехать.',`
We have a reservation.|У нас есть бронь.|Начни разговор на стойке отеля.
The booking is under my father's name.|Бронь оформлена на имя моего папы.|Объясни, на чьё имя искать бронь.
Can we check in now?|Мы можем заселиться сейчас?|Узнай, готов ли номер к заселению.
Is breakfast included?|Завтрак включён?|Уточни, входит ли завтрак в стоимость.
What time is breakfast?|Во сколько завтрак?|Узнай часы завтрака.
Where is the lift?|Где лифт?|Найди лифт до номера.
What is the Wi-Fi password?|Какой пароль от Wi-Fi?|Попроси пароль сети отеля.
Could we have another key card?|Можно нам ещё одну ключ-карту?|Попроси дополнительный ключ от номера.
What time is check-out?|Во сколько нужно освободить номер?|Уточни время выезда.
Can we leave our luggage here?|Мы можем оставить здесь багаж?|Попроси сохранить чемоданы после выезда.
`],
    ['hotel-help','Проблемы в номере','bulb','Ключ, уборка, шум и ремонт','There is / There are — сообщить, что есть. There is no… — сообщить об отсутствии.',`
The key card doesn't work.|Ключ-карта не работает.|Ты не можешь открыть дверь номера.
There is no hot water.|Нет горячей воды.|Сообщи о холодной воде в душе.
The air conditioning doesn't work.|Кондиционер не работает.|Попроси разобраться с кондиционером.
Could we have clean towels, please?|Можно нам чистые полотенца?|Попроси заменить полотенца.
Our room hasn't been cleaned.|Наш номер не убрали.|Сообщи, что уборки не было.
It is too noisy in our room.|В нашем номере слишком шумно.|Пожалуйся на шум в номере.
Could we change rooms?|Мы могли бы поменять номер?|Попроси другой номер.
I have locked myself out.|Я захлопнул дверь, а ключ остался внутри.|Объясни, почему не можешь попасть в номер.
Could someone come and check it?|Кто-нибудь может прийти и проверить это?|Попроси прислать сотрудника для проверки.
We need an extra pillow.|Нам нужна дополнительная подушка.|Попроси ещё одну подушку.
`],
    ['food','Кафе и ресторан','bubbles','Столик, меню, заказ и счёт','I would like… — «Я бы хотел…». The bill — счёт; to take away — с собой.',`
A table for three, please.|Столик на троих, пожалуйста.|Попроси столик для трёх человек.
Could we see the menu, please?|Можно посмотреть меню?|Попроси меню у официанта.
What would you recommend?|Что вы посоветуете?|Попроси посоветовать блюдо.
I would like chicken with rice, please.|Я бы хотел курицу с рисом.|Закажи курицу с рисом.
Could I have still water, please?|Можно мне воду без газа?|Закажи негазированную воду.
Without onions, please.|Без лука, пожалуйста.|Попроси убрать лук из блюда.
Is this dish spicy?|Это блюдо острое?|Уточни остроту блюда.
Could we have the bill, please?|Можно нам счёт?|Попроси счёт после еды.
Is service included?|Обслуживание включено?|Уточни, включена ли плата за обслуживание.
Can I have this to take away?|Можно это с собой?|Попроси упаковать еду с собой.
`],
    ['diet','Еда и аллергии','shield','Состав, ограничения и безопасный выбор','Allergic to — «есть аллергия на». Вопрос о составе не заменяет подтверждение персонала.',`
I am allergic to peanuts.|У меня аллергия на арахис.|Предупреди персонал об аллергии на арахис.
Does this contain nuts?|В этом есть орехи?|Проверь наличие орехов в блюде.
Does this contain milk?|В этом есть молоко?|Уточни, есть ли молоко в составе.
Is there any seafood in this dish?|В этом блюде есть морепродукты?|Уточни наличие морепродуктов.
Could you check the ingredients, please?|Вы могли бы проверить состав?|Попроси уточнить ингредиенты на кухне.
I cannot eat gluten.|Мне нельзя есть глютен.|Сообщи об ограничении в питании.
Do you have any vegetarian dishes?|У вас есть вегетарианские блюда?|Найди блюдо без мяса и рыбы.
Is this suitable for someone with a nut allergy?|Это подходит человеку с аллергией на орехи?|Уточни, подходит ли блюдо при аллергии.
Please tell the chef about my allergy.|Пожалуйста, сообщите повару о моей аллергии.|Попроси передать информацию повару.
I would prefer something else.|Я бы предпочёл что-нибудь другое.|Попроси заменить неподходящий вариант.
`],
    ['transport','Транспорт и такси','car','Билеты, маршруты и остановки','Single — билет в одну сторону; return — туда и обратно. Platform — платформа.',`
Where can I buy a ticket?|Где можно купить билет?|Найди кассу или автомат с билетами.
Two return tickets, please.|Два билета туда и обратно, пожалуйста.|Купи два билета с обратной поездкой.
Does this bus go to the city centre?|Этот автобус идёт в центр города?|Проверь маршрут автобуса.
Which platform do we need?|Какая платформа нам нужна?|Уточни платформу отправления поезда.
When is the next train?|Когда следующий поезд?|Узнай время ближайшего поезда.
Where should we get off?|Где нам нужно выйти?|Спроси о нужной остановке.
Do we need to change trains?|Нам нужно пересаживаться на другой поезд?|Уточни, есть ли пересадка.
Please take us to this address.|Отвезите нас по этому адресу, пожалуйста.|Покажи адрес водителю такси.
How much will the journey cost?|Сколько будет стоить поездка?|Узнай стоимость поездки заранее.
Could you stop here, please?|Вы могли бы остановиться здесь?|Попроси водителя остановиться.
`],
    ['directions','Ориентирование в городе','compass','Адреса, расстояния и доступный маршрут','Go straight — иди прямо; turn left/right — поверни налево/направо.',`
Excuse me, how do I get to the station?|Извините, как добраться до вокзала?|Попроси показать дорогу к вокзалу.
Is it within walking distance?|Туда можно дойти пешком?|Узнай, реально ли дойти без транспорта.
Could you show me on the map?|Вы могли бы показать мне на карте?|Попроси отметить место на карте.
Go straight ahead.|Идите прямо.|Объясни, что нужно двигаться прямо.
Turn left at the traffic lights.|Поверните налево на светофоре.|Объясни поворот налево у светофора.
Turn right after the bridge.|Поверните направо после моста.|Объясни поворот после моста.
It is opposite the supermarket.|Это напротив супермаркета.|Укажи место напротив магазина.
How far is it from here?|Как далеко это отсюда?|Спроси о расстоянии.
Is there a step-free entrance?|Есть вход без ступенек?|Найди вход, подходящий для коляски.
I think we are lost.|Кажется, мы заблудились.|Сообщи, что вы потеряли дорогу.
`],
    ['rental','Аренда и прокат','cycle','Велосипед, оборудование и семейная аренда','Deposit — залог; rental — аренда. Вопросы об автомобиле можно помогать задавать взрослым.',`
We would like to rent two bicycles.|Мы хотели бы взять напрокат два велосипеда.|Закажи велосипеды для прогулки.
How much is it per hour?|Сколько это стоит в час?|Уточни почасовую стоимость проката.
Is a helmet included?|Шлем включён в стоимость?|Узнай, выдадут ли шлем вместе с велосипедом.
Do we need to leave a deposit?|Нужно оставить залог?|Уточни, требуется ли залог.
When do we have to return it?|Когда мы должны это вернуть?|Узнай крайнее время возврата вещи.
Where should we return it?|Где мы должны это вернуть?|Уточни место возврата проката.
Is insurance included?|Страховка включена?|Узнай о включённой страховке при аренде.
My father would like to rent a car.|Мой папа хотел бы арендовать машину.|Помоги папе начать разговор об аренде.
Are there any extra charges?|Есть дополнительные платежи?|Уточни, что оплачивается дополнительно.
There is a scratch here already.|Здесь уже есть царапина.|Покажи повреждение до начала аренды.
`],
    ['money','Деньги и оплата','coin','Карта, наличные и ошибки в счёте','Cash — наличные; receipt — чек. How much…? — вопрос о стоимости.',`
Can I pay by card?|Можно оплатить картой?|Уточни, принимают ли банковские карты.
Do you accept cash?|Вы принимаете наличные?|Спроси о возможности оплаты наличными.
Where is the nearest cash machine?|Где ближайший банкомат?|Найди банкомат.
What is the exchange rate?|Какой обменный курс?|Узнай курс перед обменом валюты.
Is there a fee?|Есть комиссия?|Уточни комиссию за операцию.
Could I have a receipt, please?|Можно мне чек?|Попроси чек после оплаты.
I think there is a mistake in the bill.|Кажется, в счёте ошибка.|Вежливо укажи на неправильную сумму.
The payment hasn't gone through.|Платёж не прошёл.|Сообщи о неудачной оплате.
Could you check the amount, please?|Вы могли бы проверить сумму?|Попроси сверить сумму платежа.
How much is it altogether?|Сколько это стоит всего?|Узнай общую стоимость покупки.
`],
    ['shopping','Покупки и супермаркет','case','Размеры, цены, возврат и продукты','Try on — примерить; size — размер; refund — возврат денег.',`
How much does this cost?|Сколько это стоит?|Узнай цену товара без ценника.
Do you have this in a smaller size?|У вас есть это меньшего размера?|Попроси одежду поменьше.
Do you have this in a larger size?|У вас есть это большего размера?|Попроси одежду побольше.
Can I try it on?|Можно это примерить?|Спроси разрешение на примерку.
Where are the changing rooms?|Где примерочные?|Найди место для примерки.
I'm just looking, thank you.|Я просто смотрю, спасибо.|Вежливо откажись от помощи продавца.
Could I return this, please?|Можно вернуть этот товар?|Начни разговор о возврате покупки.
It doesn't fit.|Это не подходит по размеру.|Объясни причину возврата одежды.
Where can I find bottled water?|Где найти воду в бутылках?|Найди питьевую воду в супермаркете.
Could I have a bag, please?|Можно мне пакет?|Попроси пакет на кассе.
`],
    ['connection','Телефон и интернет','phone','Связь, зарядка и адрес','Charge — заряжать; charger — зарядное устройство; socket — розетка.',`
Is there free Wi-Fi here?|Здесь есть бесплатный Wi-Fi?|Узнай, можно ли подключиться бесплатно.
I can't connect to the internet.|Я не могу подключиться к интернету.|Сообщи о проблеме подключения.
Where can I buy a SIM card?|Где можно купить SIM-карту?|Найди место продажи SIM-карт.
How much data is included?|Сколько интернета включено?|Уточни объём мобильного интернета.
Does this plan include calls?|В этот тариф входят звонки?|Узнай, включены ли разговоры в тариф.
My phone battery is dead.|У моего телефона села батарея.|Объясни, почему телефон не включается.
Can I charge my phone here?|Можно здесь зарядить телефон?|Попроси разрешение подключить зарядку.
Do you have a travel adaptor?|У вас есть дорожный переходник?|Попроси переходник для местной розетки.
Could you send me the address?|Вы могли бы прислать мне адрес?|Попроси отправить адрес сообщением.
Could I use your phone to call my parents?|Можно воспользоваться вашим телефоном, чтобы позвонить родителям?|Попроси телефон для связи с родителями.
`],
    ['activities','Экскурсии и отдых','mountain','Билеты, расписание, пляж и погода','Guided tour — экскурсия с гидом; admission — вход. Opening hours — часы работы.',`
What time does the museum open?|Во сколько открывается музей?|Узнай время открытия музея.
What time does it close?|Во сколько это закрывается?|Уточни время закрытия места отдыха.
How much is admission?|Сколько стоит вход?|Спроси о стоимости входного билета.
Is there a discount for children?|Есть скидка для детей?|Узнай о детском билете.
Is there a guided tour in English?|Есть экскурсия на английском?|Найди экскурсию с англоязычным гидом.
Do we need to book in advance?|Нужно бронировать заранее?|Узнай, требуется ли предварительная запись.
Can we take photos here?|Здесь можно фотографировать?|Уточни правила фотографирования.
Where is the meeting point?|Где место встречи?|Узнай место сбора экскурсионной группы.
Is it safe to swim here?|Здесь безопасно купаться?|Спроси сотрудника о месте для купания.
What is the weather forecast for tomorrow?|Какой прогноз погоды на завтра?|Узнай прогноз перед прогулкой.
`],
    ['health','Самочувствие и аптека','shield','Как объяснить проблему и попросить помощь','Это язык общения, без выбора лекарств и дозировок. I have… — «У меня…».',`
I need a doctor.|Мне нужен врач.|Попроси медицинскую помощь.
Where is the nearest pharmacy?|Где ближайшая аптека?|Узнай, как найти аптеку.
I have a headache.|У меня болит голова.|Опиши головную боль.
I have a stomach ache.|У меня болит живот.|Опиши боль в животе.
I have a sore throat.|У меня болит горло.|Объясни, что беспокоит горло.
I have a fever.|У меня повышенная температура.|Сообщи о повышенной температуре.
I hurt my ankle.|Я повредил лодыжку.|Объясни, где травма после падения.
I am allergic to this medicine.|У меня аллергия на это лекарство.|Предупреди о лекарственной аллергии.
Here are my insurance details.|Вот данные моей страховки.|Покажи сведения о страховом полисе.
Please call my parents.|Пожалуйста, позвоните моим родителям.|Попроси связаться с родителями.
`],
    ['help','Если нужна срочная помощь','shield','Потерялся, документы и обращение к сотрудникам','Короткие ясные фразы помогут объяснить ситуацию сотруднику, полиции или врачу.',`
Please help me.|Пожалуйста, помогите мне.|Быстро попроси о помощи.
I can't find my parents.|Я не могу найти родителей.|Объясни сотруднику, что не можешь найти родителей.
I am thirteen years old.|Мне тринадцать лет.|Сообщи свой возраст.
Could you call the police, please?|Вы могли бы вызвать полицию?|Попроси вызвать полицию.
Please call an ambulance.|Пожалуйста, вызовите скорую помощь.|Попроси срочную медицинскую помощь.
I have lost my passport.|Я потерял паспорт.|Сообщи о пропаже паспорта.
My phone has been stolen.|Мой телефон украли.|Объясни, что телефон похищен.
Where is the nearest police station?|Где ближайший полицейский участок?|Найди место для обращения в полицию.
I need to contact my embassy.|Мне нужно связаться с моим посольством.|Попроси помочь связаться с посольством.
This is my parent's phone number.|Это номер телефона одного из моих родителей.|Покажи сотруднику номер для связи с семьёй.
`],
    ['plans','Планы и бронирование','clock','Дата, время, изменения и отмена','Cancel — отменить; change — изменить; confirm — подтвердить.',`
Is there anything available for tomorrow?|Есть что-нибудь свободное на завтра?|Узнай о свободных местах на завтра.
We would like to book for Saturday.|Мы хотели бы забронировать на субботу.|Назови день бронирования.
Can we change the date?|Мы можем изменить дату?|Попроси перенести бронь на другую дату.
Can we change the time?|Мы можем изменить время?|Попроси другое время бронирования.
We need to cancel our booking.|Нам нужно отменить нашу бронь.|Сообщи об отмене бронирования.
Can we get a refund?|Мы можем получить возврат денег?|Узнай о возврате после отмены.
Could you confirm our booking?|Вы могли бы подтвердить нашу бронь?|Проверь, зарегистрирована ли бронь.
Is that in the morning or in the evening?|Это утром или вечером?|Уточни, о какой части дня идёт речь.
We are running late.|Мы опаздываем.|Предупреди о задержке.
We will be there in ten minutes.|Мы будем там через десять минут.|Сообщи, когда вы прибудете.
`],
    ['homeward','Обратная дорога','route','Выезд, трансфер и возвращение','Check out — выехать из отеля. Departure — отправление; arrivals — прибытие.',`
We would like to check out, please.|Мы хотели бы выехать из отеля.|Сообщи на стойке о выезде.
Could we check the bill together?|Мы могли бы вместе проверить счёт?|Сверь итоговый счёт отеля.
Could you book a taxi to the airport?|Вы могли бы заказать такси до аэропорта?|Попроси отель вызвать такси.
How long does it take to get to the airport?|Сколько времени занимает дорога до аэропорта?|Рассчитай время на дорогу.
Which terminal do we need?|Какой терминал нам нужен?|Уточни терминал обратного рейса.
Where is the departures area?|Где зона вылета?|Найди зону отправления в аэропорту.
Our flight has been cancelled.|Наш рейс отменили.|Объясни ситуацию сотруднику авиакомпании.
Could you help us find another flight?|Вы могли бы помочь найти другой рейс?|Попроси помощь после отмены рейса.
Where is the airport shuttle stop?|Где остановка аэропортового шаттла?|Найди автобус между аэропортом и городом.
We had a wonderful holiday.|У нас был замечательный отпуск.|Расскажи о поездке по возвращении.
`]
  ];
  const topics = source.map(([id,title,icon,description,tip,rows]) => ({id,title,icon,description,tip,
    phrases: rows.trim().split('\n').map((line,i) => {
      const [en,ru,situation] = line.trim().split('|');
      return {id:`trip-${id}-${String(i+1).padStart(2,'0')}`,en,ru,situation};
    })
  }));
  const tasks = topics.flatMap(topic => topic.phrases.flatMap((p,i) => {
    const others = [1,3,6].map(offset=>topic.phrases[(i+offset)%topic.phrases.length]);
    const base = {phraseId:p.id,topic:topic.id,en:p.en,ru:p.ru,speechText:p.en,explanation:`${p.en} — ${p.ru} ${topic.tip}`,travel:true};
    return [
      {...base,id:p.id+'-meaning',type:'choice',prompt:'Выбери перевод',display:p.en,options:[p.ru,...others.map(x=>x.ru)],answer:p.ru},
      {...base,id:p.id+'-situation',type:'choice',prompt:'Что скажешь в этой ситуации?',display:p.situation,reverse:true,options:[p.en,...others.map(x=>x.en)],answer:p.en},
      {...base,id:p.id+'-build',type:'order',prompt:'Собери фразу для поездки',display:p.ru,tokens:p.en.replace(/[.!?,]/g,'').split(/\s+/),answer:p.en}
    ];
  }));
  window.TravelContent = {version:1,topics,tasks};
})();
