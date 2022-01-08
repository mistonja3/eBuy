var hamButton = document.querySelector('.side-menu-button')
hamButton.addEventListener('click', () => {
    document.querySelector('.side-menu-items').classList.toggle('show-menu')
    document.querySelector('.ham-button').classList.toggle("switch")
    document.querySelector('.logo').classList.toggle("switch")
})