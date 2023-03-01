document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  const section = document.createElement('section');
  const main = document.createElement('main');
  const resBtn = document.createElement('button');
  let timerGame;

  container.classList.add('container');
  section.classList.add('section');

  document.body.appendChild(section);
  section.append(container);
  section.append(createTitle('Угадай карту'));
  document.body.append(main);
  main.append(container);

  let gameList = createGameList();
  main.append(gameList);

  function createTitle(title) {
    const appTitle = document.createElement('h1');
    appTitle.classList.add('section__title', 'mb-3');
    appTitle.textContent = title;
    return appTitle;
  }

  function createCardArray(count) {
    let cardsNumbers = [1, 2, 3, 4, 5];

    switch (count) {
      case 2:
        return cardsNumbers.slice(0, 1);
      case 4:
        return cardsNumbers.slice(0, 2);
      case 6:
        return cardsNumbers.slice(0, 3);
      case 8:
        return cardsNumbers.slice(0, 4);
      case 10:
        return cardsNumbers;
      default:
        break;
    }
  }

  function duplicateArrayCards(array) {
    return array.reduce((a, i) => a.concat(i, i), []);
  }

  function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }


  function createGameList() {
    const supTitle = document.createElement('h2');
    const deskBox = document.createElement('div');
    const gameGrid = document.createElement('div');
    const timerContainer = document.createElement('div');
    const error = document.createElement('span');

    supTitle.textContent = 'Сложность';

    supTitle.classList.add('content__title', 'mb-3');
    deskBox.classList.add('container');
    gameGrid.classList.add('content');
    timerContainer.classList.add('timer');
    error.classList.add('error');

    function creatButtonMenu() {
      const btn = document.createElement('btn');
      const inp = document.createElement('input');

      btn.classList.add('btn', 'btn-lg', 'btn-primary');
      inp.classList.add('inp', 'form-control', 'mb-3');

      btn.textContent = 'Начать игру';

      inp.setAttribute('type', 'text');
      inp.setAttribute('value', '');

      btn.addEventListener('click', () => {
        console.log('click');
        error.innerHTML = '';
        timerContainer.innerHTML = 60;

        let qty = Number(inp.value);
        if (qty >= 2 && qty <= 10 && qty % 2 === 0) {
          gameStart(qty);
          document.querySelector('.container').append(timerContainer);
          clearInterval(timerGame);
          timerGame = setInterval(valueTimer, 1000);
          inp.value = '';
        } else {
          error.innerHTML = 'Укажите число от 2 до 10 кратное двум';
          inp.value = 4;
        }
      });

      function valueTimer() {
        if (timerContainer.innerHTML > 0) {
          timerContainer.innerHTML--;
        } else {
          clearInterval(timerGame);
          deskBox.innerHTML = '';
          document.querySelector('.container').innerHTML = '';
          deskBox.append(resBtn);
          resBtn.addEventListener('click', () => {
            deskBox.innerHTML = '';
            deskBox.append(createGameList());
          });
        }
      }

      return {
        btn,
        inp
      };
    }
    let ButtonMenu = creatButtonMenu();

    deskBox.append(gameGrid);
    gameGrid.append(
      supTitle,
      error,
      ButtonMenu.inp,
      ButtonMenu.btn
    );

    return deskBox;
  }

  function createGameCard(front, back) {
    const card = document.createElement('div');
    card.classList.add('item__card');

    const notCardFlip = document.createElement('i');
    const cardFlip = document.createElement('i');

    notCardFlip.classList.add(`${front}`, 'Secondary');
    cardFlip.classList.add(`${back}`, 'Light');

    notCardFlip.textContent = '';
    cardFlip.textContent = `${back}`;

    card.append(cardFlip, notCardFlip);

    return card;
  }

  function gameStart(qty) {
    let firstCard, secondCard;
    let click = true;

    const desksBox = document.querySelector('.content');
    const gameTable = document.createElement('div');
    const cardsNumb = createCardArray(qty);
    const duplArray = duplicateArrayCards(cardsNumb);

    gameTable.classList.add('item__table');
    resBtn.classList.add('btn', 'btn-primary', 'btn-lg', 'btn-restart');

    desksBox.innerHTML = '';
    resBtn.textContent = 'Сыграть ещё раз';

    shuffle(duplArray);

    duplArray.forEach(el => gameTable.append(createGameCard('not-flip', el)));

    desksBox.append(gameTable);

    const items = document.querySelectorAll('.item__card');

    resBtn.addEventListener('click', () => {
      clearInterval(timerGame);
      desksBox.innerHTML = '';
      document.querySelector('.container').innerHTML = '';
      desksBox.append(createGameList());
    });

    items.forEach((item, index) => item.addEventListener('click', () => {
      if (click == true && !item.classList.contains('success')) {
        item.classList.add('flip');

        if (firstCard == null) {
          firstCard = index;
        } else {
          if (index != firstCard) {
            secondCard = index;
            click = false;
          }
        }

        if (firstCard != null && secondCard != null && firstCard != secondCard) {
          if (
            items[firstCard].firstElementChild.className ===
            items[secondCard].firstElementChild.className
          ) {
            setTimeout(() => {
              items[firstCard].classList.add('success');
              items[secondCard].classList.add('success');

              firstCard = null;
              secondCard = null;
              click = true;
            }, 700);
          } else {
            setTimeout(() => {
              items[firstCard].classList.remove('flip');
              items[secondCard].classList.remove('flip');

              firstCard = null;
              secondCard = null;
              click = true;
            }, 500);
          }
        }
        if (Array.from(items).every(item => item.className.includes('flip'))) {
          clearInterval(timerGame);
          desksBox.append(resBtn);
          resBtn.addEventListener('click', () => {
            desksBox.innerHTML = '';
            document.querySelector('.container').innerHTML = '';
            desksBox.append(createGameList());
          });
        }
      }
    }));
  }
});



