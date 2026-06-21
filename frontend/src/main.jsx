import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { ToastProvider } from './components/Toast';
import OrderPage from './pages/OrderPage.jsx';
import AdminLock from './pages/admin/AdminLock.jsx';
import AdminShell from './pages/admin/AdminShell.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminOrderDetail from './pages/admin/AdminOrderDetail.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import { Provider } from 'react-redux';
import store from './redux/store';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Provider store={store}>
			<ToastProvider>
				<BrowserRouter>
					<Routes>
						<Route path='/' element={<OrderPage />} />
						{/* <Route path='/admin' element={<AdminLock />} /> */}
						<Route path='/admin' element={<AdminLock />} />
						<Route path='/admin/*' element={<AdminShell />}>

							<Route element={<AdminOrders />} />
							<Route path='orders' element={<AdminOrders />} />
							<Route
								path='orders/:ref'
								element={<AdminOrderDetail />}
							/>
							<Route
								path='products'
								element={<AdminProducts />}
							/>
						</Route>
					</Routes>
				</BrowserRouter>
			</ToastProvider>
		</Provider>
	</StrictMode>,
);