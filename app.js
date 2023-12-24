'use strict'

class Calculator {
    constructor(time, change, have, buttons) {
        this.date = new Date;
        this.time = document.querySelector(time);
        this.change = document.querySelector(change);
        this.have = document.querySelector(have);
        this.equal = document.querySelector(`${buttons} .equal`);
        this.sides = document.querySelector(`${buttons} .sides`);
    }

    dataday() {
        let d = this.date.getDate().toString().padStart('0', 2);
        let m = this.date.getMonth() + 1;
        m.toString().padStart('0', 2)
        let y = this.date.getFullYear().toString();
        return `${y}${m}${d}`
    }

    day() {
        let d = this.date.getDate().toString().padStart('0', 2);
        let m = this.date.getMonth() + 1;
        m.toString().padStart('0', 2)
        let y = this.date.getFullYear().toString();
        return `${d}.${m}.${y}`
    }

    returnsides() {
        let up = this.change.nextElementSibling.value;
        let down = this.have.nextElementSibling.value;
        this.change.nextElementSibling.value = down;
        this.have.nextElementSibling.value = up;
        let ups = this.have.value;
        this.change.value = ups;
        this.calculate();
    }

    link(valute) {
        if (valute === 'UAH') {
            return `uah.json`
        } else {
            return `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${valute}&date=${this.dataday()}&json`
        }
    }

    valute1() {
        return this.change.nextElementSibling.value
    }
    valute2() {
        return this.have.nextElementSibling.value
    }

    getinfo() {
        let request1 = fetch(this.link(this.valute1()))
            .then(response => { return response.json() })
            .then(resp => { return resp[0].rate })

        let request2 = fetch(this.link(this.valute2()))
            .then(response => { return response.json() })
            .then(resp => { return resp[0].rate })

        return Promise.all([request1, request2]).then(data => {
            let rate1 = data[0]
            let rate2 = data[1]
            return { rate1, rate2 };
        })
    }

    calculate() {
        this.getinfo().then(({rate1, rate2}) => {
            return this.have.value = this.change.value * (rate1 / rate2);
        })
    }

    init() {
        this.time.innerText = this.day();
        this.change.addEventListener('input', this.calculate.bind(this));
        this.change.nextElementSibling.addEventListener('change', this.calculate.bind(this));
        this.have.nextElementSibling.addEventListener('change', this.calculate.bind(this));
        this.sides.addEventListener('click', this.returnsides.bind(this));
    }
}