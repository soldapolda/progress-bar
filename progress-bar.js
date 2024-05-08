const configuration = {
    // default configuration
    barColor: "green",
    backgroundBarColor: "grey",
    barWidth: "19px",
    backgroundBarWidth: "17px",
    transitionDuration: 1500,
    transitionStyle: "ease",
    textColor: "white",
    fontSize: "62px",
    size: "200px",
}

function createElement(type, parent, attr) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", type)
    setAttributes(el, attr)
    parent.append(el)
}

function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key])
    }
}

class ProgressBar {
    constructor({
        min,
        max,
        element,
        value = null,
        backgroundBarColor = configuration.backgroundBarColor,
        barColor = configuration.barColor,
        size = configuration.size,
        transitionStyle = configuration.transitionStyle,
        transitionDuration = configuration.transitionDuration,
        fontSize = configuration.fontSize,
        textColor = configuration.textColor,
        barWidth = configuration.barWidth,
        backgroundBarWidth = configuration.backgroundBarWidth,
        percentage = false,
        slash = false,
    }) {
        this.min = min
        this.max = max
        this.value = value
        this.element = element
        this.backgroundBarColor = backgroundBarColor
        this.barColor = barColor
        this.size = size
        this.backgroundBarWidth = backgroundBarWidth
        this.barWidth = barWidth
        this.percentage = percentage
        this.slash = slash

        setAttributes(element, {
            width: this.size,
            height: this.size,
            viewBox: "-25 -25 250 250",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
        })
        element.style.transform = "rotate(-90deg)"

        createElement("circle", this.element, {
            r: "90",
            cx: "100",
            cy: "100",
            fill: "transparent",
            stroke: this.backgroundBarColor,
            "stroke-width": this.backgroundBarWidth,
            "stroke-dasharray": "565.48px",
            "stroke-dashoffset": "0",
        })

        createElement("circle", this.element, {
            r: "90",
            cx: "100",
            cy: "100",
            stroke: this.barColor,
            "stroke-width": this.barWidth,
            "stroke-linecap": "round",
            "stroke-dashoffset": "565.48px",
            fill: "transparent",
            "stroke-dasharray": "565.48px",
        })

        createElement("text", this.element, {
            x: "100",
            y: "105",
            fill: textColor,
            "font-size": fontSize,
            "font-weight": "bold",
            "text-anchor": "middle",
            "dominant-baseline": "middle",
            transform: "rotate(90, 100, 100)",
        })

        if (this.percentage) {
            this.element.children[2].textContent = "0%"
        } else if (this.slash) {
            this.element.children[2].textContent = `0/${this.max}`
        } else {
            this.element.children[2].textContent = 0
        }
        
        this.element.dataset.progress = 0

        this.element.children[1].style.transition = `stroke-dashoffset ${transitionDuration}ms ${transitionStyle}`
    }

    setValue(newValue) {
        if (newValue >= this.min && newValue <= this.max) {
            this.value = newValue
            this.render()
        } else {
            console.error(
                `wrong value to progress bar (id = ${this.element.id}), min: ${this.min}, max: ${this.max}, used value: ${newValue} ...`
            )
        }
    }

    resetValue() {
        this.value = this.min
        this.render()
    }

    updateTextCount() {
        const startProgress = Number(this.element.dataset.progress)
        const totalTime = configuration.transitionDuration

        let startTime = Date.now()

        const updateStep = () => {
            const elapsed = Date.now() - startTime
            const progressFraction = elapsed / totalTime

            let easedFraction = 1 - Math.pow(1 - progressFraction, 2.5)

            let newProgress =
                startProgress + easedFraction * (this.value - startProgress)
            newProgress =
                this.value > startProgress
                    ? Math.ceil(newProgress)
                    : Math.floor(newProgress)

            this.element.dataset.progress = newProgress

            if (this.percentage) {
                this.element.children[2].textContent = newProgress + "%"
            } else if (this.slash) {
                this.element.children[2].textContent = newProgress + `/${this.max}`
            } else {
                this.element.children[2].textContent = newProgress
            }

            if (elapsed < totalTime && newProgress !== this.value) {
                setTimeout(updateStep, 20)
            } else {
                this.element.dataset.progress = this.value

                if (this.percentage) {
                    this.element.children[2].textContent = this.value + "%"
                } else if (this.slash) {
                    this.element.children[2].textContent = this.value + `/${this.max}`
                } else {
                    this.element.children[2].textContent = this.value
                }
            }
        }

        setTimeout(updateStep, 20)
    }

    render() {
        const calculation =
            565.48 - (565.48 / (this.max - this.min)) * this.value
        this.element.children[1].setAttribute("stroke-dashoffset", calculation)

        this.updateTextCount()
    }
}
