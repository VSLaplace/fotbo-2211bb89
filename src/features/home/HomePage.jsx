import HeroPlate from './HeroPlate.jsx'
import Announcement from './Announcement.jsx'
import KeyDatesIndex from './KeyDatesIndex.jsx'
import GreetingFromOrganizers from './GreetingFromOrganizers.jsx'
import AboutTheSociety from './AboutTheSociety.jsx'
import VenueCallout from './VenueCallout.jsx'

// Головна сторінка конгресу: титульна таблиця, анонс, ключові дати,
// звернення оргкомітету, блок про товариство й заклик до сторінки
// місця проведення. Дані секцій читаються з /api (db.json).
export default function HomePage() {
  return (
    <>
      <HeroPlate />
      <Announcement />
      <KeyDatesIndex />
      <GreetingFromOrganizers />
      <AboutTheSociety />
      <VenueCallout />
    </>
  )
}
