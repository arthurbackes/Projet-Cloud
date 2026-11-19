import { derived, writable } from 'svelte/store';
import {getProducts} from '../utils/products.js'

export const products = createProducts();
export const productsStatus = writable({'loading' : false, 'error' : null})

function createProducts() {
	const { subscribe, set, update } = writable({});

	return {
		subscribe,
		update,
		set,
		__addProduct: (product) =>
			update((oldProducts) => {
				if (!(product.category in oldProducts)) {
					oldProducts[product.category] = [];
				}
				oldProducts[product.category].push({ ...product, id: crypto.randomUUID() });
				return oldProducts;
			})
	};
}

export async function loadProducts() {
	productsStatus.set({'loading' : true, 'error' : null})

	try {
		const listProducts = await getProducts()
		const group = {}
		for( const prod of listProducts){
			if(!(prod.category in group)){
				group[prod.category] = []
			}
			group[prod.category].push(prod)
		}
		products.set(group)
		productsStatus.set({'loading' : false, 'error' : null})
	} catch (err) {
		productsStatus.set({'loading' : false, 'error' : err.message})
	}
}

export const productsMerged = derived(products, ($products) => {
	return Object.values($products).flat();
});
