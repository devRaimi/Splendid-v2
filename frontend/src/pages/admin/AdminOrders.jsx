import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders, updateOrderStatus } from '../../lib/api';
import { CONFIG, formatNaira, itemsLabel, waLink } from '../../lib/config';
import { useToast } from '../../components/Toast';
import { useFetchOrderQuery } from '../../redux/itemApiSlice';

const FILTERS = [
	'all',
	'pending',
	'confirmed',
	'ready',
	'completed',
	'cancelled',
];

const STATUS_COLORS = {
	pending: 'bg-amber-100 text-amber-700 border-amber-200',
	confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
	ready: 'bg-orange-100 text-orange-700 border-orange-200',
	completed: 'bg-green-100 text-green-700 border-green-200',
	cancelled: 'bg-zinc-100 text-zinc-500 border-zinc-200',
};

const STATUS_BAR = {
	pending: 'bg-amber-400',
	confirmed: 'bg-blue-400',
	ready: 'bg-orange-400',
	completed: 'bg-green-500',
	cancelled: 'bg-zinc-300',
};

const STATUS_ICONS = {
	pending: '⏳',
	confirmed: '✅',
	ready: '🍩',
	completed: '🎉',
	cancelled: '✕',
};

export default function AdminOrders() {
	const { data } = useFetchOrderQuery();
	const toast = useToast();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState('all');
	const [search, setSearch] = useState('');

	const load = useCallback(async () => {
		try {
			setLoading(true);
			await setOrders(data);
		} catch {
			toast("Couldn't load orders", true);
		} finally {
			setLoading(false);
		}
	}, [toast]);

	useEffect(() => {
		// load();
		data ? setOrders(data) : null;
		setLoading(false);
	}, [data]);

	const stats = useMemo(
		() => ({
			total: orders?.length,
			pending: orders?.filter((o) => o.status === 'pending').length,
			confirmed: orders?.filter((o) => o.status === 'confirmed').length,
			ready: orders?.filter((o) => o.status === 'ready').length,
			revenue: orders
				?.filter((o) => o.isDelivered)
				.reduce((s, o) => s + Number(o.total ?? 0), 0),
		}),
		[orders],
	);

	const filtered = useMemo(() => {
		let list =
			filter === 'all'
				? orders
				: orders?.filter((o) => o.status === filter);
		if (search.trim()) {
			const q = search.toLowerCase();
			list = list.filter(
				(o) =>
					o.ref?.toLowerCase().includes(q) ||
					o.name?.toLowerCase().includes(q) ||
					o.phone?.includes(q),
			);
		}
		return list;
	}, [orders, filter, search]);

	async function advance(ref) {
		const o = orders.find((o) => o.ref === ref);
		const next = o && CONFIG.STATUS_FLOW[o.status];
		if (!next) return;
		setOrders((prev) =>
			prev.map((o) => (o.ref === ref ? { ...o, status: next } : o)),
		);
		toast(`${ref} → ${next}`);
		try {
			await updateOrderStatus(ref, next);
		} catch {
			toast('Status updated locally — sheet sync failed', true);
		}
	}

	return (
		<div className='p-10 h-full'>
			<div className='mb-6 flex items-start justify-between'>
				<div>
					<h1 className=' font-bold text-[24px] text-ink'>Orders</h1>
					<p className='text-[13px] text-paper-muted mt-0.5'>
						{new Date().toLocaleDateString('en-NG', {
							weekday: 'long',
							day: 'numeric',
							month: 'long',
						})}
					</p>
				</div>
				<button
					onClick={load}
					disabled={loading}
					className='flex items-center gap-2 px-4 py-2 rounded-xl border border-paper-border bg-white text-[13px] font-semibold text-paper-muted hover:text-ink hover:border-paper-muted transition disabled:opacity-50'
				>
					<svg
						className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2.5}
							d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
						/>
					</svg>
					Refresh
				</button>
			</div>

			{/* Stats */}
			<div className='grid grid-cols-5 gap-3 mb-6'>
				{[
					{ label: 'Total', value: stats.total, highlight: false },
					{
						label: 'Pending',
						value: stats.pending,
						highlight: stats.pending > 0,
						color: 'text-amber-600',
					},
					{
						label: 'Confirmed',
						value: stats.confirmed,
						highlight: false,
					},
					{
						label: 'Ready',
						value: stats.ready,
						highlight: stats.ready > 0,
						color: 'text-orange-500',
					},
					{
						label: 'Revenue',
						value: formatNaira(stats.revenue),
						highlight: false,
					},
				].map((s, i) => (
					<div
						key={i}
						className={`bg-white rounded-2xl text-center border p-4 ${s.highlight ? 'border-puff/30 ring-1 ring-puff/15' : 'border-paper-border'}`}
					>
						<p
							className={`font-bold text-2xl leading-none tabular-nums ${s.highlight && s.color ? s.color : 'text-ink'}`}
						>
							{s.value}
						</p>
						<p className='text-[11px] uppercase tracking-wider text-paper-muted font-semibold mt-1.5'>
							{s.label}
						</p>
					</div>
				))}
			</div>

			{/* Filters + search */}
			<div className='flex items-center gap-3 mb-5'>
				<div className='flex gap-1.5 overflow-x-auto scrollbar-hide'>
					{FILTERS.map((f) => (
						<button
							key={f}
							onClick={() => setFilter(f)}
							className={`shrink-0 px-4 py-2 rounded-xl text-[12.5px] font-semibold capitalize transition ${
								filter === f
									? 'bg-ink text-white'
									: 'bg-white border border-paper-border text-paper-muted hover:text-ink hover:border-paper-muted'
							}`}
						>
							{f === 'all' ? 'All' : `${STATUS_ICONS[f]} ${f}`}
						</button>
					))}
				</div>
				<input
					className='ml-auto w-52 shrink-0 rounded-xl border border-paper-border bg-white px-4 py-2 text-[13px] text-ink placeholder:text-paper-muted outline-none focus:border-puff focus:ring-2 focus:ring-puff/10 transition'
					placeholder='Search name, ref, phone…'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>

			{/* List */}
			{loading ? (
				<div className='grid gap-3'>
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className='h-20 rounded-2xl bg-white/60 animate-pulse'
						/>
					))}
				</div>
			) : filtered.length === 0 ? (
				<div className='flex flex-col items-center justify-center py-20 text-center'>
					<p className='text-4xl mb-3'>📭</p>
					<p className='font-semibold text-ink'>No orders</p>
					<p className='text-[13px] text-paper-muted mt-1'>
						{filter !== 'all'
							? `No ${filter} orders`
							: 'Orders will appear here once customers start placing them.'}
					</p>
				</div>
			) : (
				<div className='grid gap-3'>
					{filtered.map((o) => (
						<OrderRow
							key={o.ref}
							order={o}
							onAdvance={() => advance(o.ref)}
						/>
					))}
				</div>
			)}
		</div>
	);
}

const OrderRow = ({ order: o, onAdvance }) => {
	const isGift = o.isGift;
	const [status, setStatus] = useState();
	useEffect(() => {
		o ? setStatus(
			o.status.isConfirmed
				? 'confirmed'
				: o.status.isApproved
					? 'approved'
					: o.status.isCompleted
						? 'completed'
						: o.status.isCancelled
							? 'cancelled'
							: 'pending',
		) :null
		console.log(status)
	}, [o]);
	const next = CONFIG.STATUS_ACTIONS[status];
	let items = [];
	let total = 0;
	o.orders.forEach((item) => {
		items.push(item);
		total += item.subtotal;
	});
	return (
		<div className='bg-white rounded-2xl border border-paper-border overflow-hidden hover:border-paper-muted hover:shadow-sm transition-all duration-200 group'>
			{/* Status colour bar */}
			<div
				className={`h-1 w-full ${STATUS_BAR[status] ?? 'bg-paper-border'}`}
			/>

			<div className='px-4 py-3.5 sm:px-5 sm:py-4'>
				{/* ── DESKTOP layout (sm and up) ── */}
				<div className='hidden sm:flex items-center gap-4'>
					{/* Left: identity */}
					<div className='flex-1 min-w-0'>
						<div className='flex items-center gap-2 mb-1'>
							{isGift && (
								<span className='shrink-0 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold leading-none'>
									🕵️ Gift
								</span>
							)}
							<span className=' font-bold text-xl text-ink shrink-0'>
								{o.ref}
							</span>
							<span className='text-paper-border'>·</span>
							<span className='text-[13px] text-ink font-semibold'>
								{isGift
									? `For: ${o.anonymous?.recipientName ?? '?'}`
									: o.buyersName}
							</span>
						</div>
						<p className='text-base text-paper-muted capitalize'>
							{items.map((item) =>
								itemsLabel(
									`${item.name} ${item.size} x${item.quantity}, `,
								),
							)}
							{o.deliveryLocation && (
								<>
									<br />
									<span className='text-paper-muted/70 text-sm capitalize'>
										{o.deliveryLocation}
									</span>
								</>
							)}
						</p>
					</div>

					{/* Price */}
					<p className='font-bold text-lg text-ink shrink-0'>
						{formatNaira(total)}
					</p>

					{/* Status badge */}
					<span
						className={`px-2.5 py-0.5 rounded-full text-xs capitalize border shrink-0 ${
							STATUS_COLORS[status] ?? 'bg-zinc-100 text-zinc-500'
						}`}
					>
						{status}
					</span>

					{/* Actions */}
					<div className='flex items-center gap-1.5 shrink-0'>
						<a
							href={waLink(
								o.phone,
								`Hi! Update on order *${o.ref}*`,
							)}
							target='_blank'
							rel='noreferrer'
							className='w-8 h-8 flex items-center justify-center rounded-xl border border-paper-border hover:border-[#25D366] hover:bg-green-50 text-sm transition'
						>
							💬
						</a>
						<Link
							to={`/admin/orders/${o.ref}`}
							className='w-8 h-8 flex items-center justify-center rounded-xl border border-paper-border hover:border-puff/50 text-paper-muted hover:text-ink transition text-xs font-semibold'
						>
							→
						</Link>
					</div>
				</div>

				{/* ── MOBILE layout (below sm) ── */}
				<div className='sm:hidden space-y-2'>
					{/* Row 1: ref + status */}
					<div className='flex items-center justify-between gap-2'>
						<div className='flex items-center gap-1.5 min-w-0'>
							{isGift && (
								<span className='shrink-0 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold leading-none'>
									🕵️ Gift
								</span>
							)}
							<span className='font-mono font-bold text-[13px] text-ink'>
								{o.ref}
							</span>
						</div>
						<span
							className={`px-2.5 py-0.5 rounded-full text-[11px] capitalize border shrink-0 ${
								STATUS_COLORS[status] ??
								'bg-zinc-100 text-zinc-500'
							}`}
						>
							{status}
						</span>
					</div>

					{/* Row 2: customer / recipient name */}
					<p className='text-[13px] text-ink font-semibold leading-tight truncate'>
						{isGift
							? `For: ${o.gift?.recipientName ?? '?'}`
							: o.buyersName}
					</p>

					{/* Row 3: items summary */}
					<p className='text-xs text-paper-muted leading-relaxed'>
						{items.map((item) =>
							itemsLabel(
								`${item.name} ${item.size} x${item.quantity}, `,
							),
						)}
					</p>

					{/* Row 4: delivery + price + actions */}
					<div className='flex items-center justify-between gap-2 pt-0.5'>
						<p className='text-xs text-paper-muted flex-1'>
							{o.deliveryLocation}
						</p>
						<div className='flex items-center gap-2 shrink-0'>
							<p className='font-bold text-sm text-ink'>
								{formatNaira(total)}
							</p>
							<div className='flex items-center gap-1'>
								<a
									href={waLink(
										o.buyersWhatsapp,
										`Hi! Update on order *${o.ref}*`,
									)}
									target='_blank'
									rel='noreferrer'
									className='w-7 h-7 flex items-center justify-center rounded-lg border border-paper-border hover:border-[#25D366] hover:bg-green-50 text-sm transition'
								>
									💬
								</a>
								<Link
									to={`/admin/orders/${o.ref}`}
									className='w-7 h-7 flex items-center justify-center rounded-lg border border-paper-border hover:border-puff/50 text-paper-muted hover:text-ink transition text-xs font-semibold'
								>
									→
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
