const bars = document.querySelectorAll(".progress-bar")

bars.forEach((el) => {
    const bar = new ProgressBar({
        min: 0,
        max: 100,
        element: el,

        value: 77,
        size: "205px",
        backgroundBarColor: "grey",
        barColor: "red",
        textColor: "red",
    })

    setInterval(() => {
        const random = Math.floor(Math.random() * bar.max)
        bar.setValue(random)
    }, 2000)
})
