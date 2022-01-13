var hamButton = document.querySelector('.side-menu-button')
hamButton.addEventListener('click', () => {
    document.querySelector('.side-menu-items').classList.toggle('show-menu')
    document.querySelector('.ham-button').classList.toggle("switch")
    document.querySelector('.logo').classList.toggle("switch")
})

//--------Cart price calculation--------//
let productSubtotal = document.querySelectorAll('.product-subtotal')
let onePiecePrice = document.querySelectorAll('.one-piece-price')
let quantityInput = document.querySelectorAll('.cart-quantity-input')

let cartPrice = document.querySelector('.cart-price span')
let cartTax = document.querySelector('.cart-tax span')
let cartSubTotal = document.querySelector('.cart-subtotal span')
var summed = 0
for (let i = 0; i < productSubtotal.length; i++) {

    //update prices based on the input
    quantityInput[i].addEventListener('change', () => {
        productSubtotal[i].innerHTML = parseFloat(onePiecePrice[i].innerHTML * quantityInput[i].value).toFixed(2);

        var count = 0
        for (let j = 0; j < productSubtotal.length; j++) {
            count = count + parseInt(productSubtotal[j].innerHTML)

        }
        cartPrice.innerHTML = parseFloat(count).toFixed(2)
        cartTax.innerHTML = parseFloat(parseFloat(cartPrice.innerHTML) * 0.12).toFixed(2)
        cartSubTotal.innerHTML = parseFloat(parseFloat(cartPrice.innerHTML) + parseFloat(cartTax.innerHTML)).toFixed(2)
    })

    //summed prices on load screen
    onePiecePrice[i].innerHTML = parseFloat(onePiecePrice[i].innerHTML).toFixed(2)
    productSubtotal[i].innerHTML = parseFloat(onePiecePrice[i].innerHTML * quantityInput[i].value).toFixed(2);
    summed += parseFloat(productSubtotal[i].innerHTML)
    cartPrice.innerHTML = summed.toFixed(2)
    cartTax.innerHTML = parseFloat(parseFloat(cartPrice.innerHTML) * 0.12).toFixed(2)
    cartSubTotal.innerHTML = parseFloat(parseFloat(cartPrice.innerHTML) + parseFloat(cartTax.innerHTML)).toFixed(2)
}

//stop the quantity of products going below 0
for (i = 0; i < quantityInput.length; i++) {
    quantityInput[i].onkeydown = function(e) {
        if (!((e.keyCode > 95 && e.keyCode < 106) ||
                (e.keyCode > 47 && e.keyCode < 58) ||
                e.keyCode == 8)) {
            return false;
        }
    }
}

//number of products in cart
// productsInCartNum = document.getElementById('products-in-cart-num')
// productsInCart = document.querySelectorAll('.products-in-cart')
// productsInCart.innerHTML = productsInCart.length
// document.getElementById('products-in-cart-num').innerHTML = document.querySelectorAll('.products-in-cart').length