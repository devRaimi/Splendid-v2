import React, { useState } from 'react';
import { CustomerApp, AdminApp } from './components';
import { Toast } from './components';
import './styles.css';

function App() {
	const [mode, setMode] = useState('customer'); // 'customer' or 'admin'

	// Quick admin access - press 'a' key to go to admin, 'c' to go to customer
	React.useEffect(() => {
		const handleKeyPress = (e) => {
			if (e.ctrlKey && e.key === 'a') {
				e.preventDefault();
				setMode('admin');
			} else if (e.ctrlKey && e.key === 'c') {
				e.preventDefault();
				setMode('customer');
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, []);

	return (
		<>
			{mode === 'customer' ? <CustomerApp /> : <AdminApp />}
			<Toast />

			{/* Hidden mode switcher button for development */}
			<button
				onClick={() =>
					setMode(mode === 'customer' ? 'admin' : 'customer')
				}
				style={{
					position: 'fixed',
					bottom: '20px',
					left: '20px',
					width: '50px',
					height: '50px',
					borderRadius: '50%',
					background: 'rgba(0,0,0,0.1)',
					border: 'none',
					cursor: 'pointer',
					fontSize: '20px',
					display: 'none', // Hide in production
					zIndex: 999,
				}}
				title={`Switch to ${mode === 'customer' ? 'admin' : 'customer'} (Ctrl+${mode === 'customer' ? 'A' : 'C'})`}
			>
				{mode === 'customer' ? '👤' : '🛒'}
			</button>
		</>
	);
}

export default App;
