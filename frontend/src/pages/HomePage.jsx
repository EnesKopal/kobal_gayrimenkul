import HeroSearch from '../components/HeroSearch';
import CallToActionCards from '../components/CallToActionCards';
import FeaturedList from '../components/FeaturedList';

function HomePage() {
  return (
    <div className="homepage">
      <HeroSearch />
      <CallToActionCards /> 
      <FeaturedList />
    </div>
  );
}

export default HomePage;