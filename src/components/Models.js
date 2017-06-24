import React, { Component } from 'react'
import ModelList from './ModelList'
import capitalize from 'utils/capitalize'
import AddEditForm from './AddEditForm'
import { Modal } from 'pkjs-react-components'

import {
	Paragraph,
	Tabs,
	TextInput,
	Button
} from 'pkjs-react-components'

const listQueryObject = (listQuery, fields) => {
	const cleanFields = fields
		.filter(({ hidden, type }) => {
			if (hidden) { return false }
			if (type.kind === 'SCALAR') { return true }
			return false
		})

	const queryFields = cleanFields
		.map(({ name }) => name)
		.join(' ')

	return {
		query: {
			name: listQuery.name,
			template: `{ ${listQuery.name} { ${queryFields} } }`
		},
		fields: cleanFields
	}
}

const createQueryObject = (createMutation, fields) => {
	const cleanFields = fields
		.filter(({ hidden, type }) => {
			if (hidden) { return false }
			if (type.kind === 'SCALAR' && type.name === 'ID') { return false }
			if (type.kind === 'SCALAR') { return true }
			return false
		})

	const mutationArgs = cleanFields
		.map(({ name, type }) => `$${name}: ${type.name}!`)
		.join(', ')

	const mutationProps = cleanFields
		.map(({ name }) => `${name}: $${name}`)
		.join(', ')

	const mutationResponseFields = fields
		.map(({ name, type }) => {
			if (type.kind === 'LIST' && type.ofType.kind === 'OBJECT') {
				return `${name} { id }`
			}

			return name
		})
		.join(' ')

	return {
		query: {
			name: createMutation.name,
			template: `
				mutation ${createMutation.name}(${mutationArgs}) {
					${createMutation.name}(${mutationProps}) {
						${mutationResponseFields}
					}
				}`
		},
		fields: cleanFields
	}
}

export default class Models extends Component {
	constructor(props) {
		super(props)
		this.state = { isOpen: false }
	}

	handleTabChange = (activeTab) => {
		this.setState({ activeTab })
	}

	handleOnSearch = (e) => {
		this.setState({ searchText: e.target.value })
	}

	renderModelTabs() {
		const { gqlRoot } = this.props

		return gqlRoot.map(model => {
				const listQueryObj = listQueryObject(model._queries.list, model.fields)
				const createQueryObj = createQueryObject(model._mutations.create, model.fields)

				return (
					<Tabs.Panel
						label={capitalize(model.name)}
						id={model.name}
					>
						<div>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									borderBottom: '1px solid #eee'
								}}
							>
								<TextInput
									placeholder={`Search ${model.name}`}
									onChange={this.handleOnSearch}
								/>
								<Button
									type="primary"
									onClick={() => this.setState({ isOpen: true })}
								>
									Add {model.name}
								</Button>
							</div>
							<ModelList
								searchText={this.state.searchText}
								fields={listQueryObj.fields}
								query={listQueryObj.query}
							/>
							<Modal
								show={this.state.isOpen}
								onClose={() => this.setState({ isOpen: false })}
							>
								<Modal.Header>
									Add {model.name}
								</Modal.Header>
								<Modal.Content
									style={{
										padding: '20px 40px'
									}}
								>
									<AddEditForm
										updateQuery={listQueryObj.query}
										fields={createQueryObj.fields}
										query={createQueryObj.query}
										onSubmit={(values) => console.log(values)}
									/>
								</Modal.Content>
							</Modal>
						</div>
					</Tabs.Panel>
				)
			})
	}

	render() {
		return (
			<Tabs
				activeTab={this.state.activeTab}
				onTabChange={this.handleTabChange}
			>
				{this.renderModelTabs()}
			</Tabs>
		)
	}
}
