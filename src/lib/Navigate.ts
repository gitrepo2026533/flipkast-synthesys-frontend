interface NavigateProps {
  navigate: any;
  push: (page: string, ...rest: any[]) => void;
}

const Navigate: NavigateProps = {
  navigate: null,
  push: (page, ...rest) => Navigate.navigate(page, ...rest),
};

export default Navigate;
