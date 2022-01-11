module.exports = function Cart(prevCart) {
    this.items = prevCart.items
    this.totalQuantity = prevCart.totalQuantity
    this.totalPrice = prevCart.totalPrice

    this.add = function(item, id) {
        var existingItem = this.items[id]
        if (!existingItem) {
            existingItem = this.items[id] = { item: item, quantity: 0, price: 0 }
        }
        existingItem.quantity++;
        existingItem.price = existingItem.item.price * existingItem.quantity
        this.totalQuantity++;
        this.totalPrice += existingItem.price
    }

    this.getItemsArray = function() {
        var arr = []
        for (var id in this.items) {
            arr.push(this.items[id])
        }
        return arr
    }
}