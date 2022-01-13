// module.exports = function Cart(prevCart) {
//     this.items = prevCart.items || {}
//     this.totalQuantity = prevCart.totalQuantity || 0
//     this.totalPrice = prevCart.totalPrice || 0

//     this.add = function(item, id) {
//         var existingItem = this.items[id]

//         if (!existingItem) {
//             existingItem = this.items[id] = { item: item, gty: 0, price: 0 }
//         }
//         existingItem.gty++;
//         existingItem.price = existingItem.item.product_price * existingItem.gty
//         this.totalQuantity++;
//         this.totalPrice += existingItem.item.price
//         console.log(existingItem)
//     }

//     this.getItemsArray = function() {
//         var arr = []
//         for (var id in this.items) {
//             arr.push(this.items[id])
//         }
//         return arr
//     }
// }



let cart = null
module.exports = class Cart {
    static save(product) {

        if (cart) {
            const existingIndex = cart.products.findIndex(p => p.id == product.id)
            const existingProduct = cart.products[existingIndex]
            if ((existingIndex >= 0) && (product.product_size === existingProduct.product_size)) {
                console.log("same item and size ", existingIndex)
                    // console.log(existingIndex)
                existingProduct.product_amount += product.product_amount
                existingProduct.product_size = product.product_size;
                // cart.totalPrice += product.product_price * product.product_amount
            } else if ((existingIndex) >= 0 && (product.product_size != existingProduct.product_size)) {
                console.log("same item different size ", existingIndex)
                product.product_amount = product.product_amount
                product.product_size = product.product_size;
                cart.products.push(product)
                    // cart.totalPrice += product.product_price * product.product_amount
            } else {
                console.log("different item")
                product.product_amount = product.product_amount
                product.product_size = product.product_size;
                cart.products.push(product)
                    // cart.totalPrice += product.product_price * product.product_amount
            }

        } else {
            cart = { products: [] };
            product.product_amount = product.product_amount;
            product.product_size = product.product_size;
            cart.products.push(product)
                // cart.totalPrice += product.product_price * product.product_amount
        }
    }
    static getCart() {
        return cart
    }

    static delete(id) {
        const products = cart.products
        const isExisting = products.findIndex(p => p.id == id)
        if (isExisting >= 0) {
            products.splice(isExisting, 1)
        }
    }
}