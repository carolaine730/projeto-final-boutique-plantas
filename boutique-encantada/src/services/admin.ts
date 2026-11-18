import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

export const ADMIN_UID = 'CxKRhgfILDTDwXMsqEJXbubn8uu1';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!auth) {
      setChecking(false);
      return;
    }

    return onAuthStateChanged(
      auth,
      user => {
        setIsAdmin(user?.uid === ADMIN_UID);
        setChecking(false);
      },
      () => {
        setIsAdmin(false);
        setChecking(false);
      }
    );
  }, []);

  return { isAdmin, checking };
}