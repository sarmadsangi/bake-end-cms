import React, { Component } from 'react'
import capitalize from 'utils/capitalize'
import { List } from 'pkjs-react-components'
import { graphql, gql } from 'react-apollo'



class ModelList extends Component {
	render() {
		const {
			data,
			searchText,
			fields,
			query
		} = this.props

		let rows = data[query.name] || []

		if (searchText) {
			const pattern = new RegExp(searchText, 'i')

			rows = rows.filter(row => {
				const all_columns = Object.keys(row).filter(k => k != '__typename')
				let match = false

				all_columns.forEach(c => {
					const cellData = row[c]
					if (typeof cellData === 'string' && cellData.match(pattern)) {
						match = true
					}
				})

				return match
			})
		}

		return (
			<List
				rows={rows}
			>
				{fields.map(({ name }) => (
					<List.Column title={capitalize(name)} flex="1 0 0">
						<List.ColumnCell renderValue={name} />
					</List.Column>
				))}
			</List>
		)
	}
}

function buildQueries(ComponentToWrap) {
	return function(props) {
		const { query } = props
		const Wrapped = graphql(gql(query.template))(ComponentToWrap)
		return <Wrapped
			{...props}
		/>
	}
}

export default buildQueries(ModelList)
