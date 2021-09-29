let date = new Date()
let leftArrow = document.body.querySelector('.calendar__arrow-left');
let rightArrow = document.body.querySelector('.calendar__arrow-right');
let days_container = document.querySelector('.calendar__days');
let inputFirstDate = document.querySelector('.first-date');
let inputSecDate = document.querySelector('.second-date');
let calendar = document.querySelector('.calendar');
// input.addEventListener('focus', event => {
//     calendar.style.display = 'block'
// })

// input.addEventListener('blur', e=> {
//     calendar.style.display = 'none'
// })

inputFirstDate.addEventListener('change', e => {
    console.log()
})


function clickToTextDate(date) { 
    let day = new Date(date).getDate();
    day = day.toString().length <= 1 ? `0${new Date(date).getDate()}` : day;
    let month = new Date(date).getMonth() + 1;
    month = month.toString().length <= 1 ? `0${new Date(date).getMonth() + 1}` : month;

    return  `${day}.${month}.${new Date(date).getFullYear()}`
}

class pickedDate {
    constructor(target, rangeClass, isPicked) {
        
        this.target = target
        this.rangeClass = rangeClass
        this.isPicked = isPicked
        this.target?.classList.add(rangeClass)
        this.value = this.target
    }

    makeCopy() {
        let result = new pickedDate()
        result.value = this.value;
        result.target = this.target;
        result.rangeClass = this.rangeClass;
        result.isPicked = this.isPicked;
        return result;
    }

    changeRangeClass(newClassValue) {
        this.target.classList.remove(this.rangeClass);
        this.target.classList.add(newClassValue);
        this.rangeClass = newClassValue;
    }
    
}


let firstDate = new pickedDate() 
let secondDate = new pickedDate()

let parseDate = function(dataset) {
    return Date.parse(`${dataset.year} ${+dataset.month + 1} ${dataset.date}`)
}


function renderCalendar (value) {
    date.setMonth(value)
    let lastDayOfPrevMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate()
    let lastDayOfThisMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    let weekDayOfFirstDate = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    let months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь',]
    let days = ''
    document.querySelector('.calendar__month').innerHTML = `${months[date.getMonth()]} ${date.getFullYear()}`
    if (weekDayOfFirstDate == 0) {
        weekDayOfFirstDate = 7
    }


    if(weekDayOfFirstDate > 1) {
        renderMonth(lastDayOfPrevMonth - (weekDayOfFirstDate - 2), lastDayOfPrevMonth, prevMonth) 
    }
    renderMonth(1, lastDayOfThisMonth, thisMonth) 
    renderMonth(1, 42 - (lastDayOfThisMonth + weekDayOfFirstDate - 1), nextMonth)
    
    days_container.innerHTML = days

    function renderMonth(iterator, steps, handler) { 
        for (let i = iterator; i <= steps; i++) {  
            handler(i)
        }
      
    }
    function prevMonth(i) {
        days += `<li class="calendar__day other-month prev-month"
        data-date="${i}"
        data-month="${new Date(date.getFullYear(), date.getMonth() - 1, i).getMonth()}"
        data-year="${new Date(date.getFullYear(), date.getMonth() - 1, i ).getFullYear()}">${i}</li>`
    }
    function thisMonth (i) {
        if (i == date.getDate() && date.getMonth() == new Date().getMonth() && date.getFullYear() == new Date().getFullYear()) {
            days += `<li class="calendar__day today"
                data-date="${i}"
                data-month="${date.getMonth()}"
                data-year="${new Date(date.getFullYear(), date.getMonth(),  i ).getFullYear()}">${i}</li>`
        } else {
            days += `<li class="calendar__day"
            data-date="${i}"
            data-month="${date.getMonth()}"
            data-year="${new Date(date.getFullYear(), date.getMonth(),  i ).getFullYear()}">${i}</li>`
        }
    }
    function nextMonth (i) {
        days += `<li class="calendar__day other-month next-month"
        data-date="${i}"
        data-month="${new Date(date.getFullYear(), date.getMonth() + 1, i).getMonth()}"
        data-year="${new Date(date.getFullYear(), date.getMonth() + 1, i ).getFullYear()}">${i}</li>`
    }


    renderRange()
    function renderRange() {
        days_container.querySelectorAll('.calendar__day').forEach(item => {

            let itemDate = parseDate(item.dataset)
            if (itemDate == firstDate.value) {
                item.classList.add(firstDate.rangeClass, 'selected')
                firstDate.target = item
            }

            if (itemDate == secondDate.value && secondDate.isPicked == true) {
                item.classList.add(secondDate.rangeClass, 'selected')
                secondDate.target = item
            }

            const minValue = Math.min(secondDate.value, firstDate.value) 
            const maxValue = Math.max(secondDate.value, firstDate.value)
            if(  (itemDate < maxValue && itemDate > minValue) && secondDate.isPicked == true ) {
                item.classList.add('is-in-range')
            } else item.classList.remove('is-in-range')

        })
    }

    function isClickedOnSelectedDate(event) {
        let target = event.target;
        if (!target.classList.contains('selected')) {
            days_container.querySelectorAll('.calendar__day').forEach(item => {
                item.classList.remove('selected', 'range-from', 'range-to', 'is-in-range')
            })
            secondDate.isPicked = false;
            firstDate.isPicked = false;
            rangeStart(event)
            days_container.removeEventListener('click', isClickedOnSelectedDate)
        } else {
            target.classList.remove('selected')
            if(target == firstDate.target) {
                let temp = firstDate.makeCopy();
                firstDate = secondDate.makeCopy()
                secondDate = temp;
                // firstDate.prevTarget = target
            }
            secondDate.isPicked = false;
            days_container.removeEventListener('click', isClickedOnSelectedDate)
            days_container.addEventListener('mouseover', rangeSelect);
            days_container.addEventListener('click', rangeEnd);
    }

    }



    function rangeStart(event) {
        if (event.target.classList.contains('calendar__day')) {
            firstDate = new pickedDate({
                value: parseDate(event.target.dataset),
            })
        firstDate.isPicked = true;
        firstDate.target = event.target;
        firstDate.rangeClass = 'range-from';
        firstDate.value = parseDate(firstDate.target.dataset);
        firstDate.target.classList.add(firstDate.rangeClass);
        firstDate.target.classList.add('selected');
        inputFirstDate.value = clickToTextDate(firstDate.value)
        days_container.addEventListener('mouseover', rangeSelect);
        days_container.removeEventListener('click', rangeStart);
        days_container.addEventListener('click', rangeEnd);
        }
    }
    function rangeSelect(event) {
        if (event.target.classList.contains('calendar__day')) {
            if(secondDate.target != undefined) {
                secondDate.target.classList.remove(secondDate.rangeClass)
            }
            // if(firstDate.prevTarget && firstDate.prevTarget.classList[1] != undefined) {
            //     firstDate.prevTarget.classList.remove(firstDate.prevTarget.classList[1])
            // }
            secondDate.target = event.target;
            secondDate.value = parseDate(secondDate.target.dataset);
    
    
            secondDate.rangeClass = 'range-to'
            secondDate.target.classList.add(secondDate.rangeClass)
            if ( secondDate.value < firstDate.value) {
                secondDate.changeRangeClass('range-from')
                firstDate.changeRangeClass('range-to')
            } else if(secondDate.value > firstDate.value) {
                secondDate.changeRangeClass('range-to')
                firstDate.changeRangeClass('range-from')
            } else {
                secondDate.changeRangeClass('range-from')
            }
            const minValue = Math.min(secondDate.value, firstDate.value) 
            const maxValue = Math.max(secondDate.value, firstDate.value)
            days_container.querySelectorAll('.calendar__day').forEach(item => {
                let itemDate = parseDate(item.dataset);
                if( itemDate < maxValue && itemDate > minValue ) {
                    item.classList.add('is-in-range')
                } else item.classList.remove('is-in-range')
            })
        }
    }
    function rangeEnd (event) {
        if (event.target.classList.contains('calendar__day')) {
            secondDate.isPicked = true;
            let target = event.target;
            target.classList.add('selected');
            inputFirstDate.value = clickToTextDate(Math.min(firstDate.value, secondDate.value))
            inputSecDate.value = clickToTextDate(Math.max(firstDate.value, secondDate.value))
            days_container.removeEventListener('click', rangeStart)
            days_container.removeEventListener('mouseover', rangeSelect)
            days_container.removeEventListener('click', rangeEnd)
            days_container.addEventListener('click', isClickedOnSelectedDate )
        }
    }

    if (!firstDate.isPicked == true) {
        days_container.addEventListener('click', rangeStart)
    }

}



leftArrow.addEventListener('click', e => {
  renderCalendar(date.getMonth() - 1)
})
rightArrow.addEventListener('click', e => {
    renderCalendar(date.getMonth() + 1) 
  })
renderCalendar(date.getMonth())
