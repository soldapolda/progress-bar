const progressBar = new ProgressBar({
    min: 0,
    max: 100,
    element: document.getElementById('progress-bar'),

    size: '300px',
    value: 60,
    percentage: true,
    instaReload: true,
})
