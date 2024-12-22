import { createContext, useContext, useEffect, useState } from 'react'

const GenresContext = createContext()
const RatingContext = createContext()

export default function AppProvider({ children }) {
	const [genres, setGenres] = useState([])
	const [ratings, setRatings] = useState({})
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

	const setRating = (movieId, rating) => {
		setRatings(prev => ({
			...prev,
			[movieId]: rating
		}))
	}

	return (
		<GenresContext.Provider value={genres}>
			<RatingContext.Provider value={{ ratings, setRating }}>
				{children}
			</RatingContext.Provider>
		</GenresContext.Provider>
	)
}

export const useGenres = () => useContext(GenresContext)
export const useRatings = () => useContext(RatingContext)
