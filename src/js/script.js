document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#preloader').remove();

    //dates
    let now = new Date();

    const parseEventData = () => {
        let eventsData = JSON.parse(events);

        for (let event in eventsData) {
            let value = eventsData[event]
            let eventName, eventDate, eventTime;

            for (let key in value) {
                let keyValue = value[key];

                if (key === 'eventName') {
                    eventName = keyValue
                }

                if (key === 'eventDate') {
                    eventDate = keyValue
                }

                if (key === 'eventTime') {
                    eventTime = keyValue
                }
            }

            let eventElem = document.createElement('div',);

            eventElem.classList.add('week-day__item-event');

            eventElem.innerHTML = `${eventName}`;

            eventDate = new Date(eventDate);

            let eventDay = eventDate.getDate();
            let eventMonth = eventDate.getMonth() + 1;
            let eventHours = eventDate.getHours();
            let eventMinutes = eventDate.getMinutes();

            let placementWeekDay = document.querySelector(`[data-day-date='${eventDay}'][data-day-month='${eventMonth}']`);

            if (placementWeekDay) {
                let placementDay = placementWeekDay.querySelector(`[data-day-time='${eventHours}']`);

                if (placementDay) {
                    let elemHeight;

                    if (eventTime === 'allDay') {
                        elemHeight = 10000;
                    } else {
                        elemHeight = eventTime / 30 * 50;
                    }

                    if (eventMinutes.toString() === '30') {
                        eventElem.setAttribute('style', `top: 50%; height: ${elemHeight}%`);
                    } else {
                        eventElem.setAttribute('style', `height: ${elemHeight}%`);
                    }

                    let today = new Date();

                    if (today.getTime() > eventDate.getTime()) {
                        eventElem.classList.add('week-day__item-event-old');
                    }

                    placementDay.insertAdjacentElement('afterbegin', eventElem);
                }
            }
        }
    }
    const fillCalendar = date => {
        let dateNumber = date.getDate();
        let dayNumber = date.getDay();
        let yearNumber = date.getFullYear();

        const calendarPeriod = document.querySelector('.calendar__date-period');
        let datePeriodFrom = new Date();
        let datePeriodFor = new Date();
        let monthName;

        datePeriodFrom.setDate(dateNumber - 3);
        datePeriodFor.setDate(dateNumber + 3);

        monthName = date.toLocaleString('default', {month: 'long'});

        calendarPeriod.innerHTML = monthName + ' ' + datePeriodFrom.getDate() + '-' + datePeriodFor.getDate() + ', ' + yearNumber;

        const calendarWeek = document.querySelector('.calendar__week');

        const weekDay = calendarWeek.querySelectorAll('.week-day');

        let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        weekDay.forEach((day, i) => {
            i++;

            const weekHeader = day.querySelector('.week-day__header');

            let today = new Date();

            let newDayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i - 4);

            day.setAttribute('data-day-date', newDayDate.getDate());
            day.setAttribute('data-day-month', newDayDate.getMonth() + 1);

            let dayContent = day.querySelector('.week-day__content');

            dayContent.innerHTML = '';

            for (let i = 0; i <= 24; i++) {
                let dayItem = document.createElement('div');
                dayItem.classList.add('week-day__item');
                dayItem.setAttribute('data-day-time', newDayDate.getHours() + i);

                dayContent.insertAdjacentElement('beforeend', dayItem);
            }

            let currentDayNumber = dayNumber + i - 4;

            if (currentDayNumber < 0) {
                currentDayNumber = currentDayNumber + 7;
            }

            if (currentDayNumber >= 7) {
                currentDayNumber = currentDayNumber - 7;
            }

            if (today.getDate() === newDayDate.getDate() && today.getMonth() === newDayDate.getMonth()) {
                day.classList.add('week-day--today');
            } else {
                day.classList.remove('week-day--today');
            }

            weekHeader.innerHTML = days[currentDayNumber] + ' ' + newDayDate.getDate() + '/' + (newDayDate.getMonth() + 1);
        });

        parseEventData();
    }

    fillCalendar(now);

    const btnPrevWeek = document.querySelector('#btn-prev-week');
    const btnNextWeek = document.querySelector('#btn-next-week');
    const btnToday = document.querySelector('#btn-today');

    let weeksAgo = 0;
    let weeksAfter = 0;

    btnPrevWeek.addEventListener('click', () => {
        weeksAgo++;
        weeksAfter--;

        if (weeksAgo >= 4) {
            btnPrevWeek.classList.add('disabled');
            now.setDate(now.getDate() - 7);
            fillCalendar(now);
        } else {
            btnNextWeek.classList.remove('disabled');
            now.setDate(now.getDate() - 7);
            fillCalendar(now);
        }
    });

    btnNextWeek.addEventListener('click', () => {
        weeksAgo--;
        weeksAfter++;

        if (weeksAfter >= 4) {
            btnNextWeek.classList.add('disabled');
            now.setDate(now.getDate() + 7);
            fillCalendar(now);
        } else {
            btnPrevWeek.classList.remove('disabled');
            now.setDate(now.getDate() + 7);
            fillCalendar(now);
        }
    });

    btnToday.addEventListener('click', () => {
        weeksAgo = 0;
        weeksAfter = 0;
        btnNextWeek.classList.remove('disabled');
        btnPrevWeek.classList.remove('disabled');
        now = new Date();
        fillCalendar(now);
    });

})
