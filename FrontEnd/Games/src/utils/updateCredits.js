export const updateCredits = async (navbarRef, setCredits) => {
    if (navbarRef.current?.refreshCredits && navbarRef.current?.getCredits) {
      await navbarRef.current.refreshCredits();
      setTimeout(() => {
        const credits = navbarRef.current.getCredits();
        setCredits(credits);
      }, 100);
    }
  };
  