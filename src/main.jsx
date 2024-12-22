import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/styles/global.scss'
import Home from './components/screens/Home/Home.jsx'
import AppProvider from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AppProvider>
			<Home />
		</AppProvider>
	</StrictMode>
)
