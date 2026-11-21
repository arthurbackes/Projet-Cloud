const db = require('nano')(process.env.DB_URL.replace('/shopping', '')).use('shopping')

async function getUserData(username) {
    try {
        return await db.get(username)
    } catch(error) {
        if (error.statusCode == 404) {
            return {_id: username, cart: [], purchases: []};
        }
        throw error
    }
}

async function addToCart(username, product) {
    const doc = await getUserData(username)
    const isExisting = doc.cart.find((item) => item._id === product._id)

    if (isExisting) {
        isExisting.quantity += product.quantity || 1
    } else {
        doc.cart.push({
            _id: product._id,
            name: product.name,
            price: product.price,
            quantity: product.quantity || 1
        })
    }

    await db.insert(doc)
    return doc.cart

}

async function removeFromCart(username, productId) {
    const doc = await getUserData(username)
    doc.cart = doc.cart.filter((item) => item._id !== productId) // ça crée un nouveau tableau sans productID
    await db.insert(doc)
    return doc.cart
}


async function checkout(username) {
    const doc = await getUserData(username)
    if (doc.cart.length === 0) {
        throw new Error('Cart Empty')
    }

    const total = doc.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const order = {
        orderId: `ord_${Date.now()}`,
        date: new Date().toISOString(),
        total: total,
        items: [...doc.cart]
    }

    doc.purchases.push(order)
    doc.cart = []

    await db.insert(doc)
    return order
}


module.exports = {
    getUserData, 
    addToCart, 
    removeFromCart,
    checkout
}