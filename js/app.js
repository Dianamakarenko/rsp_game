document.addEventListener('DOMContentLoaded', function () {

    const countUser = document.querySelector('.count-user');
    const countComp = document.querySelector('.count-comp');
    let userField = document.querySelector('.user-field');
    let compField = document.querySelector('.comp-field');
    let sound = document.querySelector('.sound');
    let res = document.querySelector('.result');
    let clear = document.querySelector('.clear-score');
    let startGameButton = document.querySelector('.start-game');
    let timer = document.querySelector('.timer');
    let oneSecond = 1000;
    let volumeButtons = document.querySelectorAll('.game .volume .button');
    let volumeOffButton = document.querySelector('.game .volume .button.off');

    let userStep, compStep, countU = 0, countC = 0, blocked = true; 

    function choiceUser (e) {
        if (blocked) return;
        blocked = true;
        let target = e.target;
        if (target.classList.contains('field')){
            let fields = document.querySelectorAll('.field');
            fields.forEach(item => item.classList.remove('active', 'error'));
            userStep = target.dataset.field;
            target.classList.add('active');
        }
    }

    function choiceComp() {
        let rand = Math.floor(Math.random() * 3);
        let fields = compField.querySelectorAll('.field');
        compField.classList.add('blink');
        setTimeout(() => {
            compField.classList.remove('blink');
            compStep = fields[rand].dataset.field;
            fields.forEach(item => item.classList.remove('active'));
            fields[rand].classList.add('active')
            winner();
        }, oneSecond * 3);
    }


    function winner () {
        let combination = userStep + compStep;
        switch (combination) {

            case 'rr' :
            case 'ss' :
            case 'pp' :
                draw();
                break;  

            case 'rs' :
            case 'sp' :
            case 'pr' :
                userWin();
                break;

            case 'sr' :
            case 'ps' :
            case 'rp' :
                computerWin();
                break;  
            default:
                break;
        }

    }

    function userWin () {
        res.innerText = 'Winning!';
        playSound('audio/win.mp3');
        countU++;
        countUser.innerText = countU;
        compField.querySelector('[data-field='+compStep+']').classList.add('error');

    }

    function draw () {
        res.innerText = 'Draw!';
        playSound('audio/draw.mp3');
    }

    function computerWin () {
        res.innerText = 'Losing!';
        playSound('audio/loss.mp3');
        countC++;
        countComp.innerText = countC;
        if (userStep) {
            userField.querySelector('[data-field='+userStep+']').classList.add('error');            
        }
    }

    function clearGame () {
        blocked =true
        countU = countC = 0;
        res.innerText = 'Make a choice';
        countUser.innerText = '0';
        countComp.innerText = '0';
        let fields = document.querySelectorAll('.field');
        fields.forEach(item => item.classList.remove('active' , 'error'));
    }

    function startGame () {
        timer.innerText = 3;
        blocked = false;
        res.innerText = 'Make a choice';
        userStep = null;
        playSound('audio/timer.mp3');
        let fields = document.querySelectorAll('.field');
        fields.forEach(item => item.classList.remove('active' , 'error'));
        startGameButton.setAttribute('disabled', true);
        choiceComp();
        decreaseTimer();
    }

    function decreaseTimer () {
        setTimeout(function () {
            timer.innerText = parseInt(timer.innerText) - 1; 
            if (parseInt(timer.innerText) > 0) {
                decreaseTimer();
            } else {
                blocked = true;
                startGameButton.removeAttribute('disabled');
                if (!userStep) {
                    computerWin();
                }
            }
        }, oneSecond);
    }

    function changeVolume (event) {
        event.target.classList.add('hidden');
        sound.pause()
        if (event.target.classList.contains('up')) {
            event.target.nextElementSibling.classList.remove('hidden');
        } else {
            event.target.previousElementSibling.classList.remove('hidden');
        }
    }

    function playSound (path) {
        if (volumeOffButton.classList.contains('hidden')) {
            sound.setAttribute('src' , path);
            sound.play();
        } 
    }

    clear.addEventListener('click', clearGame);
    userField.addEventListener('click', choiceUser);
    startGameButton.addEventListener('click', startGame);
    for (i = 0; i < volumeButtons.length; i++) {
        volumeButtons[i].addEventListener('click', changeVolume);
    }

});

