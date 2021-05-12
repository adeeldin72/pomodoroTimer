
//namespace
const pomodoroApp = {
    //loading bar variables 
    bar1: new ldBar("#myItem1"),
    bar2: document.getElementById('myItem1').ldBar,

    //variable used to hold autoplay
    autoPlay: true,

    //variables used to track breaks
    isBreak: false,
    takenBreaks: 0,
    breakTime: 300, //default of 5 minutes in seconds
    breakTimeLong: 900, //default of 15 minutes in seconds

    //variables used to hold currentTime
    t: undefined,
    currentTime: 0,

    //variable used to hold study time with default of 25 minutes in seconds
    studyTime: 1500,

    //variable used to hold modal div
    modal: document.getElementById("myModal"),

    //variable used to contain audio element
    audioContainer: document.getElementById("audioContainer"),

    //Default time functions used to set default times
    set25Timer: function () {
        $('#studyTime').val(25);
        $('#breakTime').val(5);
        $('#longBreakTime').val(15);

    },

    set15Timer: function () {
        $('#studyTime').val(15);
        $('#breakTime').val(3);
        $('#longBreakTime').val(10);
    },

    set10Timer: function () {
        $('#studyTime').val(10);
        $('#breakTime').val(2);
        $('#longBreakTime').val(5);

    },

    //function to play sound
    playSound: function () {
        this.audioContainer.loop = false;
        this.audioContainer.play();

    }


};

//document is ready
$(function () {


    //function used to start timer
    pomodoroApp.startTimer = function () {
        //hide start button
        $('.start').hide();
        //show stop button
        $('.stop').show();
        // initiate time at zero seconds
        let time = 0;
        //initiate the string used to display what pomodoro section you are in as an empty string
        let studyOrBreak = '';

        //if any value is negative reset timer to default pomodoro timer
        if (pomodoroApp.studyTime <= 0 || pomodoroApp.breakTime <= 0 || pomodoroApp.breakTimeLong <= 0) {
            pomodoroApp.studyTime = 1500; //25 minutes
            pomodoroApp.breakTime = 300; // 5 minutes
            pomodoroApp.breakTimeLong = 900; // 15 minutes
        }

        //if else statements used to determine what pomodoro section you are in and change css
        //Long Break
        if (pomodoroApp.isBreak && (pomodoroApp.takenBreaks % 4) == 0) {
            time = pomodoroApp.breakTimeLong;
            studyOrBreak = 'Long Break Time ';
            $('link[href="styles.css"]').attr('href', 'styles2.css');

            //Regular Break
        } else if (pomodoroApp.isBreak) {
            time = pomodoroApp.breakTime;
            studyOrBreak = 'Break Time ';
            $('link[href="styles.css"]').attr('href', 'styles2.css');

            //Study Time
        } else {
            time = pomodoroApp.studyTime;
            studyOrBreak = 'Study Time ';
            $('link[href="styles2.css"]').attr('href', 'styles.css');
        }

        //used to start timer and set it to variable t which is used later to cancel the timer
        pomodoroApp.t = setInterval(function () {
            pomodoroApp.currentTime++;
            //used to set the progress bar
            pomodoroApp.bar1.set(((pomodoroApp.currentTime / time) * 100));
            pomodoroApp.displayTime(studyOrBreak, time);
            pomodoroApp.isItBreak(time);

        }, 1000); //every 1 second

    }

    //function used to display the current time
    pomodoroApp.displayTime = function (value, time = 0) {
        //used to determine how many seconds are left to be displayed
        const secondsLeft = Math.round(time - pomodoroApp.currentTime);

        //variables used to hold the converted seconds left into hours minutes and seconds
        let minutes = parseInt(secondsLeft / 60) % 60;
        let seconds = secondsLeft % 60;
        let hours = parseInt(secondsLeft / 3600);

        //if statements and jquery used to display time
        if (secondsLeft >= 3600) {
            $('#time').text(value + hours + ":" + minutes + ":" + seconds);
        } else if (seconds < 10) {
            $('#time').text(value + "" + minutes + ":0" + seconds);
        } else {
            $('#time').text(value + "" + minutes + ":" + seconds);
        }
    }

    //function used to determine if it is break time
    pomodoroApp.isItBreak = function (time) {

        //current time = (how many seconds have passed since timer started) ime = (break,study,long break seconds) 

        //if currentTime is greater then or equal to required seconds and it is already break set break to false so next time startTimer is called the if statements in startTimer will run timer with studyTime
        if (pomodoroApp.currentTime >= time && pomodoroApp.isBreak) {
            pomodoroApp.isBreak = false; //set to false
            pomodoroApp.stopTimer(); //stop timer
            $('link[href="styles2.css"]').attr('href', 'styles.css'); //change css
            pomodoroApp.bar1.set(0); //set progress bar to zero
            pomodoroApp.displayTime('Study Time ',);
            if (pomodoroApp.autoPlay) { //if autoplay start timer
                pomodoroApp.startTimer();
            }
        } //if currentTime is greater then or equal to required seconds set isBreak to true so next time the if statements in startTimer will run regular break or long break
        else if (pomodoroApp.currentTime >= time) {
            pomodoroApp.isBreak = true; //set to true
            pomodoroApp.takenBreaks++; //increment taken break by 1
            pomodoroApp.stopTimer(); //stop timer
            $('link[href="styles.css"]').attr('href', 'styles2.css'); //change css
            pomodoroApp.bar1.set(0); //set progress bar to zero
            if (pomodoroApp.isBreak && (pomodoroApp.takenBreaks % 4) == 0) { //if this is the fourth break
                pomodoroApp.displayTime('Long Break Time ');
            } else {
                pomodoroApp.displayTime('Break Time ');
            }

            if (pomodoroApp.autoPlay) { //if autoplay start timer
                pomodoroApp.startTimer();
            }
        }
    }

    //function used to stop the timer
    pomodoroApp.stopTimer = function () {
        clearInterval(pomodoroApp.t); //stops timer
        pomodoroApp.currentTime = 0; //sets current time to zero
        $('.stop').hide(); //hide stop button
        $('.start').show(); //show start button
        pomodoroApp.playSound(); //play sound
    }

    //when ok button on submit popup is clicked run these things
    $("#settingSubmit").click(function (e) {
        pomodoroApp.breakTime = $('#breakTime').val() * 60; //set break time in minutes
        pomodoroApp.breakTimeLong = $('#longBreakTime').val() * 60; //set long break time in minutes
        pomodoroApp.studyTime = $('#studyTime').val() * 60; //set study time in minutes
        pomodoroApp.autoPlay = $('#autoCheck').prop('checked'); //set auto check to true or fault
        e.preventDefault(); //prevent default of submit button 
        pomodoroApp.modal.style.display = "none"; //hide modal
        $('.settingsPopup').hide(); //hide settings popup
    });

    //if settings button is clicked show settingsPopup and show modal
    $("#settingsButton").click(function () {
        $('.settingsPopup').show();
        pomodoroApp.modal.style.display = "block";
    });

    //if the x in settings button is clicked hide settingsPopup and hide modal
    $("#closeButton").click(function () {
        pomodoroApp.modal.style.display = "none";
        $('.settingsPopup').hide();
    });

    //if the create new task button is clicked create a new div element that has the relevant information
    $("#taskSubmit").click(function (e) {
        if ($('#messageContent').val()) { //only run if there is something inside for the first form element
            $(`<div class='taskInnerContent'><h4 id='pomodoroText'>${$('#messageContent').val()}</h4><h4>${$('#numberContent').val()} Pomodoro</h4></div>`).appendTo('.taskContent');
            $('.taskInput').trigger("reset");

        }
        e.preventDefault(); //stop default of submit button
    });

    //if a div with class of taskInnerContent with a parent of taskContent is clicked remove it
    $('.taskContent').on('click', '.taskInnerContent', function (e) {
        $(e.target).remove();
    });

    //when window is clicked do this
    window.onclick = function (event) {
        //if used clicked on modal remove modal and remove settings popup
        if (event.target == pomodoroApp.modal) {
            pomodoroApp.modal.style.display = "none";
            $('.settingsPopup').hide();


        }

    }

    //init function used to hold things that happen on load
    pomodoroApp.init = function () {
        $('.stop').hide();
        pomodoroApp.displayTime('Study Time ',);
    };

    //call init function
    pomodoroApp.init();

});


