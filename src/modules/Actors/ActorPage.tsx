import Actors from ".";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";

const ActorPage = () => {
  return (
    <ErrorBoundary>
      <Actors />
    </ErrorBoundary>
  );
};

export default ActorPage;
