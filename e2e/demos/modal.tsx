import { useState } from 'react';
import { Button, ModalRoot, ModalContent, ModalFooter, Annotation, Field, CardContent } from '@/fluid';

export default function () {
	const [open, setOpen] = useState(false);

	return <>
		<Button onClick={() => setOpen(true)}>
			Open modal
		</Button>

		<ModalRoot show={open} onClose={() => setOpen(false)}>
			<ModalContent title="Modal showcase">
				<CardContent>
					<Annotation label="First name">
						<Field variant="minimal" />
					</Annotation>
					<Annotation label="Last name">
						<Field variant="minimal" />
					</Annotation>
				</CardContent>
			</ModalContent>
			<ModalFooter>
				<Button variant="muted" onClick={() => setOpen(false)} style={{ flexBasis: 0, flexGrow: 1 }}>
					Cancel
				</Button>
				<Button variant="default" onClick={() => setOpen(false)} style={{ flexBasis: 0, flexGrow: 1 }}>
					Confirm
				</Button>
			</ModalFooter>
		</ModalRoot>
	</>;
}
