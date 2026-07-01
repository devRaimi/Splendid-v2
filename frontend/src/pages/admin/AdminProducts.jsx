import { useEffect, useState } from 'react';
import {
	fetchProducts,
	createProduct,
	updateProduct,
	deleteProduct,
} from '../../lib/api';
import { formatNaira } from '../../lib/config';
import { useToast } from '../../components/Toast';
import {
	useCreateItemMutation,
	useFetchItemQuery,
} from '../../redux/itemApiSlice';
import { Pen, PenLine, Trash2 } from 'lucide-react';

const EMPTY_FORM = {
	name: '',
	image: null,
	price: '',
	type: '',
	size: '',
	sizeName: '',
	description: '',
	available: true,
	locationAvailable: 'true',
};
// const CATEGORIES = ['puff-puff', 'combos', 'drinks', 'sides'];
// const EMOJIS = ['🍩', '📦', '🥡', '🥤', '🍱', '🧆', '🥐', '🫙', '🎁'];

export default function AdminProducts() {
	const [createItem, { isLoading, isSuccess, isError, error }] =
		useCreateItemMutation();
	const { data, refetch } = useFetchItemQuery();
	const toast = useToast();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editId, setEditId] = useState(null);
	const [form, setForm] = useState(EMPTY_FORM);
	const [showImage, setShowImage] = useState();
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(null);

	// useEffect(() => {
	//   fetchProducts()
	//     .then(setProducts)
	//     .catch(() => toast("Couldn't load products", true))
	//     .finally(() => setLoading(false));
	// }, [toast]);

	const set = (k) => (e) =>
		setForm((f) => ({
			...f,
			[k]:
				e.target.type === 'checkbox'
					? e.target.checked
					: e.target.value,
		}));

	function openCreate() {
		setForm(EMPTY_FORM);
		setEditId(null);
		setShowForm(true);
	}

	const openEdit = (p) => {
		// setForm({
		// 	name: p.name,
		// 	image: p.image.url,
		// 	price: String(p.size.price),
		// 	type: p.type ?? '',
		// 	locationAvailable: p.available,
		// });
		setForm({
			name: p.name,
			image: p.image.url,
			price: p.size.price,
			type: p.type,
			size: p.size.quantity,
			sizeName: p.size.sizeName,
			description: p.description,
			available: p.available,
			locationAvailable: p.locationAvailable,
		});
		setEditId(p._id);
		setShowForm(true);
	};
	const handleImage = (e) => {
		setForm((prev) => ({ ...prev, image: e.target.files[0] }));
		const url = URL.createObjectURL(e.target.files[0]);
		setShowImage(url);
	};

	useEffect(() => {
		data ? setProducts(data) : null;
		setLoading(false);
	}, [data]);

	useEffect(() => {
		if (isLoading) {
			toast('Loading', isSuccess, isLoading);
		} else if (isError) {
			toast(`Error: ${error.message}`, true, false);
		} else if (isSuccess) {
			toast('Success', isError, isLoading);
		}
	}, [isSuccess, isLoading, isError, error]);

	const save = async () => {
		const formData = new FormData();
		if (!form.name.trim())
			return toast('Product name is required', true, false);
		if (!form.price || isNaN(Number(form.price)))
			return toast('Enter a valid price', true, false);
		if (!form.image) {
			return toast('Enter an Image', true, false);
		}
		if (!form.type) {
			return toast('Enter a Type', true, false);
		}
		if (!form.size) {
			return toast('Enter a Size', true, false);
		}
		if (!form.sizeName) {
			return toast('Enter a Size name', true, false);
		}
		if (!form.locationAvailable) {
			return toast("Enter a the Location it's Available in", true, false);
		}
		for (const [key, value] of Object.entries(form)) {
			formData.append(key, value);
		}
		try {
			// setSaving(true);
			if (editId) {
				const updated = await updateProduct(editId, payload);
				// setProducts((ps) =>
				// 	ps.map((p) => (p.id === editId ? updated : p)),
				// );
				toast('Product updated');
				refetch();
				// console.log('its editing');
			} else {
				// const created = await createProduct(payload);
				// setProducts((ps) => [...ps, created]);
				// toast('Product added');
				const res = await createItem(formData).unwrap();
				setShowForm(false);
				refetch();
			}
		} catch (err) {
			console.log(err);
			toast(err.message ?? 'Save failed', true);
		} finally {
			setSaving(false);
		}
	};

	async function remove(id, name) {
		if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
		try {
			setDeleting(id);
			await deleteProduct(id);
			setProducts((ps) => ps.filter((p) => p.id !== id));
			toast('Product deleted');
		} catch (err) {
			toast(err.message ?? 'Delete failed', true);
		} finally {
			setDeleting(null);
		}
	}

	async function toggleAvailability(p) {
		const updated = { ...p, available: !p.available };
		setProducts((ps) => ps.map((x) => (x.id === p.id ? updated : x)));
		try {
			await updateProduct(p.id, { available: !p.available });
			toast(`${p.name} ${!p.available ? 'enabled' : 'disabled'}`);
		} catch {
			setProducts((ps) => ps.map((x) => (x.id === p.id ? p : x)));
			toast('Update failed', true);
		}
	}

	const byCategory = products.reduce((acc, p) => {
		const cat = p.type;
		if (!acc[cat]) acc[cat] = [];
		acc[cat].push(p);
		return acc;
	}, {});
	// console.log(products)

	return (
		<div className='py-6 px-5 sm:px-10 w-full'>
			<div className='mb-6 flex items-center justify-between'>
				<div>
					<h1 className='font-urbanist font-bold text-[24px] text-ink'>
						Menu items
					</h1>
					<p className='text-[13px] text-paper-muted mt-0.5'>
						{products.length} item{products.length !== 1 ? 's' : ''}{' '}
						· {products.filter((p) => p.available).length} available
					</p>
				</div>
				<button
					onClick={openCreate}
					className='flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-white text-[13px] font-semibold hover:bg-ink-soft transition'
				>
					<span className='text-[16px]'>+</span> Add item
				</button>
			</div>

			{loading ? (
				<div className='space-y-3'>
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className='h-16 rounded-2xl bg-white animate-pulse'
						/>
					))}
				</div>
			) : (
				<div className='space-y-8'>
					{Object.entries(byCategory).map(([cat, items]) => (
						<div key={cat}>
							<p className='text-sm font-bold tracking-widest text-paper-muted mb-3 capitalize'>
								{cat}
							</p>
							<div className='flex items-center flex-wrap gap-3'>
								{items.map((p) => (
									<div
										key={p._id}
										className={`bg-white relative overflow-hidden capitalize rounded-2xl w-full sm:w-[48.5%] md:w-[32.5%] border border-paper-border flex flex-wrap items-center gap-4 transition ${!p.available ? 'opacity-50' : ''}`}
									>
										<div
											style={{
												background: `url(${p.image.url})`,
												backgroundPosition: 'center',
												backgroundSize: 'cover',
											}}
											className='w-full h-75 bg-paper flex items-center justify-center text-2xl shrink-0'
										>
											{/* {p.image.url} */}
										</div>
										<div className='p-4 w-full'>
											<div className='flex justify-between items-center w-full py-3 border-b'>
												<div className='flex flex-col items-start w-1/2 border-r'>
													<span className='text-gray-500'>
														Name
													</span>
													<h3 className='font-semibold text-xl text-ink'>
														{p.name}
													</h3>
													{/* {!p.available && (
													<span className='px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 text-[10px] font-medium'>
														unavailable
													</span>
												)} */}
												</div>
												<div className='flex flex-col items-end w-1/2'>
													<span className='text-gray-500'>
														Size
													</span>
													<h3 className='font-semibold text-xl text-ink'>
														{p.size.sizeName}
													</h3>
												</div>
											</div>

											<div
												className={`flex w-full items-center justify-between py-3 ${p.description ? 'border-b' : ''}`}
											>
												<div className='flex flex-col items-start w-full border-r'>
													<span className='text-gray-500'>
														Quantity
													</span>
													<h3 className='font-semibold text-xl text-ink'>
														{p.size.quantity}
													</h3>
												</div>
												<div className='flex flex-col items-center min-w-max px-3 text-center border-r'>
													<span className='text-gray-500'>
														Location Available
													</span>
													<h3 className='font-semibold text-xl text-ink'>
														{p.locationAvailable ===
														'both'
															? 'Minna, Zaria'
															: p.locationAvailable}
													</h3>
												</div>
												<div className='flex flex-col items-end w-full'>
													<span className='text-gray-500'>
														Price
													</span>
													<h3 className='font-semibold text-xl text-ink'>
														{formatNaira(
															p.size.price,
														)}
													</h3>
												</div>
											</div>
											{p.description && (
												<div className='flex flex-col items-center text-center mt-3 w-full'>
													<span className='text-gray-500'>
														Description
													</span>
													<h3 className='font-semibold text-xl text-ink'>
														{p.description}
													</h3>
												</div>
											)}
											<div className='flex items-center w-full gap-2 shrink-0'>
												{/* <button
												onClick={() =>
													toggleAvailability(p)
												}
												className={`relative w-10 h-5 rounded-full transition-colors ${p.available ? 'bg-puff' : 'bg-paper-border'}`}
											>
												<span
													className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${p.available ? 'left-5' : 'left-0.5'}`}
												/>
											</button> */}
												<button
													onClick={() => openEdit(p)}
													className='p-2 absolute top-3 right-3 z-99! flex items-center justify-center rounded-lg border border-paper-border hover:border-paper-muted hover:bg-white/60 text-gray-200 hover:text-ink transition text-sm duration-500'
												>
													<Pen className='size-5' />
													{/* ✎ */}
												</button>
												<button
													onClick={() =>
														remove(p.id, p.name)
													}
													disabled={deleting === p.id}
													className='p-2 absolute top-3 left-3 z-99! flex items-center justify-center rounded-lg border border-red-500 hover:text-white hover:bg-red-500 text-gray-200 transition duration-500 text-[13px]'
												>
													{deleting === p.id ? (
														'…'
													) : (
														<Trash2 className='size-5' />
													)}
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Slide-over form */}
			{showForm && (
				<div className='fixed inset-0 z-999 flex'>
					<div
						className='flex-1 bg-black/40 backdrop-blur-sm'
						onClick={() => {
							setShowForm(false);
							setShowImage('');
						}}
					/>
					<div className='w-[420px] bg-white h-full overflow-y-auto flex flex-col shadow-2xl animate-slide-up'>
						<div className='px-6 py-5 border-b border-paper-border flex items-center justify-between'>
							<h2 className='font-display font-bold text-[18px] text-ink'>
								{editId ? 'Edit item' : 'New item'}
							</h2>
							<button
								onClick={() => {
									setShowForm(false);
									setShowImage('');
								}}
								className='w-8 h-8 flex items-center justify-center rounded-xl hover:bg-paper text-paper-muted hover:text-ink transition'
							>
								✕
							</button>
						</div>

						<div className='flex-1 px-6 py-5 space-y-5'>
							{/* Emoji picker */}
							<div>
								<FormLabel>Image</FormLabel>
								<div
									style={{
										backgroundImage: `url(${showImage || form.image})`,
										backgroundPosition: 'center',
										backgroundSize: 'cover',
									}}
									className='hover:bg-gray-300 bg-center! bg-cover! relative transition duration-500 w-full h-[200px] border-2 flex items-center justify-center border-dashed border-gray-300 rounded-md bg-gray-200 mt-2'
								>
									<input
										type='file'
										className='h-full w-full absolute opacity-0 cursor-pointer bg-transparent'
										id=''
										onChange={handleImage}
									/>
									<h5
										className={
											showImage ? `hidden` : 'block'
										}
									>
										Click to upload Image
									</h5>
								</div>
							</div>

							<div>
								<FormLabel>
									Name <span className='text-red-400'>*</span>
								</FormLabel>
								<FormInput
									placeholder='e.g. Puff-puff'
									value={form.name}
									onChange={set('name')}
								/>
							</div>

							<div>
								<FormLabel>
									Price (₦){' '}
									<span className='text-red-400'>*</span>
								</FormLabel>
								<FormInput
									type='number'
									placeholder='500'
									value={form.price}
									onChange={set('price')}
								/>
							</div>

							<div>
								<FormLabel>
									Type
									<span className='text-red-400'>*</span>
								</FormLabel>
								<select
									className={FI_CLS}
									value={form.type}
									onChange={set('type')}
								>
									<option value=''>Select Type</option>
									<option value='small chop'>
										Small Chops
									</option>
									<option value='combos'>Combos</option>
									<option value='drink'>Drinks</option>
								</select>
							</div>

							<div>
								<FormLabel>
									Type
									<span className='text-red-400'>*</span>
								</FormLabel>
								<select
									className={FI_CLS}
									value={form.locationAvailable}
									onChange={set('locationAvailable')}
								>
									<option value=''>Location Available</option>
									<option value='minna'>Minna</option>
									<option value='zaria'>Zaria</option>
									<option value='both'>Both</option>
								</select>
							</div>

							<div>
								<FormLabel>
									Size
									<span className='text-red-400'>*</span>
								</FormLabel>
								<FormInput
									type='number'
									placeholder='5'
									value={form.size}
									onChange={set('size')}
								/>
							</div>

							<div>
								<FormLabel>
									Size Name
									<span className='text-red-400'>*</span>
								</FormLabel>
								<FormInput
									type='test'
									placeholder='Small Pack'
									value={form.sizeName}
									onChange={set('sizeName')}
								/>
							</div>

							<div>
								<FormLabel>Description</FormLabel>
								<textarea
									className={`${FI_CLS} min-h-[72px] resize-none`}
									placeholder='Short description for customers'
									value={form.description}
									onChange={set('description')}
								/>
							</div>

							<div className='space-y-3'>
								{/* <Toggle
									label='Has flavour options'
									checked={form.hasFlavour}
									onChange={(e) =>
										setForm((f) => ({
											...f,
											hasFlavour: e.target.checked,
										}))
									}
								/> */}
								<Toggle
									label='Available now'
									checked={form.available}
									onChange={(e) =>
										setForm((f) => ({
											...f,
											available: e.target.checked,
										}))
									}
								/>
							</div>
						</div>

						<div className='px-6 py-5 border-t border-paper-border flex gap-3'>
							<button
								onClick={() => setShowForm(false)}
								className='flex-1 py-3 rounded-xl border border-paper-border text-[14px] font-semibold text-paper-muted hover:text-ink transition'
							>
								Cancel
							</button>
							<button
								onClick={save}
								disabled={saving}
								className='flex-1 py-3 rounded-xl bg-ink text-white text-[14px] font-bold hover:bg-ink-soft transition disabled:opacity-40'
							>
								{saving
									? 'Saving…'
									: editId
										? 'Save changes'
										: 'Add item'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

const FI_CLS =
	'w-full rounded-xl border border-paper-border bg-paper px-4 py-2.5 text-[14px] text-ink placeholder:text-paper-muted outline-none focus:border-puff focus:ring-2 focus:ring-puff/10 transition mt-1.5';

function FormLabel({ children }) {
	return <p className='text-[12px] font-semibold text-ink'>{children}</p>;
}
function FormInput(props) {
	return <input className={FI_CLS} {...props} />;
}

function Toggle({ label, checked, onChange }) {
	return (
		<label className='flex items-center justify-between cursor-pointer p-3 rounded-xl border border-paper-border hover:border-paper-muted transition'>
			<span className='text-[13px] font-medium text-ink'>{label}</span>
			<div className='relative'>
				<input
					type='checkbox'
					className='sr-only'
					checked={checked}
					onChange={onChange}
				/>
				<div
					className={`w-10 h-5 rounded-full transition-colors ${checked ? 'bg-puff' : 'bg-paper-border'}`}
				>
					<span
						className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? 'left-5' : 'left-0.5'}`}
					/>
				</div>
			</div>
		</label>
	);
}
