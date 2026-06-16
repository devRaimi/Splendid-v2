import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchOrderByRef, updateOrderStatus } from '../../lib/api';
import { CONFIG, formatNaira, itemsLabel, waLink } from '../../lib/config';
import { useToast } from '../../components/Toast';
import {
	useFetchOrderByRefQuery,
	useUpdateOrderMutation,
} from '../../redux/itemApiSlice';

const ALL_STATUSES = [
	'pending',
	'confirmed',
	'approved',
	'completed',
	'cancelled',
];

const STATUS_COLORS = {
	pending: 'bg-amber-100 text-amber-700 border-amber-200',
	confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
	approved: 'bg-orange-100 text-orange-700 border-orange-200',
	completed: 'bg-green-100 text-green-700 border-green-200',
	cancelled: 'bg-zinc-100 text-zinc-500 border-zinc-200',
};

const STATUS_FLOW_ORDER = ['pending', 'confirmed', 'approved', 'completed'];

export default function AdminOrderDetail() {
	const { ref } = useParams();
	const { data, refetch } = useFetchOrderByRefQuery(ref);
	const [updateOrder, { isLoading, isSuccess, isError, error }] =
		useUpdateOrderMutation(ref);
	const navigate = useNavigate();
	const toast = useToast();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [updatingStatus, setUpdatingStatus] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState('');
	const [status, setStatus] = useState();
	useEffect(() => {
		if (!ref) return;
		data ? setOrder(data) : null;
		order
			? setStatus(
					order?.status.isConfirmed
						? 'confirmed'
						: order?.status.isApproved
							? 'approved'
							: order?.status.isCompleted
								? 'completed'
								:order?.status.isCancelled
								? 'cancelled' : 'pending',
				)
			: null;
		setSelectedStatus(status);
		status ? setLoading(false) : null;
	}, [data, order, status]);
	let total = 0;
	order?.orders.forEach((item) => {
		total += item.subtotal;
	});

	const applyStatus = async () => {
		const currentIndex = ALL_STATUSES.indexOf(selectedStatus);
		const oldIndex = ALL_STATUSES.indexOf(status);
		const index = currentIndex - oldIndex;

		const isCompleted = selectedStatus === 'completed' ? true : false;
		const isApproved = selectedStatus === 'approved' ? true : false;
		const isConfirmed = selectedStatus === 'confirmed' ? true : false;
		const isCancelled = selectedStatus === 'cancelled' ? true : false;
		if (
			!order ||
			!selectedStatus ||
			selectedStatus === status ||
			index < oldIndex
			// index  0
		) {
			return;
		}

		try {
			setUpdatingStatus(true);
			await updateOrder({
				ref: ref,
				data: { isCompleted, isApproved, isConfirmed, isCancelled }, // whatever fields you're updating
			}).unwrap();
			refetch();
			toast(`Status updated to "${selectedStatus}"`);
		} catch (err) {
			console.log(err);
			toast('Status update failed', true);
		} finally {
			setUpdatingStatus(false);
		}
	};

	const quickAdvance = async () => {
		if (!order) return;
		const next = CONFIG.STATUS_FLOW[selectedStatus];
		if (!next) return;
		const isCompleted = next === 'completed' ? true : false;
		const isApproved = next === 'approved' ? true : false;
		const isConfirmed = next === 'confirmed' ? true : false;
		const isCancelled = false;
		// console.log(ref)
		try {
			setUpdatingStatus(true);
			// await updateOrder({isCompleted, isApproved, isConfirmed}).unwrap();
			await updateOrder({
				ref: ref,
				data: { isCompleted, isApproved, isConfirmed, isCancelled }, // whatever fields you're updating
			}).unwrap();
			refetch();
			// setOrder((o) => (o ? { ...o, status: next } : o));
			// setSelectedStatus(next);
			toast(`Order moved to "${next}"`);
		} catch (err) {
			toast('Update failed', true);
			console.log(err);
		} finally {
			setUpdatingStatus(false);
		}
	};

	function notifyMsg(o) {
		const isGift = o.orderType === 'gift';
		const msgs = isGift
			? {
					pending: `Hi! Your anonymous gift *${o.ref}* is confirmed ✅ Preparing now 🍩`,
					confirmed: `Hi! Your anonymous gift *${o.ref}* is being prepared 🍩`,
					ready: `Hi! Your anonymous gift *${o.ref}* is on the way 🎁`,
					completed: `Hi! Your anonymous gift *${o.ref}* was delivered successfully 🧡`,
				}
			: {
					pending: `Hi ${o.name}! Your order *${o.ref}* is confirmed ✅ Preparing now.`,
					confirmed: `Hi ${o.name}! Your order *${o.ref}* is being prepared 🍩`,
					ready: `Hi ${o.name}! Your order *${o.ref}* is ready 🎉 Pick up at ${o.location}!`,
					completed: `Thank you ${o.name}! Order *${o.ref}* complete. Enjoy! 🧡`,
				};
		return msgs[o.status] ?? `Update on order *${o.ref}*`;
	}

	const statusIdx = order ? STATUS_FLOW_ORDER.indexOf(status) : -1;
	const nextAction = order ? CONFIG.STATUS_ACTIONS[status] : null;
	const isGift = order?.isGift;

	if (loading)
		return (
			<div className='p-6'>
				<div className='animate-pulse space-y-4'>
					<div className='h-8 w-48 bg-mist-200 rounded-xl' />
					<div className='h-64 bg-mist-200 rounded-2xl' />
				</div>
			</div>
		);

	if (!order)
		return (
			<div className='p-6 text-center pt-20'>
				<p className='text-4xl mb-3'>🔍</p>
				<p className='font-semibold text-ink'>Order not found</p>
				<button
					onClick={() => navigate('/admin/orders')}
					className='mt-4 text-puff font-semibold text-[14px]'
				>
					← Back to orders
				</button>
			</div>
		);

	return (
		// <div className='p-15 w-full'>
		// 	{/* Breadcrumb */}
		// 	<div className='flex items-center gap-2 mb-5 text-[13px]'>
		// 		<button
		// 			onClick={() => navigate('/admin/orders')}
		// 			className='text-paper-muted hover:text-ink font-medium transition'
		// 		>
		// 			Orders
		// 		</button>
		// 		<span className='text-paper-muted'>/</span>
		// 		<span className='font-mono font-bold text-ink'>
		// 			{order.ref}
		// 		</span>
		// 	</div>

		// 	<div className='grid grid-cols-[1fr_300px] gap-5'>
		// 		{/* ── Left ── */}
		// 		<div className='space-y-4'>
		// 			{/* Header */}
		// 			<div className='bg-white rounded-2xl border border-paper-border overflow-hidden'>
		// 				<div className='px-6 py-5 flex items-start justify-between'>
		// 					<div>
		// 						{isGift && (
		// 							<span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[11px] font-bold mb-2'>
		// 								🕵️ Anonymous gift
		// 							</span>
		// 						)}
		// 						<h1 className='font-mono font-bold text-[28px] text-ink leading-none'>
		// 							{order.ref}
		// 						</h1>
		// 						<p className='text-base capitalize text-paper-muted mt-1'>
		// 							{order.campus}
		// 						</p>
		// 					</div>
		// 					<span
		// 						className={`px-3 py-1.5 rounded-full text-[12px] font-bold capitalize border ${STATUS_COLORS[selectedStatus] ?? 'bg-zinc-100 text-zinc-500'}`}
		// 					>
		// 						{selectedStatus}
		// 					</span>
		// 				</div>

		// 				{/* Timeline */}
		// 				<div className='px-6 pb-5'>
		// 					<div className='flex items-center gap-0'>
		// 						{STATUS_FLOW_ORDER.map((s, i) => {
		// 							const done = i <= statusIdx;
		// 							const current = i === statusIdx;
		// 							return (
		// 								<div
		// 									key={s}
		// 									className='flex items-center flex-1 last:flex-none'
		// 								>
		// 									<div className='flex flex-col items-center gap-1'>
		// 										<div
		// 											className={`w-10 h-10 rounded-full text-xl text-center leading- flex items-center justify-center font-bold transition-all ${done ? 'bg-puff text-white' : 'bg-paper-warm text-paper-muted'}`}
		// 										>
		// 											{/* <span className='text-2xl'> */}
		// 											{done
		// 												? current
		// 													? '●'
		// 													: '✓'
		// 												: '○'}
		// 											{/* </span> */}
		// 										</div>
		// 										<span
		// 											className={`text-base font-semibold capitalize whitespace-nowrap ${current ? 'text-puff' : done ? 'text-ink-soft' : 'text-paper-muted'}`}
		// 										>
		// 											{s}
		// 										</span>
		// 									</div>
		// 									{i <
		// 										STATUS_FLOW_ORDER.length -
		// 											1 && (
		// 										<div
		// 											className={`flex-1 h-0.5 mx-1 mb-4 ${i < statusIdx ? 'bg-puff' : 'bg-paper-border'}`}
		// 										/>
		// 									)}
		// 								</div>
		// 							);
		// 						})}
		// 					</div>
		// 				</div>
		// 			</div>

		// 			{/* Customer info */}
		// 			<div className='flex items-start justify-between bg-white rounded-2xl border border-paper-border p-5'>
		// 				<div className=''>
		// 					<h2 className='font-semibold text-[14px] text-ink mb-4'>
		// 						{isGift ? 'Gift details' : 'Customer'}
		// 					</h2>
		// 					<dl className='grid grid-cols-[120px_1fr] gap-y-3 gap-x-4 text-[13px]'>
		// 						{isGift ? (
		// 							<>
		// 								<Dt>Sender</Dt>
		// 								<Dd>
		// 									Anonymous ({order.buyersWhatsapp})
		// 								</Dd>
		// 								<Dt>Recipient</Dt>
		// 								<Dd>
		// 									{order.anonymous?.recipientName ??
		// 										'—'}
		// 									{order.anonymous?.receipientWhatsapp
		// 										? ` · ${order.anonymous.receipientWhatsapp}`
		// 										: ''}
		// 								</Dd>
		// 								{order.anonymous?.giftNote && (
		// 									<>
		// 										<Dt>Note</Dt>
		// 										<Dd className='italic text-paper-muted'>
		// 											"{order.anonymous.giftNote}"
		// 										</Dd>
		// 									</>
		// 								)}
		// 							</>
		// 						) : (
		// 							<>
		// 								<Dt>Name</Dt>
		// 								<Dd>{order.buyersName}</Dd>
		// 								<Dt>WhatsApp</Dt>
		// 								<Dd>{order.buyersWhatsapp}</Dd>
		// 							</>
		// 						)}
		// 						<Dt>Pickup</Dt>
		// 						<Dd>{order.deliveryLocation}</Dd>
		// 						<Dt>Campus</Dt>
		// 						<Dd>{order.campus}</Dd>
		// 					</dl>
		// 				</div>
		// 				<div className='w-1/2'>
		// 					<h2 className='font-semibold text-[14px] text-ink mb-4'>
		// 						Receipt
		// 					</h2>
		// 					<div
		// 						style={{
		// 							background: `url(${order.receipt.url})`,
		// 						}}
		// 						className={`bg-cover! bg-center h-60 w-full`}
		// 					></div>
		// 				</div>
		// 			</div>

		// 			{/* Items — receipt style */}
		// 			<div className='bg-white border-2 border-dashed border-paper-border rounded-2xl overflow-hidden'>
		// 				<div className='px-5 py-3 border-b border-dashed border-paper-border flex items-center justify-between'>
		// 					<span className='font-mono text-[11px] text-paper-muted uppercase tracking-widest'>
		// 						Items
		// 					</span>
		// 				</div>
		// 				<div className='divide-y divide-paper-border/50'>
		// 					{Array.isArray(order.orders) ? (
		// 						order.orders.map((item) => (
		// 							<div
		// 								key={item.id}
		// 								className='flex items-center justify-between px-5 py-3'
		// 							>
		// 								<div>
		// 									<span className='text-base font-medium text-ink'>
		// 										{item.name} {item.size}
		// 									</span>
		// 									<span className='ml-2 font-mono text-sm text-paper-muted'>
		// 										×{item.quantity}
		// 									</span>
		// 								</div>
		// 								<span className='font-mono text-[14px] font-medium'>
		// 									{formatNaira(
		// 										item.subtotal ??
		// 											item.qty * item.price,
		// 									)}
		// 								</span>
		// 							</div>
		// 						))
		// 					) : (
		// 						<div className='px-5 py-3 text-[14px] text-ink'>
		// 							{String(order.items)}
		// 						</div>
		// 					)}
		// 				</div>
		// 				<div className='cut-line mx-5' />
		// 				<div className='flex items-center justify-between px-5 py-3'>
		// 					<span className='f font-bold text-base uppercase tracking-wider text-ink'>
		// 						Total
		// 					</span>
		// 					<span className='font-mono font-bold text-[22px] text-puff'>
		// 						{formatNaira(total)}
		// 					</span>
		// 				</div>
		// 			</div>
		// 		</div>

		// 		{/* ── Right: actions ── */}
		// 		<div className='space-y-4'>
		// 			{nextAction && (
		// 				<div className='bg-white rounded-2xl border border-paper-border p-5'>
		// 					<h2 className='font-semibold text-[13px] text-ink mb-3'>
		// 						Next step
		// 					</h2>
		// 					<button
		// 						onClick={quickAdvance}
		// 						disabled={updatingStatus}
		// 						className='w-full bg-puff capitalize hover:bg-puff-dim text-white font-bold text-base py-3.5 rounded-xl transition active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-puff/20'
		// 					>
		// 						{updatingStatus ? '…' : nextAction}
		// 					</button>
		// 				</div>
		// 			)}

		// 			{/* Manual status */}
		// 			<div className='bg-white rounded-2xl border border-paper-border p-5'>
		// 				<h2 className='font-semibold text-[13px] text-ink mb-3'>
		// 					Update status
		// 				</h2>
		// 				<div className='space-y-2 mb-4'>
		// 					{ALL_STATUSES.map((s) => (
		// 						<button
		// 							key={s}
		// 							onClick={() => setSelectedStatus(s)}
		// 							className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-[13px] font-semibold capitalize transition ${
		// 								selectedStatus === s
		// 									? 'border-puff bg-puff/5 text-puff'
		// 									: 'border-paper-border text-paper-muted hover:border-paper-muted hover:text-ink'
		// 							}`}
		// 						>
		// 							<span>{s}</span>
		// 							{selectedStatus === s && <span>●</span>}
		// 						</button>
		// 					))}
		// 				</div>
		// 				<button
		// 					onClick={applyStatus}
		// 					disabled={
		// 						updatingStatus ||
		// 						selectedStatus === status ||
		// 						!selectedStatus || status === 'completed'
		// 					}
		// 					className='w-full py-3 rounded-xl bg-ink text-white text-[13px] font-bold hover:bg-ink-soft transition disabled:opacity-30'
		// 				>
		// 					{updatingStatus ? 'Saving…' : 'Save status'}
		// 				</button>
		// 			</div>

		// 			{/* Contact */}
		// 			<div className='bg-white rounded-2xl border border-paper-border p-5'>
		// 				<h2 className='font-semibold text-[13px] text-ink mb-3'>
		// 					Contact customer
		// 				</h2>
		// 				<div className='space-y-2'>
		// 					<a
		// 						href={waLink(order.phone, notifyMsg(order))}
		// 						target='_blank'
		// 						rel='noreferrer'
		// 						className='flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#25D366] text-white text-[13px] font-semibold hover:bg-[#1da851] transition'
		// 					>
		// 						<span>💬</span> Send status update
		// 					</a>
		// 					<a
		// 						href={`tel:${order.phone?.replace(/\D/g, '')}`}
		// 						className='flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-paper-border text-[13px] font-semibold text-paper-muted hover:border-paper-muted hover:text-ink transition'
		// 					>
		// 						<span>📞</span> Call customer
		// 					</a>
		// 					{isGift && order.gift?.recipientPhone && (
		// 						<a
		// 							href={`https://wa.me/${order.gift.recipientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${order.gift.recipient}! 🎁 Your Splendid Puff surprise is on its way!`)}`}
		// 							target='_blank'
		// 							rel='noreferrer'
		// 							className='flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-violet-200 bg-violet-50 text-[13px] font-semibold text-violet-700 hover:bg-violet-100 transition'
		// 						>
		// 							<span>🎁</span> Notify recipient
		// 						</a>
		// 					)}
		// 				</div>
		// 			</div>
		// 		</div>
		// 	</div>
		// </div>
		<div className='p-4 sm:p-6 lg:p-10 xl:p-15 w-full'>
			{/* Breadcrumb */}
			<div className='flex items-center gap-2 mb-5 text-[13px]'>
				<button
					onClick={() => navigate('/admin/orders')}
					className='text-paper-muted hover:text-ink font-medium transition'
				>
					Orders
				</button>
				<span className='text-paper-muted'>/</span>
				<span className='font-mono font-bold text-ink'>
					{order.ref}
				</span>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5'>
				{/* ── Left ── */}
				<div className='space-y-4'>
					{/* Header */}
					<div className='bg-white rounded-2xl border border-paper-border overflow-hidden'>
						<div className='px-4 sm:px-6 py-5 flex items-start justify-between gap-3'>
							<div className='min-w-0'>
								{isGift && (
									<span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[11px] font-bold mb-2'>
										🕵️ Anonymous gift
									</span>
								)}
								<h1 className='font-mono font-bold text-[22px] sm:text-[28px] text-ink leading-none truncate'>
									{order.ref}
								</h1>
								<p className='text-base capitalize text-paper-muted mt-1'>
									{order.campus}
								</p>
							</div>
							<span
								className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] font-bold capitalize border ${STATUS_COLORS[selectedStatus] ?? 'bg-zinc-100 text-zinc-500'}`}
							>
								{selectedStatus}
							</span>
						</div>

						{/* Timeline — horizontally scrollable on small screens */}
						<div className='px-4 sm:px-6 pb-5 overflow-x-auto'>
							<div className='flex items-center gap-0 min-w-max sm:min-w-0'>
								{STATUS_FLOW_ORDER.map((s, i) => {
									const done = i <= statusIdx;
									const current = i === statusIdx;
									return (
										<div
											key={s}
											className='flex items-center flex-1 last:flex-none'
										>
											<div className='flex flex-col items-center gap-1'>
												<div
													className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full text-base sm:text-xl flex items-center justify-center font-bold transition-all ${done ? 'bg-puff text-white' : 'bg-paper-warm text-paper-muted'}`}
												>
													{done
														? current
															? '●'
															: '✓'
														: '○'}
												</div>
												<span
													className={`text-[11px] sm:text-base font-semibold capitalize whitespace-nowrap ${current ? 'text-puff' : done ? 'text-ink-soft' : 'text-paper-muted'}`}
												>
													{s}
												</span>
											</div>
											{i <
												STATUS_FLOW_ORDER.length -
													1 && (
												<div
													className={`flex-1 h-0.5 mx-1 mb-4 min-w-[16px] ${i < statusIdx ? 'bg-puff' : 'bg-paper-border'}`}
												/>
											)}
										</div>
									);
								})}
							</div>
						</div>
					</div>

					{/* Customer info */}
					<div className='flex flex-col sm:flex-row items-start justify-between gap-5 bg-white rounded-2xl border border-paper-border p-5'>
						<div className='w-full sm:w-auto'>
							<h2 className='font-semibold text-[14px] text-ink mb-4'>
								{isGift ? 'Gift details' : 'Customer'}
							</h2>
							<dl className='grid grid-cols-[110px_1fr] gap-y-3 gap-x-4 text-[13px]'>
								{isGift ? (
									<>
										<Dt>Sender</Dt>
										<Dd>
											Anonymous ({order.buyersWhatsapp})
										</Dd>
										<Dt>Recipient</Dt>
										<Dd>
											{order.anonymous?.recipientName ??
												'—'}
											{order.anonymous?.receipientWhatsapp
												? ` · ${order.anonymous.receipientWhatsapp}`
												: ''}
										</Dd>
										{order.anonymous?.giftNote && (
											<>
												<Dt>Note</Dt>
												<Dd className='italic text-paper-muted'>
													"{order.anonymous.giftNote}"
												</Dd>
											</>
										)}
									</>
								) : (
									<>
										<Dt>Name</Dt>
										<Dd>{order.buyersName}</Dd>
										<Dt>WhatsApp</Dt>
										<Dd>{order.buyersWhatsapp}</Dd>
									</>
								)}
								<Dt>Pickup</Dt>
								<Dd>{order.deliveryLocation}</Dd>
								<Dt>Campus</Dt>
								<Dd>{order.campus}</Dd>
							</dl>
						</div>
						<div className='w-full sm:w-1/2'>
							<h2 className='font-semibold text-[14px] text-ink mb-4'>
								Receipt
							</h2>
							<div
								style={{
									backgroundImage: `url(${order.receipt.url})`,
								}}
								className='bg-cover bg-center h-48 sm:h-60 w-full rounded-xl'
							/>
						</div>
					</div>

					{/* Items — receipt style */}
					<div className='bg-white border-2 border-dashed border-paper-border rounded-2xl overflow-hidden'>
						<div className='px-5 py-3 border-b border-dashed border-paper-border flex items-center justify-between'>
							<span className='font-mono text-[11px] text-paper-muted uppercase tracking-widest'>
								Items
							</span>
						</div>
						<div className='divide-y divide-paper-border/50'>
							{Array.isArray(order.orders) ? (
								order.orders.map((item) => (
									<div
										key={item.id}
										className='flex items-center justify-between gap-3 px-5 py-3'
									>
										<div className='min-w-0'>
											<span className='text-base font-medium text-ink'>
												{item.name} {item.size}
											</span>
											<span className='ml-2 font-mono text-sm text-paper-muted'>
												×{item.quantity}
											</span>
										</div>
										<span className='shrink-0 font-mono text-[14px] font-medium'>
											{formatNaira(
												item.subtotal ??
													item.qty * item.price,
											)}
										</span>
									</div>
								))
							) : (
								<div className='px-5 py-3 text-[14px] text-ink'>
									{String(order.items)}
								</div>
							)}
						</div>
						<div className='cut-line mx-5' />
						<div className='flex items-center justify-between px-5 py-3'>
							<span className='font-bold text-base uppercase tracking-wider text-ink'>
								Total
							</span>
							<span className='font-mono font-bold text-[22px] text-puff'>
								{formatNaira(total)}
							</span>
						</div>
					</div>
				</div>

				{/* ── Right: actions ── */}
				<div className='space-y-4'>
					{nextAction && (
						<div className='bg-white rounded-2xl border border-paper-border p-5'>
							<h2 className='font-semibold text-[13px] text-ink mb-3'>
								Next step
							</h2>
							<button
								onClick={quickAdvance}
								disabled={updatingStatus}
								className='w-full bg-puff capitalize hover:bg-puff-dim text-white font-bold text-base py-3.5 rounded-xl transition active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-puff/20'
							>
								{updatingStatus ? '…' : nextAction}
							</button>
						</div>
					)}

					{/* Manual status */}
					<div className='bg-white rounded-2xl border border-paper-border p-5'>
						<h2 className='font-semibold text-[13px] text-ink mb-3'>
							Update status
						</h2>
						<div className='space-y-2 mb-4'>
							{ALL_STATUSES.map((s) => (
								<button
									key={s}
									onClick={() => setSelectedStatus(s)}
									className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-[13px] font-semibold capitalize transition ${
										selectedStatus === s
											? 'border-puff bg-puff/5 text-puff'
											: 'border-paper-border text-paper-muted hover:border-paper-muted hover:text-ink'
									}`}
								>
									<span>{s}</span>
									{selectedStatus === s && <span>●</span>}
								</button>
							))}
						</div>
						<button
							onClick={applyStatus}
							disabled={
								updatingStatus ||
								selectedStatus === status ||
								!selectedStatus ||
								status === 'completed'
							}
							className='w-full py-3 rounded-xl bg-ink text-white text-[13px] font-bold hover:bg-ink-soft transition disabled:opacity-30'
						>
							{updatingStatus ? 'Saving…' : 'Save status'}
						</button>
					</div>

					{/* Contact */}
					<div className='bg-white rounded-2xl border border-paper-border p-5'>
						<h2 className='font-semibold text-[13px] text-ink mb-3'>
							Contact customer
						</h2>
						<div className='space-y-2'>
							<a
								href={waLink(order.phone, notifyMsg(order))}
								target='_blank'
								rel='noreferrer'
								className='flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#25D366] text-white text-[13px] font-semibold hover:bg-[#1da851] transition'
							>
								<span>💬</span> Send status update
							</a>
							<a
								href={`tel:${order.phone?.replace(/\D/g, '')}`}
								className='flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-paper-border text-[13px] font-semibold text-paper-muted hover:border-paper-muted hover:text-ink transition'
							>
								<span>📞</span> Call customer
							</a>
							{isGift && order.gift?.recipientPhone && (
								<a
									href={`https://wa.me/${order.gift.recipientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${order.gift.recipient}! 🎁 Your Splendid Puff surprise is on its way!`)}`}
									target='_blank'
									rel='noreferrer'
									className='flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-violet-200 bg-violet-50 text-[13px] font-semibold text-violet-700 hover:bg-violet-100 transition'
								>
									<span>🎁</span> Notify recipient
								</a>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function Dt({ children }) {
	return (
		<dt className='text-base capitalize font-medium text-paper-muted self-start pt-0.5'>
			{children}
		</dt>
	);
}
function Dd({ children, className = '' }) {
	return (
		<dd className={`text-sm capitalize font-medium text-ink ${className}`}>
			{children}
		</dd>
	);
}
