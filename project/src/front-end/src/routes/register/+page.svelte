<script>
    import { user } from '../../stores/auth';
    import { goto } from '$app/navigation';
    import { addToast } from '../../stores/toasts'; // On réutilise les notifications de ton projet

    let username = '';
    let password = '';

    async function handleOnSubmit() {
        if (!username || !password) {
            addToast({ message: 'Username/password are required', type: 'error', dismissible: true, timeout: 3000 });
            return;
        }

        try {
            const response = await fetch (import.meta.env.VITE_API_URL + '/user', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ username: username, password: password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            $user = {
                isLogged: true,
                isAdmin: data.user?.role === 'admin',
                username: username,
                token: data.token
            };

            window.localStorage.setItem('auth', JSON.stringify($user));

            addToast({ message: 'Account created successfully!', type: 'success', dismissible: true, timeout: 3000 });
            goto('/');

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error on the server connection';
            addToast({ message: errorMessage, type: 'error', dismissible: true, timeout: 3000 });
        }
    }
</script>

<form method="POST" on:submit|preventDefault={handleOnSubmit}>
	<div class="container py-5 h-100">
		<div class="row d-flex justify-content-center align-items-center h-100">
			<div class="col-12 col-md-8 col-lg-6 col-xl-5">
				<div class="card shadow-2-strong" style="border-radius: 1rem;">
					<div class="card-body p-5 text-center">
						<h3 class="mb-5">Register</h3>

						<div class="form-outline mb-4">
							<input id="username" class="form-control form-control-lg" bind:value={username} />
							<label class="form-label" for="username">Username</label>
						</div>

						<div class="form-outline mb-4">
							<input
								type="password"
								id="password"
								class="form-control form-control-lg"
								bind:value={password}
							/>
							<label class="form-label" for="password">Password</label>
						</div>

						<button class="btn btn-primary btn-lg btn-block" type="submit">Register</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</form>
