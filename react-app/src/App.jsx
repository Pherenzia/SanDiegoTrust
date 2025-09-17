import React, { useEffect, useState } from 'react'

export default function App() {
	const [services, setServices] = useState([])

	useEffect(() => {
		fetch('/api/services.json')
			.then(r => r.json())
			.then(setServices)
			.catch(console.error)
	}, [])

	return (
		<div className="app">
			<h1>San Diego Trust — React Widget</h1>
			<ul>
				{services.map(s => (
					<li key={s.id}>
						<h3>{s.title}</h3>
						<p>{s.description}</p>
					</li>
				))}
			</ul>
		</div>
	)
}
