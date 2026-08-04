import '../../fluid.css';

import ReactDOM from 'react-dom/client';
import { Badge, Card, CardContent, FluidProvider } from '@/fluid';
import { useEffect } from 'react';

const modules = import.meta.glob<{ default: React.ComponentType }>('../demos/*.tsx');
const routes: Record<string, () => Promise<{ default: React.ComponentType }>> = {};

for (const path in modules) {
	const match = path.match(/\/([^/]+)\.tsx$/);

	if (match) {
		routes[match[1]] = modules[path];
	}
}

const path = window.location.pathname.replace(/^\/|\/$/g, '');
const loader = path ? routes[path] : null;
const Component = loader ? (await loader()).default : null;

function DemoView() {
	useEffect(() => {
		console.log('demoload');

		requestAnimationFrame(() => document.documentElement.dataset.rTick = String(performance.now()));
	}, []);

	return <FluidProvider>
		<body
			style={{
				display: 'flex',
				flexDirection: 'column',
				padding: 'var(--f-spacing-lrg)',
				backgroundColor: 'var(--f-clr-surface-200)'
			}}>
			<Card
				color="back"
				radius="lrg"
				style={{
					flexGrow: 1,
					display: 'flex',
					flexDirection: 'column'
				}}>
				<div style={{
					display: 'flex',
					alignItems: 'baseline',
					gap: 'var(--f-spacing-xsm)',
					color: 'var(--f-clr-grey-600)',
					fontSize: 'var(--f-font-size-xsm)'
				}}>
					<Badge color="var(--f-clr-surface-300)">Fluid UI</Badge> by InfinityFX
				</div>

				<CardContent
					align="center"
					style={{
						flexGrow: 1,
						flexDirection: 'column'
					}}>
					{Component ? <Component /> : <div style={{ padding: '2rem' }}>Unknown demo: {window.location.pathname}</div>}
				</CardContent>
			</Card>
		</body>
	</FluidProvider>;
}

function MainLayout() {
	const isEmbed = window.self !== window.top || new URLSearchParams(window.location.search).has('embed');

	if (isEmbed) return <DemoView />;

	return <body>
		<iframe
			src={`${window.location.pathname}?embed=true`}
			style={{
				width: '432px',
				height: '768px',
				transform: 'scale(2.5)',
				transformOrigin: 'top left',
				border: 'none',
				overflow: 'hidden',
			}}
		/>
	</body>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<MainLayout />);