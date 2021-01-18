import * as React from 'react';
import { User } from 'shared/src/contrib/aidbox';

import { UserRole } from 'src/services/role';

interface SessionContextModel {
    user: User;
    role: UserRole;
    logout: () => void;
}

export const SessionContext = React.createContext<SessionContextModel>({} as any);
