import { useState, useEffect } from 'react';

export const useInvitation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showInvitation, setShowInvitation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowInvitation(true);
    }, 2500); // Simulate loading for 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleOpenInvitation = () => {
    setShowInvitation(false);
  };

  return { isLoading, showInvitation, handleOpenInvitation };
};
