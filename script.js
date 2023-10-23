const gameBoard = document.getElementById('game-board');
const messageDiv = document.getElementById('message');
const heroSpeechDiv = document.getElementById('hero-speech');

let currentRound = 1;
let selectedCard = null;
let cardData = [];

// Fetch card data from JSON file
fetch('cards.json')
    .then(response => response.json())
    .then(data => {
        cardData = data;
        displayCards(); // Call displayCards after data is fetched
    })
    .catch(error => console.error('Error fetching card data:', error));

// Fetch card data from JSON file
fetch('cardData.json')
    .then(response => response.json())
    .then(data => {
        cardData = data;
        displayCards(); // Call displayCards after data is fetched
    })
    .catch(error => console.error('Error fetching card data:', error));


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function displayCards() {
    gameBoard.innerHTML = '';
    
    const hieroglyphContainer = document.createElement('div');
    const emojiContainer = document.createElement('div');
    
    hieroglyphContainer.classList.add('card-container');
    emojiContainer.classList.add('card-container');
    
    gameBoard.appendChild(hieroglyphContainer);
    gameBoard.appendChild(emojiContainer);

    const selectedCards = shuffleArray(cardData).slice(0, currentRound);
    const shuffledHieroglyphs = shuffleArray([...selectedCards]);
    const shuffledEmojis = shuffleArray([...selectedCards]);
    
    shuffledHieroglyphs.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card', 'hieroglyph-card');
        cardElement.innerText = card.h;
        cardElement.style.color = getRandomColor();
        hieroglyphContainer.appendChild(cardElement);
    });

    shuffledEmojis.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card', 'emoji-card');
        cardElement.innerText = card.e;
        cardElement.setAttribute('title', card.c); // Set the title attribute to the "c" key text
        emojiContainer.appendChild(cardElement);
    });    
    
}

gameBoard.addEventListener('click', (e) => {
    const card = e.target;
    if (!card.classList.contains('card')) return;

    if (selectedCard) {
        if ((selectedCard.classList.contains('hieroglyph-card') && card.classList.contains('emoji-card') && selectedCard.innerText === cardData.find(data => data.e === card.innerText).h) ||
            (selectedCard.classList.contains('emoji-card') && card.classList.contains('hieroglyph-card') && card.innerText === cardData.find(data => data.e === selectedCard.innerText).h)) {
            selectedCard.style.display = 'none';
            card.style.display = 'none';
            selectedCard = null;
        } else {
            selectedCard.style.transform = 'scale(1)'; // Reset the size of the previously selected card
            selectedCard = null;
        }
    } else {
        selectedCard = card;
        selectedCard.style.transform = 'scale(1.1)'; // Increase the size of the selected card
    }

    const remainingCards = document.querySelectorAll('.card:not([style*="display: none"])');
    if (remainingCards.length === 0) {
        currentRound++;
        if (currentRound > 7) {
            messageDiv.innerText = 'Congratulations! You completed all rounds!';
            currentRound = 1;
        } else {
            messageDiv.innerText = `Round ${currentRound} started!`;
        }
        displayCards();
    }
});



displayCards();
