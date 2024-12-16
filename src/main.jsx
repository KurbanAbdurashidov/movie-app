import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/styles/global.scss'
import Home from './components/screens/Home/Home.jsx'
import GenresProvider from './context/GenresContext.jsx'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<GenresProvider>
			<Home />
		</GenresProvider>
	</StrictMode>
)
