import {fetchWithAuth} from './api.js'

export async function getProducts(){
    const resp = await fetchWithAuth('/api/products')
    if(resp.ok === false){
        throw new Error("error while loading products")
    } else {
        return await resp.json()
    }
}