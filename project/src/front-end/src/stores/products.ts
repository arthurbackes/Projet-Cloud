import { derived, writable } from 'svelte/store';
import {getProducts} from '../utils/products.js'
import {error} from './toasts.js'

export const products = createProducts();

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
	} catch (err) {
		error("Probleme while loading catalog")
	}
}

export const productsMerged = derived(products, ($products) => {
	return Object.values($products).flat();
});
