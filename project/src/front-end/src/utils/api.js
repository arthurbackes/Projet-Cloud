/**
 * @param {string} endpoint
 * @param {RequestInit} options
 */

export async function fetchWithAuth(endpoint, options = {}) {
    let token = null;

    if (typeof window !== 'undefined') {
        const localAuth = window.localStorage.getItem('auth')

        if (localAuth) {
            try {
                const parsedAuth = JSON.parse(localAuth)
                token = parsedAuth.token
            } catch (error) {
                console.error('Error reading the token', error)
            }
        }
    }

    const headers = new Headers(options.headers);
    
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        ...options,
        headers
    })

    if (response.status === 401 && typeof window !== 'undefined') {
        console.warn('Token expired')
        window.localStorage.removeItem('auth')
        window.location.href = '/login'
    }

    return response
    
}