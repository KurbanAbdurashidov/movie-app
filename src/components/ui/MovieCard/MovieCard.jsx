import { Flex, Image, Progress, Rate, Tag, Typography } from 'antd'
import { format } from 'date-fns'
import { useGenres } from '../../../context/GenresContext'

const { Title, Text } = Typography

export default function MovieCard({ movie, rateMovie }) {
	const genres = useGenres()

	const movieGenres = movie.genre_ids
		.map(genreId => genres.find(genre => genre.id === genreId)?.name)
		.filter(Boolean)

	const trimText = text => {
		if (text.length < 200) return text

		let trimmed = text.slice(0, 200)
		const lastSpaceIndex = trimmed.lastIndexOf(' ')

		if (lastSpaceIndex > 0) {
			trimmed = trimmed.slice(0, lastSpaceIndex)
		}

		return `${trimmed}...`
	}

	const handleRate = value => {
		rateMovie(movie.id, value)
	}

	const getRatingColor = rating => {
		if (rating < 3) return '#E90000'
		if (rating < 5) return '#E97E00'
		if (rating < 7) return '#E9D100'
		return '#66E900'
	}

	const formatDate = date => {
		if (!date) return 'January 1, 2015'
		try {
			return format(new Date(date), 'MMMM d, yyyy')
		} catch (error) {
			console.error('Invalid date:', error)
			return 'Invalid date'
		}
	}

	return (
		<Flex>
			<Flex justify='space-between'>
				<Flex
					style={{
						width: 200,
						height: 300
					}}
				>
					<Image
						src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
						alt={movie.title}
						style={{
							minWidth: 200,
							minHeight: 300
						}}
					/>
				</Flex>
				<Flex
					vertical
					justify='space-between'
				>
					<Flex
						vertical
						style={{
							margin: 10
						}}
					>
						<Flex
							align='center'
							justify='space-between'
						>
							<Title style={{ fontSize: '1.2rem' }}>{movie.title}</Title>
							<Progress
								type='circle'
								percent={movie.vote_average * 10}
								size={30}
								strokeWidth={8}
								strokeColor={getRatingColor(movie.vote_average)}
								format={percent => (percent / 10).toFixed(1)}
							/>
						</Flex>
						<Text type='secondary'>{formatDate(movie.release_date)}</Text>
						<Flex
							wrap
							gap='5px 0'
							style={{
								marginTop: 7
							}}
						>
							{movieGenres.map(genre => (
								<Tag
									style={{ fontSize: 11 }}
									key={genre}
								>
									{genre}
								</Tag>
							))}
						</Flex>
						<Text style={{ marginTop: 7, fontSize: 13 }}>
							{trimText(movie.overview)}
						</Text>
					</Flex>
					<Rate
						defaultValue={movie.rating || 0}
						onChange={handleRate}
						count={10}
						style={{
							margin: 10,
							width: '100%',
							fontSize: 16
						}}
					/>
				</Flex>
			</Flex>
		</Flex>
	)
}
