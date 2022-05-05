import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Hello from Home.tsx</h1>
      <p>
        <Link to="/">Layout</Link>
      </p>
    </div>
  );
};

export default Home;
