import { List } from 'antd'
import MovieCard from '../MovieCard/MovieCard'
import styles from './MovieList.module.scss'

export default function MovieList({ movies, rateMovie }) {
	return (
		<List
			grid={{ column: 2, gutter: 20 }}
			dataSource={movies}
			renderItem={movie => (
				<List.Item
					key={movie.id}
					className={styles.list_item}
				>
					<MovieCard
						movie={movie}
						rateMovie={rateMovie}
					/>
				</List.Item>
			)}
		/>
	)
}
