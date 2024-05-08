const progressBar = new ProgressBar({
    min: 0,
    max: 10,
    element: document.getElementById('progress-bar'),

    size: '300px',
    value: 60,
    slash: true
})

setInterval(() => {
    const random = Math.floor(Math.random() * progressBar.max)
    progressBar.setValue(random)
}, 2000)