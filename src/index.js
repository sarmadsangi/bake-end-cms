import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Models from 'components/Models'
import fetch from 'utils/customFetch'
import getGQLSchemaQuery from 'utils/getGQLSchemaQuery'
import getModelQueries from 'utils/getModelQueries'
import { graphql } from 'react-apollo'

import {
	ApolloProvider,
	ApolloClient,
	createNetworkInterface
} from 'react-apollo'


import {
	Button,
	Modal,
	Heading,
	Paragraph,
	Tabs
} from 'pkjs-react-components'

@graphql(getGQLSchemaQuery)
class AdminPanel extends Component {
	constructor(props) {
		super(props)
		this.state = { isOpen: false }
	}

	componentDidMount() {
		const { host } = this.props

		fetch(`${host}/bakeEnd/dataRequirements`)
			.then(dataRequirements => {
				this.setState({ dataRequirements })
			})
	}

	render() {
		const { isOpen, dataRequirements } = this.state
		const { data } = this.props

		if (!dataRequirements) {
			return (
				<div style={{
					position: 'fixed',
					bottom: '15px',
					right: '15px'
				}}>
					<Button>
						Loading ...
					</Button>
				</div>
			)
		}

		const gqlRoot = data && data.__schema ? getModelQueries(data.__schema.types, dataRequirements) : null;

		return (
			<div style={{
				position: 'fixed',
				bottom: '15px',
				right: '15px'
			}}>
				<Modal
					show={isOpen}
					onClose={() => this.setState({ isOpen: false })}
					style={{
						width: '99%',
						height: '98%'
					}}
				>
					<Modal.Header
						onClose={() => this.setState({ isOpen: false })}
					>
						<Heading size="small">BakeEnd CMS</Heading>
					</Modal.Header>
					<Modal.Content>
						<Models
							gqlRoot={gqlRoot}
						/>
					</Modal.Content>
					<Modal.Footer>
						<Paragraph>^ Select one of models from above tabs to manage data</Paragraph>
					</Modal.Footer>
				</Modal>
				<Button
					onClick={() => {
						this.setState({ isOpen: !isOpen })
					}}
					type="primary"
				>
					Admin Panel
				</Button>
			</div>
		)
	}
}


const BakeEndCMSApp = ({ host }) => {
	const client = new ApolloClient({
			networkInterface: createNetworkInterface({
			uri: `${host}/graphql`,
			credentials: 'same-origin'
		}),
		shouldBatch: true,
		addTypename: true
	})

	return (
		<ApolloProvider
			client={client}
		>
			<AdminPanel host={host} />
		</ApolloProvider>
	)
}


export default {
	mount: (elementId, { host }) => {
		ReactDOM.render(
			<BakeEndCMSApp
				host={host}
			/>,
			document.getElementById(elementId)
		)
	},
	BakeEndCMSApp: BakeEndCMSApp
}
