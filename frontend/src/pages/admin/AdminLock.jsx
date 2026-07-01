import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONFIG } from '../../lib/config';
import { useToast } from '../../components/Toast';

export default function AdminLock() {
	const navigate = useNavigate();
	const toast = useToast();
	const [pin, setPin] = useState('');
	const [shake, setShake] = useState(false);
	const inputRef = useRef(null);

	// useEffect(() => {
	//   if (sessionStorage.getItem('sp_admin')) navigate('/admin/orders', { replace: true });
	//   else inputRef.current?.focus();
	// }, [navigate]);

	function check() {
		if (pin === CONFIG.ADMIN_PIN) {
			sessionStorage.setItem('sp_admin', '1');
			navigate('/admin/orders', { replace: true });
		} else {
			setShake(true);
			setPin('');
			setTimeout(() => setShake(false), 500);
			toast('Wrong PIN', true);
		}
	}

	// 2. Clear it the exact moment the user refreshes, reloads, or closes the tab
	window.addEventListener('beforeunload', () => {
		sessionStorage.clear();
		// Or use sessionStorage.clear(); to wipe everything
	});

	return (
		<div className='min-h-dvh bg-night flex flex-col items-center justify-center px-6'>
			<div
				className='absolute inset-0 opacity-[0.03]'
				style={{
					backgroundImage:
						'radial-gradient(circle, #fff 1px, transparent 1px)',
					backgroundSize: '24px 24px',
				}}
			/>

			<div className='relative w-full max-w-sm'>
				<div className='mb-10 text-center'>
					<div className='inline-flex w-12 h-12 bg-puff rounded-xl items-center justify-center text-white font-display font-bold text-lg mb-4'>
						SP
					</div>
					<h1 className='font-display font-bold text-white text-[26px]'>
						Staff access
					</h1>
					<p className='text-white/40 text-[13px] mt-1'>
						Enter your PIN to continue
					</p>
				</div>

				<div className='bg-night-surface border border-night-edge rounded-3xl p-7'>
					<input
						ref={inputRef}
						type='password'
						inputMode='numeric'
						maxLength={6}
						placeholder='• • • •'
						value={pin}
						onChange={(e) => setPin(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && check()}
						className={`w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-4 text-center text-[22px] tracking-[0.5em] text-white placeholder:text-white/20 placeholder:tracking-[0.3em] outline-none focus:border-puff focus:ring-2 focus:ring-puff/20 transition font-mono ${shake ? 'animate-shake border-red-500/50' : ''}`}
					/>
					<button
						onClick={check}
						className='mt-4 w-full bg-puff hover:bg-puff-dim text-white font-display font-bold text-[15px] py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-puff/25'
					>
						Unlock
					</button>
				</div>

				<p className='text-center text-[12px] text-white/20 mt-6'>
					🔒 Session ends when you close this tab
				</p>
			</div>
		</div>
	);
}
