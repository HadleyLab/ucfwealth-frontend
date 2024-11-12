import { Text } from '@beda.software/emr/components';

import { S } from './Footer.styles';
import logo from './images/logo.png';

interface Props {
    type?: 'default' | 'light';
}

export function AppFooter(props: Props) {
    const { type = 'default' } = props;
    const contacts = [
        {
            name: 'Dr. Dexter Hadley',
            phone: '407-266-8742',
            email: 'dexter.hadley@ucf.edu',
        },
        {
            name: 'Dr. Amoy Fraser',
            phone: '407-266-8742',
            email: 'amoy.fraser@ucf.edu',
        },
        {
            name: 'Britney-Ann Wray, BS, CCRP',
            phone: '407-266-8742',
            email: 'britney-ann.wray@ucf.edu',
        },
    ];

    return (
        <S.Footer className={`_${type}`}>
            <S.Content>
                {contacts.map((c, index) => (
                    <S.Contact key={`contact-${index}`}>
                        <S.Image src={logo} />
                        <S.ContactDetails>
                            <Text>{c.name}</Text>
                            <Text>Phone: {c.phone}</Text>
                            <Text>
                                Email: <S.Link href={`mailto:${c.email}`}>{c.email}</S.Link>
                            </Text>
                        </S.ContactDetails>
                    </S.Contact>
                ))}
            </S.Content>
        </S.Footer>
    );
}
