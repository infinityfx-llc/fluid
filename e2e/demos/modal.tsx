import { useState } from 'react';
import { Button, ModalRoot, ModalContent, ModalFooter, Annotation, Field, CardContent } from '@/fluid';
import { Animate } from '@infinityfx/lively';

export default function () {
	const [open, setOpen] = useState(false);

	return <>
		<Animate animate={{
			opacity: [0, 1],
            translate: ['0px 8px', '0px 0px'],
			delay: .25
		}}>
			<Button onClick={() => setOpen(true)}>
				Open modal
			</Button>
		</Animate>

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
