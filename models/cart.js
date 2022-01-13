let cart = null
module.exports = class Cart {
    static save(product) {
        //if cart exist
        if (cart) {
            const existingIndex = cart.products.findIndex(p => p.id == product.id)
            const existingProduct = cart.products[existingIndex]
            for (let i = 0; i < cart.products.length; i++) {
                if (existingIndex >= i && product.product_size === existingProduct.product_size) {
                    console.log("same item and size ", existingIndex)
                    existingProduct.product_amount += product.product_amount
                    existingProduct.product_size = product.product_size;
                    return
                } else if (existingIndex >= i && product.product_size !== existingProduct.product_size) {
                    console.log("same item different size ", existingIndex)
                    product.product_amount = product.product_amount
                    product.product_size = product.product_size;
                    cart.products.push(product)
                    return
                } else {
                    console.log("different item")
                    product.product_amount = product.product_amount
                    product.product_size = product.product_size;
                    cart.products.push(product)
                    return
                }
            }
            //if cart does not exist create an object of arrays and push the first item(s)
        } else {
            cart = { products: [] };
            product.product_amount = product.product_amount;
            product.product_size = product.product_size;
            cart.products.push(product)
        }
    }
    static getCart() {
        return cart
    }

    static delete(id, size) {
        //get the index of the product id and size so we can remove unique item
        var found = cart.products.findIndex(function(itm) {
            return itm.id == id && itm.product_size == size;
        });
        cart.products.splice(found, 1)
    }
}