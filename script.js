document.addEventListener('DOMContentLoaded', function() {
    var mosquitoes = document.querySelectorAll('.mosquito');
    var contentBoxes = document.querySelectorAll('.Content-Box');
    var lifecycleItems = document.querySelectorAll('.lifecycle-item');
    var closeBtns = document.querySelectorAll('.close-btn');

    mosquitoes.forEach(function(mosquito) {
        mosquito.addEventListener('click', function() {
            var targetId = this.getAttribute('data-target');
            contentBoxes.forEach(function(box) {
                if (box.id === targetId) {
                    box.classList.remove('hidden');
                    box.scrollIntoView({
                        behavior: 'smooth'
                    });
                } else if (box.id !== 'main-content' && box.id !== 'game') {
                    box.classList.add('hidden');
                }
            });
        });
    });

    lifecycleItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var targetId = this.getAttribute('data-target');
            var overlay = document.getElementById(targetId);
            if (overlay) {
                overlay.classList.remove('overlay-hidden');
                overlay.classList.add('overlay');
            }
        });
    });

    closeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var overlay = this.closest('.overlay');
            if (overlay) {
                overlay.classList.remove('overlay');
                overlay.classList.add('overlay-hidden');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var blockSteps = document.querySelectorAll('#block-steps li');

    blockSteps.forEach(function(step) {
        step.addEventListener('click', function() {
            if (this.classList.contains('revealed')) {
                return;
            }

            var fullText = this.getAttribute('data-fulltext');
            this.innerHTML = '<span class="reveal-text">' + fullText + '</span>';
            this.classList.add('revealed');
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var dengueForm = document.getElementById('dengue-form');
    var resultSection = document.getElementById('result');
    var resultMessage = document.getElementById('result-message');
    var clearButton = document.getElementById('clear-button');
    var questions = document.querySelectorAll('.form-group');
    var warningMessage = document.createElement('p');

    warningMessage.innerText = "Please answer all the questions.";
    warningMessage.style.color = "red";
    warningMessage.style.display = "none";
    dengueForm.insertBefore(warningMessage, dengueForm.firstChild);

    dengueForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var allAnswered = true;
        questions.forEach(function(question) {
            var inputs = question.querySelectorAll('input[type="radio"]');
            var answered = Array.prototype.some.call(inputs, function(input) {
                return input.checked;
            });
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

        var score = 0;
        var formData = new FormData(dengueForm);
        formData.forEach(function(value) {
            if (value === 'yes') {
                score++;
            }
        });

        resultSection.classList.remove('hidden');

        if (score >= 3) {
            resultMessage.innerText = "You have several symptoms of dengue. Please seek medical advice immediately.";
            resultMessage.style.color = "red";
        } else {
            resultMessage.innerText = "You have few or no symptoms of dengue. However, stay alert and consult a doctor if you feel unwell.";
            resultMessage.style.color = "green";
        }

        // Scroll to the result section
        resultSection.scrollIntoView({ behavior: 'smooth' });
    });

    clearButton.addEventListener('click', function() {
        dengueForm.reset();
        resultSection.classList.add('hidden');
        resultMessage.innerText = '';
        warningMessage.style.display = "none";
    });
});


document.addEventListener('DOMContentLoaded', function() {
    var playButton = document.getElementById('play-button');
    var mainContent = document.getElementById('main-content');
    var gameSection = document.getElementById('game');
    var gameArea = document.getElementById('game-area');
    var timeLeftDisplay = document.getElementById('time-left');
    var killCountDisplay = document.getElementById('kill-count');
    var mosquitoSound = document.getElementById('mosquito1');
    var gameOverMessage = document.getElementById('game-over-message');

    var timer;
    var timeLeft = 30;
    var killCount = 0;
    var mosquitoes = [];
    var gamePlayed = false;

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
        exitFullscreen();
        stopMosquitoSound();
    }

    function stopMosquitoSound() {
        mosquitoSound.pause();
        mosquitoSound.currentTime = 0;
    }

    function spawnMosquitoes() {
        var mosquitoCount = mosquitoes.length;
        var newMosquitoes = Math.min(2 - mosquitoCount, 3);

        for (var i = 0; i < newMosquitoes; i++) {
            var mosquito = document.createElement('div');
            mosquito.classList.add('game_mosquito');
            mosquito.style.top = (Math.random() * (gameArea.clientHeight - 50)) + 'px';
            mosquito.style.left = (Math.random() * (gameArea.clientWidth - 50)) + 'px';
            mosquito.addEventListener('click', handleMosquitoClick.bind(null, mosquito)); // Allows Mosquitoes to pass straight to the handleMosquito since eventlistiners only receives it
            gameArea.appendChild(mosquito);
            mosquitoes.push(mosquito);
            moveMosquito(mosquito);
        }

        setTimeout(spawnMosquitoes, 1000);
    }

    function handleMosquitoClick(mosquito, event) {
        killCount++;
        killCountDisplay.textContent = killCount;
        mosquitoSound.play();
        createBloodStain(event.clientX, event.clientY, gameArea);
        mosquito.remove();
        mosquitoes = mosquitoes.filter(function(m) {
            return m !== mosquito;
        });
        spawnMosquitoes();
    }

    function moveMosquito(mosquito) {
        function updatePosition() {
            var deltaX = (Math.random() - 0.5) * 50;
            var deltaY = (Math.random() - 0.5) * 50;
            var newX = parseFloat(mosquito.style.left) + deltaX;
            var newY = parseFloat(mosquito.style.top) + deltaY;

            // Ensure it stays within the game area
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
        var rect = container.getBoundingClientRect();
        var offsetX = x - rect.left;
        var offsetY = y - rect.top;

        var bloodStain = document.createElement('div');
        bloodStain.classList.add('blood-stain');
        bloodStain.style.left = (offsetX - 25) + 'px';
        bloodStain.style.top = (offsetY - 25) + 'px';
        gameArea.appendChild(bloodStain);

        // remove the blood stain after some time
        setTimeout(function() {
            bloodStain.remove();
        }, 5000);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var timelineItems = document.querySelectorAll('.timeline-item');

    function checkTimelineItems() {
        var triggerBottom = window.innerHeight * 0.8;
        timelineItems.forEach(function(item) {
            var itemTop = item.getBoundingClientRect().top;
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
    var hamburger = document.getElementById('hamburger-menu');
    var navigationBar = document.getElementById('navigation-bar');

    hamburger.addEventListener('click', function() {
        navigationBar.classList.toggle('hidden');
        var featuredMosquito = navigationBar.querySelector('.featured-mosquito');
        if (featuredMosquito) {
            featuredMosquito.classList.toggle('hidden');
        }
    });
});

function enterFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { // Firefox
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, and Opera
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
        document.documentElement.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    function toggleFullscreen() {
        if (!document.fullscreenElement &&
            !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            enterFullscreen();
        } else {
            exitFullscreen();
        }
    }

    var fullscreenButton = document.getElementById('fullscreen-button');
    fullscreenButton.addEventListener('click', toggleFullscreen);
});
