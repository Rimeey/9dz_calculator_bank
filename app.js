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

    link(valute) {
        let str = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${valute}&date=${this.dataday()}&json`
        return str;
    }

    valute1() {
        return this.change.nextElementSibling.value
    }
    valute2() {
        return this.have.nextElementSibling.value
    }

    getinfo() {
        const request1 = fetch(this.link(this.valute1()))
            .then(response => { return response.json() })
            .then(resp => { return resp[0].rate })

        const request2 = fetch(this.link(this.valute2()))
            .then(response => { return response.json() })
            .then(resp => { return resp[0].rate })

        return Promise.all([request1, request2]).then(data => {
            const rate1 = data[0]
            const rate2 = data[1]
            return { rate1, rate2 };
        })
    }

    calculate() {
        this.getinfo().then(data => {
                return this.have.value = this.change.value * (data.rate1 / data.rate2);
        })
    }

    returnsides() {
        let up = this.change.nextElementSibling.value;
        let down = this.have.nextElementSibling.value;
        let ups = this.have.value;
        this.change.value = ups;
        this.change.nextElementSibling.value = down;
        this.have.nextElementSibling.value = up;
        this.calculate();
    }

    init() {
        this.time.innerText = this.day();
        this.change.addEventListener('input', this.calculate.bind(this));
        this.change.nextElementSibling.addEventListener('change', this.calculate.bind(this));
        this.have.nextElementSibling.addEventListener('change', this.calculate.bind(this));
        this.sides.addEventListener('click', this.returnsides.bind(this));
    }
}