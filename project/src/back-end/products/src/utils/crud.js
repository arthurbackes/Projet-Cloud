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

function cleanProduct (product) {
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
        resolve(result.rows.map(x => cleanProduct(x.doc)))
    })
  })
}

async function getProduct (id) {
    try {
        const product = await fetchProduct(id)
        return cleanProduct(product)
    } catch(err){
        if(err.statusCode === 404){
            const err1 = new Error('Product not found')
            err1.statusCode = 404
            throw err1
        }
        throw err
    }
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
  const resfinal = await cleanProduct(ret)
  return resfinal
}

function destroyProduct(id,rev){
  return new Promise((resolve, reject) => {
    products.destroy(id, rev, (error, res) => {
      if (error) {
        reject(error)
        return
      }
      resolve(res)
    })
  })
}

async function deleteProduct(id){
    try {
        const product = await fetchProduct(id)
        await destroyProduct(product._id, product._rev)
    } catch(err){
        if(err.statusCode === 404){
            const err1 = new Error('Product not found')
            err1.statusCode = 404
            throw err1
        }
        throw err
    }
}

async function updateProduct(id,change){
    try {
        const product = await fetchProduct(id)
        for(const field in change){
            product[field] = change[field]
        }
        await insertProduct(product)
        return await cleanProduct(product)
        
    } catch(err){
        if(err.statusCode === 404){
            const err1 = new Error('Product not found')
            err1.statusCode = 404
            throw err1
        }
        throw err
    }
}

module.exports = {
  createProduct,
  listProducts,
  getProduct,
  deleteProduct,
  updateProduct
}