import { FallingSandSimulation } from "@/components/FallingSand/FallingSandSimulation";
import { Helmet } from "react-helmet";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Falling Sand Simulation | Classic Pixel Physics</title>
        <meta name="description" content="Interactive falling sand simulation with sand, water, and stone particles. Classic retro pixel physics game." />
      </Helmet>
      <FallingSandSimulation />
    </>
  );
};

export default Index;
