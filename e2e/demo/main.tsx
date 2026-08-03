import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { FluidProvider } from '../../dist';
import { Button, Badge, Chip, Switch } from '../../dist';

function ShowcaseApp() {
	const [enabled, setEnabled] = useState(true);
	const [count, setCount] = useState(0);

	return (
		<FluidProvider>
			<body style={{
				minHeight: '100vh',
				boxSizing: 'border-box',
				padding: '36px 20px',
				color: '#f8fafc',
				display: 'flex',
				flexDirection: 'column',
				gap: '24px',
				maxWidth: '100%',
				margin: '0 auto',
			}}>
				{/* Header */}
				<div>
					<Badge>Fluid UI 2.0</Badge>
					<h1 style={{ fontSize: '28px', fontWeight: 800, margin: '12px 0 4px 0', letterSpacing: '-0.02em' }}>
						Component Showcase
					</h1>
					<p style={{ color: '#94a3b8', fontSize: '15px', margin: 0 }}>
						Compiled zero-runtime React components
					</p>
				</div>

				{/* Card Container */}
				<div style={{
					background: 'rgba(30, 41, 59, 0.75)',
					border: '1px solid rgba(255, 255, 255, 0.12)',
					borderRadius: '20px',
					padding: '24px 20px',
					display: 'flex',
					flexDirection: 'column',
					gap: '20px',
					backdropFilter: 'blur(12px)',
					boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
				}}>
					<h2 style={{ fontSize: '18px', margin: 0, fontWeight: 700 }}>Interactive Controls</h2>

					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<span style={{ fontSize: '15px', fontWeight: 500 }}>Feature Status</span>
						<Chip color={enabled ? 'green' : 'grey'}>
							{enabled ? 'Active' : 'Disabled'}
						</Chip>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<span style={{ fontSize: '15px', fontWeight: 500 }}>Toggle Switch</span>
						<Switch checked={enabled} onChange={setEnabled} />
					</div>

					<div style={{ paddingTop: '8px' }}>
						<Button
							id="showcase-counter-btn"
							onClick={() => setCount((c) => c + 1)}
							style={{ width: '100%', padding: '14px', fontSize: '15px' }}
						>
							Tap Counter: {count}
						</Button>
					</div>
				</div>

				{/* Footer Info */}
				<div style={{
					background: 'rgba(15, 23, 42, 0.6)',
					border: '1px dashed rgba(255, 255, 255, 0.15)',
					borderRadius: '16px',
					padding: '18px',
					textAlign: 'center',
					fontSize: '14px',
					color: '#64748b'
				}}>
					Built for high-performance React design systems
				</div>
			</body>
		</FluidProvider>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(<ShowcaseApp />);
