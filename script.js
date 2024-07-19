document.addEventListener('DOMContentLoaded', function() {
    const mosquitoes = document.querySelectorAll('.mosquito');
    const contentBoxes = document.querySelectorAll('.Content-Box');
    const lifecycleItems = document.querySelectorAll('.lifecycle-item');
    const closeBtns = document.querySelectorAll('.close-btn');

    mosquitoes.forEach(mosquito => {
        mosquito.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            contentBoxes.forEach(box => {
                if (box.id === targetId) {
                    box.classList.remove('hidden');
                    box.scrollIntoView({ behavior: 'smooth' });
                } else if (box.id !== 'main-content' && box.id !== 'game') {
                    box.classList.add('hidden');
                }
            });
        });
    });

    lifecycleItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const overlay = document.getElementById(targetId);
            if (overlay) {
                overlay.classList.remove('overlay-hidden');
                overlay.classList.add('overlay');
            }
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const overlay = this.closest('.overlay');
            if (overlay) {
                overlay.classList.remove('overlay');
                overlay.classList.add('overlay-hidden');
            }
        });
    });
});




document.addEventListener('DOMContentLoaded', function() {
    const blockSteps = document.querySelectorAll('#block-steps li');
    const mosquitoSound = document.getElementById('mosquito1');

    blockSteps.forEach(step => {
        step.addEventListener('click', function() {
            // Check if the text is already revealed
            if (this.classList.contains('revealed')) {
                return;
            }

            const fullText = this.getAttribute('data-fulltext');
            this.innerHTML = `<span class="reveal-text">${fullText}</span>`;
            this.classList.add('revealed');
            
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const dengueForm = document.getElementById('dengue-form');
    const resultSection = document.getElementById('result');
    const resultMessage = document.getElementById('result-message');
    const mosquitoSound = document.getElementById('mosquito1');
    const clearButton = document.getElementById('clear-button');
    const questions = document.querySelectorAll('.form-group');
    const warningMessage = document.createElement('p');

    warningMessage.innerText = "Please answer all the questions.";
    warningMessage.style.color = "red";
    warningMessage.style.display = "none";
    dengueForm.insertBefore(warningMessage, dengueForm.firstChild);

    dengueForm.addEventListener('submit', function(event) {
        event.preventDefault();

        let allAnswered = true;
        questions.forEach((question) => {
            const inputs = question.querySelectorAll('input[type="radio"]');
            const answered = Array.from(inputs).some(input => input.checked);
            if (!answered) {
                allAnswered = false;
            }
        });

        if (!allAnswered) {
            warningMessage.style.display = "block";
            return;
        } else {
            warningMessage.style.display = "none";
        }

        let score = 0;
        const formData = new FormData(dengueForm);
        for (let value of formData.values()) {
            if (value === 'yes') {
                score++;
            }
        }

        resultSection.classList.remove('hidden');

        if (score >= 3) {
            resultMessage.innerText = "You have several symptoms of dengue. Please seek medical advice immediately.";
            resultMessage.style.color = "red";
        } else {
            resultMessage.innerText = "You have few or no symptoms of dengue. However, stay alert and consult a doctor if you feel unwell.";
            resultMessage.style.color = "green";
        }

        mosquitoSound.play();
    });

    clearButton.addEventListener('click', function() {
        dengueForm.reset();
        resultSection.classList.add('hidden');
        resultMessage.innerText = '';
        warningMessage.style.display = "none";
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.getElementById('play-button');
    const mainContent = document.getElementById('main-content');
    const gameSection = document.getElementById('game');
    const gameArea = document.getElementById('game-area');
    const timeLeftDisplay = document.getElementById('time-left');
    const killCountDisplay = document.getElementById('kill-count');
    const mosquitoSound = document.getElementById('mosquito1');
    const gameOverMessage = document.getElementById('game-over-message');

    let timer;
    let timeLeft = 30;
    let killCount = 0;
    let mosquitoes = [];
    let gamePlayed = false;

    playButton.addEventListener('click', function() {
        mainContent.classList.add('hidden');
        gameSection.classList.remove('hidden');
        startGame();
    });

    function startGame() {
        timeLeft = 30;
        killCount = 0;
        timeLeftDisplay.textContent = timeLeft;
        killCountDisplay.textContent = killCount;
        spawnMosquitoes();
        timer = setInterval(gameTick, 1000);
    }

    function gameTick() {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }

    function endGame() {
        clearInterval(timer);
        gamePlayed = true;
        gameOverMessage.textContent = 'Game Over! You killed ' + killCount + ' mosquitoes.';
        gameSection.classList.add('hidden');
        mainContent.classList.remove('hidden');
        gameOverMessage.classList.remove('hidden');
        gameArea.innerHTML = ''; // Clear mosquitoes
        mosquitoes = [];
    }

    function spawnMosquitoes() {
        const mosquitoCount = mosquitoes.length;
        const newMosquitoes = Math.min(2 - mosquitoCount, 3);

        for (let i = 0; i < newMosquitoes; i++) {
            const mosquito = document.createElement('div');
            mosquito.classList.add('game_mosquito');
            mosquito.style.top = Math.random() * (gameArea.clientHeight - 50) + 'px';
            mosquito.style.left = Math.random() * (gameArea.clientWidth - 50) + 'px';
            mosquito.addEventListener('click', function(event) {
                killCount++;
                killCountDisplay.textContent = killCount;
                mosquitoSound.play();
                createBloodStain(event.clientX, event.clientY, gameArea);
                mosquito.remove();
                mosquitoes = mosquitoes.filter(m => m !== mosquito);
                spawnMosquitoes();
            });
            gameArea.appendChild(mosquito);
            mosquitoes.push(mosquito);
            moveMosquito(mosquito);
        }

        setTimeout(spawnMosquitoes, 1000); // Check to spawn new mosquitoes every second
    }

    function moveMosquito(mosquito) {
        function updatePosition() {
            const deltaX = (Math.random() - 0.5) * 50; // Random delta x between -25 and 25
            const deltaY = (Math.random() - 0.5) * 50; // Random delta y between -25 and 25
            let newX = parseFloat(mosquito.style.left) + deltaX;
            let newY = parseFloat(mosquito.style.top) + deltaY;

            // Ensure the mosquito stays within the game area
            if (newX < 0) newX = 0;
            if (newX > gameArea.clientWidth - 50) newX = gameArea.clientWidth - 50;
            if (newY < 0) newY = 0;
            if (newY > gameArea.clientHeight - 50) newY = gameArea.clientHeight - 50;

            mosquito.style.left = newX + 'px';
            mosquito.style.top = newY + 'px';

            requestAnimationFrame(updatePosition);
        }

        requestAnimationFrame(updatePosition);
    }

    function createBloodStain(x, y, container) {
        const rect = container.getBoundingClientRect();
        const offsetX = x - rect.left;
        const offsetY = y - rect.top;

        const bloodStain = document.createElement('div');
        bloodStain.classList.add('blood-stain');
        bloodStain.style.left = `${offsetX - 25}px`; // Center the blood stain on the click
        bloodStain.style.top = `${offsetY - 25}px`;
        gameArea.appendChild(bloodStain);

        // Optionally, remove the blood stain after some time
        setTimeout(() => bloodStain.remove(), 5000);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    function checkTimelineItems() {
        const triggerBottom = window.innerHeight * 0.8;
        timelineItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < triggerBottom) {
                item.classList.add('show');
            } else {
                item.classList.remove('show');
            }
        });
    }

    window.addEventListener('scroll', checkTimelineItems);
    checkTimelineItems(); 

});

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger-menu');
    const navigationBar = document.getElementById('navigation-bar');

    hamburger.addEventListener('click', function() {
        navigationBar.classList.toggle('hidden');
        const featuredMosquito = navigationBar.querySelector('.featured-mosquito');
        if (featuredMosquito) {
            featuredMosquito.classList.toggle('hidden');
        }
    });
});