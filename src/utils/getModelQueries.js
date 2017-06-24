import capitalize from 'utils/capitalize'

const getModelQueries = (types, dataRequirements) => {
	const rootQuery = types.find(({ kind, name }) => name === 'RootQuery')
	const rootMutation = types.find(({ kind, name }) => name === 'RootMutation')

	const getQueries = rootQuery.fields.filter(
		({ type }) => (type.kind === 'OBJECT')
	)

	let queries = []

	getQueries.forEach(getQuery => {
		const _dataRequirement = dataRequirements[capitalize(getQuery.name)] || dataRequirements[getQuery.name]

		queries.push({
			name: getQuery.name,
			type: getQuery.type.name,
			fields: types
				.find(({ kind, name }) => name === getQuery.type.name)
				.fields
				.map(field => {
					return {
						...field,
						..._dataRequirement.fields[field.name]
					}
				}),
			_dataRequirement: _dataRequirement,
			_queries: {
				get: getQuery,
				list: rootQuery.fields.find(
					({ name, type }) => (
						type.kind === 'LIST' &&
						name.startsWith('list') &&
						type.ofType.name === getQuery.type.name
					)
				)
			},
			_mutations: {
				create: rootMutation.fields.find(
					({ name, type }) => (
						type.kind === 'OBJECT' &&
						name.startsWith('create') &&
						type.name === getQuery.type.name
					)
				),
				update: rootMutation.fields.find(
					({ name, type }) => (
						type.kind === 'OBJECT' &&
						name.startsWith('update') &&
						type.name === getQuery.type.name
					)
				),
				remove: rootMutation.fields.find(
					({ name, type }) => (
						type.kind === 'OBJECT' &&
						name.startsWith('remove') &&
						type.name === getQuery.type.name
					)
				)
			}
		})
	})


	return queries
}

export default getModelQueries
