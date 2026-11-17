const nano = require('nano')

const products = nano(process.env.DB_URL)

function insertProduct(productDoc) {
  return new Promise((resolve, reject) => {
    products.insert(productDoc, productDoc._id, (error, result) => {
      if (error) {
        reject(error)
        return
      }

      resolve(result)
    })
  })
}

function fetchProduct (product) {
  return new Promise((resolve, reject) => {
    products.get(product, (error, productDoc) => {
      if (error) {
        reject(error)
        return
      }

      resolve(productDoc)
    })
  })
}

function cleanProd (product) {
    const {_id,_rev,...other} = product
    return { id : _id,...other, description : other.description ?? "", image:other.image ?? null}
}

function listProducts (){
    const info = {include_docs : true}
    return new Promise((resolve, reject) => {
        products.list(info, (error, result) => {
        if (error) {
            reject(error)
            return
        }
        resolve(result.rows.map(x => cleanProd(x.doc)))
    })
  })
}

async function createProduct (product) {
  const productDoc = {
    name:product.name,
    price:product.price,
    stock:product.stock,
    description:product.description,
    category:product.category,
    image:product.image
  }
  const res = await insertProduct(productDoc)
  const ret = { ...productDoc, id:res.id}
  return ret
}

module.exports = {
  createProduct,
  listProducts
}