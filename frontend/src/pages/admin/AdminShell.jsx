import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

export default function AdminShell() {
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		if (!sessionStorage.getItem('sp_admin'))
			navigate('/admin', { replace: true });
	}, [navigate]);

	// Close mobile menu on route change
	useEffect(() => {
		setMenuOpen(false);
	}, [navigate]);

	function logout() {
		sessionStorage.removeItem('sp_admin');
		navigate('/admin', { replace: true });
	}

	const navLinkCls = ({ isActive }) =>
		`flex items-center gap-2 px-4 py-2 rounded-xl text-base font-semibold transition-all whitespace-nowrap ${
			isActive
				? 'bg-puff/10 text-puff'
				: 'text-white/50 hover:text-white hover:bg-white/5'
		}`;

	const mobileNavLinkCls = ({ isActive }) =>
		`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[14px] font-semibold transition-all ${
			isActive
				? 'bg-puff/10 text-puff'
				: 'text-white/60 hover:text-white hover:bg-white/5'
		}`;

	return (
		<div className='min-h-dvh bg-[#F0EBE3] flex flex-col'>
			{/* ── Top nav ── */}
			<header className='bg-night sticky top-0 z-9999 border-b border-white/6'>
				<div className='w-full mx-auto px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between sm:justify-center gap-4'>
					{/* Brand */}
					<div className='flex items-center gap-2.5 shrink-0'>
						<div className='px-3 py-2 bg-puff rounded-lg flex items-center justify-center text-white text-lg font-bold'>
							SP
						</div>
						<div className='hidden sm:block'>
							<p className='font-bold text-white text-base leading-none'>
								Splendid Puff
							</p>
						</div>
						<span className='hidden sm:block text-white/20 text-sm font-semibold uppercase tracking-widest'>
							/ Admin
						</span>
					</div>

					{/* Desktop nav links */}
					<nav className='hidden md:flex items-center gap-1 flex-1 px-4 mx-auto max-w-max'>
						<NavLink to='/admin/orders' className={navLinkCls}>
							<svg
								className='w-4 h-4 shrink-0'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
								/>
							</svg>
							Orders
						</NavLink>
						<NavLink to='/admin/products' className={navLinkCls}>
							<svg
								className='w-4 h-4 shrink-0'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
								/>
							</svg>
							Menu items
						</NavLink>
					</nav>

					{/* Desktop right actions */}
					<div className='hidden md:flex items-center gap-2 shrink-0'>
						<a
							href='/'
							target='_blank'
							rel='noreferrer'
							className='flex items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold text-white/40 hover:text-white/70 hover:bg-white/5 transition'
						>
							<svg
								className='w-3.5 h-3.5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
								/>
							</svg>
							Storefront
						</a>
						<button
							onClick={logout}
							className='flex items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold text-white/40 hover:text-red-400 hover:bg-white/5 transition'
						>
							<svg
								className='w-3.5 h-3.5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
								/>
							</svg>
							Lock
						</button>
					</div>

					{/* Mobile hamburger */}
					<button
						onClick={() => setMenuOpen((o) => !o)}
						className='md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition'
						aria-label='Toggle menu'
					>
						{menuOpen ? (
							<svg
								className='w-5 h-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
						) : (
							<svg
								className='w-5 h-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4 6h16M4 12h16M4 18h16'
								/>
							</svg>
						)}
					</button>
				</div>

				{/* Mobile dropdown menu */}
				{menuOpen && (
					<div className='md:hidden border-t border-white/6 bg-night px-3 pb-3 pt-2 space-y-1'>
						<NavLink
							to='/admin/orders'
							className={mobileNavLinkCls}
							onClick={() => setMenuOpen(false)}
						>
							<svg
								className='w-5 h-5 shrink-0'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
								/>
							</svg>
							Orders
						</NavLink>
						<NavLink
							to='/admin/products'
							className={mobileNavLinkCls}
							onClick={() => setMenuOpen(false)}
						>
							<svg
								className='w-5 h-5 shrink-0'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
								/>
							</svg>
							Menu items
						</NavLink>
						<div className='cut-line my-2 mx-1' />
						<a
							href='/'
							target='_blank'
							rel='noreferrer'
							className='flex items-center gap-3 px-4 py-3.5 rounded-xl text-[14px] font-semibold text-white/40 hover:text-white/70 transition'
						>
							<svg
								className='w-5 h-5 shrink-0'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
								/>
							</svg>
							View storefront
						</a>
						<button
							onClick={logout}
							className='flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-[14px] font-semibold text-white/40 hover:text-red-400 transition'
						>
							<svg
								className='w-5 h-5 shrink-0'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
								/>
							</svg>
							Lock
						</button>
					</div>
				)}
			</header>

			{/* ── Page content ── */}
			<div className='flex-1 min-w-0'>
				<Outlet />
			</div>
		</div>
	);
}
