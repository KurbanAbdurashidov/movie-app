import { Alert, Flex, Input, Layout, Pagination, Spin, Tabs } from 'antd'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'
import MovieList from '../../ui/MovieList/MovieList'
import styles from './Home.module.scss'

export default function Home() {
	const [movies, setMovies] = useState([])
	const [ratedMovies, setRatedMovies] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalMovies, setTotalMovies] = useState(0)
	const [searchQuery, setSearchQuery] = useState('')
	const [guestSessionId, setGuestSessionId] = useState(null)
	const [activeTab, setActiveTab] = useState('search')

	const API_KEY = '893dbe0fab5554f9ef346ade4c676aa3'
	const MOVIES_PER_PAGE = 20

	const createGuestSession = async () => {
		try {
			const response = await fetch(
				`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${API_KEY}`
			)
			if (!response.ok) throw Error('Ошибка создания сессии')
			const data = await response.json()
			setGuestSessionId(data.guest_session_id)
		} catch (error) {
			setError(error.message)
		}
	}

	const fetchMovies = async (query = '', page = 1) => {
		setLoading(true)
		setError(null)

		try {
			const response = await fetch(
				`https://api.themoviedb.org/3/${query ? 'search/movie' : 'trending/movie/week'}?api_key=${API_KEY}&query=${query}&page=${page}&per_page=${MOVIES_PER_PAGE}`
			)
			if (!response.ok) {
				throw Error(`Error! ${response.status}`)
			}
			const data = await response.json()
			setMovies(data.results || [])
			setTotalMovies(data.total_results || 0)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	const fetchRatedMovies = async () => {
		if (!guestSessionId) return

		setLoading(true)
		setError(null)

		try {
			const response = await fetch(
				`https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=${API_KEY}`
			)
			if (!response.ok) throw Error(`Ошибка! ${response.status}`)
			const data = await response.json()
			setRatedMovies(data.results || [])
			setTotalMovies(data.total_results || 0)
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	const debouncedFetchMovies = debounce(query => {
		setCurrentPage(1)
		fetchMovies(query, 1)
	}, 500)

	useEffect(() => {
		if (!guestSessionId) {
			createGuestSession()
		}
	}, [guestSessionId])

	useEffect(() => {
		if (activeTab === 'search' && searchQuery) {
			debouncedFetchMovies(searchQuery, currentPage)
		} else if (activeTab === 'search' && !searchQuery) {
			fetchMovies('', currentPage)
		} else if (activeTab === 'rated' && guestSessionId) {
			fetchRatedMovies()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchQuery, currentPage, activeTab, guestSessionId])

	const rateMovie = async (movieId, rating) => {
		try {
			await fetch(
				`https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${guestSessionId}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ value: rating })
				}
			)
			// setRatedMovies(prevMovies => {
			// 	prevMovies.map(movie =>
			// 		movie.id === movieId ? { ...movie, rating } : movie
			// 	)
			// })
		} catch (error) {
			console.error(error)
		}
	}

	const handlePageChange = page => {
		setCurrentPage(page)
	}

	const handleSearchChange = event => {
		setSearchQuery(event.target.value)
	}

	const tabs = [
		{
			label: 'Search',
			key: 'search',
			children: (
				<>
					<Input
						placeholder='Type to search...'
						value={searchQuery}
						onChange={handleSearchChange}
						style={{
							marginBottom: 20,
							width: '100%'
						}}
					/>
					<Flex
						align='center'
						justify='center'
						style={{
							minHeight: '90vh'
						}}
					>
						{loading ? (
							<Spin size='large' />
						) : (
							<MovieList
								movies={movies}
								rateMovie={rateMovie}
							/>
						)}
					</Flex>
					<Pagination
						align='center'
						current={currentPage}
						total={totalMovies}
						pageSize={MOVIES_PER_PAGE}
						onChange={handlePageChange}
						style={{ marginTop: 20 }}
					/>
				</>
			)
		},
		{
			label: 'Rated',
			key: 'rated',
			children: (
				<>
					<Flex
						justify='center'
						style={{
							minHeight: '90vh'
						}}
					>
						{loading ? (
							<Spin size='large' />
						) : (
							<MovieList
								movies={ratedMovies}
								rateMovie={rateMovie}
							/>
						)}
					</Flex>
					<Pagination
						align='center'
						current={currentPage}
						total={totalMovies}
						pageSize={MOVIES_PER_PAGE}
						onChange={handlePageChange}
						style={{ marginTop: 20 }}
					/>
				</>
			)
		}
	]

	return (
		<Layout className={styles.layout}>
			{error && (
				<Alert
					message='Error'
					description={error}
					type='error'
					showIcon
					closable
					style={{
						marginBottom: 25
					}}
					onClose={() => setError(null)}
				/>
			)}
			<Tabs
				centered
				activeKey={activeTab}
				onChange={setActiveTab}
				style={{
					marginBottom: 20
				}}
				items={tabs}
			/>
		</Layout>
	)
}
