import { createContext, useContext, useEffect, useState } from 'react'

const GenresContext = createContext()

export default function GenresProvider({ children }) {
	const [genres, setGenres] = useState([])
	const API_KEY = '893dbe0fab5554f9ef346ade4c676aa3'

	useEffect(() => {
		const fetchGenres = async () => {
			try {
				const response = await fetch(
					`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
				)
				if (!response.ok) throw Error('Ошибка загрузки жанров!')
				const data = await response.json()
				setGenres(data.genres || [])
			} catch (error) {
				console.error('Ошибка загрузки жанров:', error)
			}
		}
		fetchGenres()
	}, [])

	return (
		<GenresContext.Provider value={genres}>{children}</GenresContext.Provider>
	)
}

export const useGenres = () => useContext(GenresContext)
