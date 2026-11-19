import { derived, writable } from 'svelte/store';
import { fetchWithAuth } from '../utils/api';


interface CartItem {
	_id: string;
	name: string;
	price: number;
	quantity: number;
}


function createCart() {
	const { subscribe, set } = writable<CartItem[]>([]);

	return {
		subscribe,
		set,

		loadCart : async () => {
			const res = await fetchWithAuth('/api/cart')
			if (res.ok) {
				set(await res.json())
			}
		},

		addToCart : async (productID: string, quantity=1) => {
			const res = await fetchWithAuth('/api/cart', {
				method: 'POST',
				body: JSON.stringify({productID, quantity})
			})
			if(res.ok) {
				set(await res.json())
			}
		},

		removeFromCart: async (productID: string) => {
			const res = await fetchWithAuth(`/api/cart/${productID}`, {
				method: 'DELETE'
			});
			if (res.ok) {
				set(await res.json());
			}
		},
	};
}

export const cart = createCart();

export const totalQuantity = derived(cart, ($cart) =>
	$cart.reduce((acc, curr) => acc + curr.quantity, 0)
);

export const totalPrice = derived(cart, ($cart) =>
	$cart.reduce((acc, curr) => acc + curr.quantity * curr.price, 0)
);
