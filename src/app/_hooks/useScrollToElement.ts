const useScrollToElement = () => {
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);

    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 120;

      window.scrollTo({
        behavior: "smooth",
        top: offsetPosition,
      });
    } else {
    }
  };

  return scrollToElement;
};

export default useScrollToElement;
