import React, { Component } from 'react'
import { Button, TextInput } from 'pkjs-react-components'
import fetch from 'utils/customFetch'
import capitalize from 'utils/capitalize'
import { graphql, gql } from 'react-apollo'

class AddEditForm extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	componentWillReceiveProps(props) {
		if (props.defaultValues && props.defaultValues.id) {
			this.setState({ ...props.defaultValues })
		}
	}

	handleOnSubmit = (e) => {
		e.preventDefault()
		const { query } = this.props
		const createMutationFunc = this.props[query.name]

		if (createMutationFunc) {
			createMutationFunc({ variables: { ...this.state } })
		}
	}

	handleImageUpload = ({ target }) => {
		const { name, files } = target
		const formData = new FormData()
		formData.append('file', files.item(0))
		customFetch('/api/upload', {
				method: 'POST',
				body: formData
			})
			.then((image) => {
				this.setState({
					[name]: image
				})
			})
	}

	getFieldComponent = (field) => {
		const { defaultValues } = this.props
		const label = capitalize(field.name)
		const value = this.state[field.name]

		if (field.type.kind === 'SCALAR') {
			return (
				<TextInput
					placeholder={label}
					name={field.name}
					type='text'
					value={value}
					onChange={(e) => this.setState({ [field.name]: e.target.value })}
				/>
			)
		}

		if (field.type.name === 'ImageInput') {
			const img = this.state[field.name]

			return (
				<div>
					<label>{label}</label>
					<div>
						<input type="file" name={field.name} onChange={this.handleImageUpload} />
						{img ? <img src={`http://res.cloudinary.com/pakistanjs-com/image/upload/w_250,h_200,c_fit/${img.public_id}`} /> : null}
					</div>
				</div>
			)
		}
	}

	render() {
		const { fields } = this.props

		return (
			<form onSubmit={this.handleOnSubmit}>
				{fields.map(this.getFieldComponent)}
				<Button
					type='primary'
					onClick={this.handleOnSubmit}
				>
					Add
				</Button>
			</form>
		)
	}
}

function buildQueries(ComponentToWrap) {
	return function(props) {
		const { updateQuery, query, ...rest } = props
		// const cleanFields = fields
		// 	.filter(({ hidden, type }) => {
		// 		if (hidden) { return false }
		// 		if (type.kind === 'SCALAR' && type.name === 'ID') { return false }
		// 		if (type.kind === 'SCALAR') { return true }
		// 		return false
		// 	})
		//
		// const mutationArgs = cleanFields
		// 	.map(({ name, type }) => `$${name}: ${type.name}!`)
		// 	.join(', ')
		//
		// const mutationProps = cleanFields
		// 	.map(({ name }) => `${name}: $${name}`)
		// 	.join(', ')
		//
		// const mutationResponseFields = fields
		// 	.map(({ name, type }) => {
		// 		if (type.kind === 'LIST' && type.ofType.kind === 'OBJECT') {
		// 			return `${name} { id }`
		// 		}
		//
		// 		return name
		// 	})
		// 	.join(' ')

		const Wrapped = graphql(
			gql(query.template),
			{
				name: query.name,
				options: ({ match }) => ({
					refetchQueries: [{
						query: gql(updateQuery.template)
					}]
				})
			}
		)(ComponentToWrap)

		return <Wrapped
			{...props}
		/>
	}
}

export default buildQueries(AddEditForm)
