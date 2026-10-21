import Button from '../../components/ui/Button.jsx'
import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import { withCountUa } from '../../lib/format.js'

// Адреса й корпус: фото місця в подвійній рамці таблиці атласу, адреса,
// ключові факти та посилання на карту. Перелік залів живе в окремій
// секції HallsAndOnline, тому тут він не повторюється.
export default function AddressAndCity({ venue, addressContact }) {
  if (!venue) return null

  const image = venue.image
  const halls = Array.isArray(venue.halls) ? venue.halls : []
  const onlineHalls = halls.filter((hall) => hall.online)
  const mapQuery = encodeURIComponent(`${venue.address}, ${venue.city}`)

  return (
    <PlateFrame figure="FIG. 12" label="Адреса та місце">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-14">
        <div className="min-w-0">
          {image?.url && (
            <>
              <div
                className="plate-frame aspect-[4/3] overflow-hidden"
                style={{ backgroundColor: image.avgColor }}
              >
                <img
                  src={image.url}
                  alt={image.alt || venue.name}
                  width={image.width || 940}
                  height={image.height || 627}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              {image.caption && (
                <p className="mt-5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-ink-soft">
                  {image.caption}
                </p>
              )}
            </>
          )}
        </div>

        <div className="min-w-0">
          <PlateLabel tone="teal">{venue.institution}</PlateLabel>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-ink md:text-4xl">{venue.name}</h2>

          <address className="mt-6 not-italic">
            <span className="block font-mono text-sm tracking-[0.06em] text-ink">{venue.address}</span>
            <span className="mt-2 block font-mono text-sm tracking-[0.06em] text-ink">
              {venue.postalCode ? `${venue.postalCode} ` : ''}
              {venue.city}, {venue.country}
            </span>
          </address>

          <dl className="mt-7 grid gap-px border border-rule bg-rule sm:grid-cols-2">
            <div className="bg-plate px-4 py-4">
              <dt className="legend text-ink-soft">Залів у конгресі</dt>
              <dd className="mt-2 font-serif text-xl text-ink">
                {withCountUa(halls.length, ['зала', 'зали', 'зал'])}
              </dd>
            </div>
            <div className="bg-plate px-4 py-4">
              <dt className="legend text-ink-soft">Онлайн-трансляція</dt>
              <dd className="mt-2 font-serif text-xl text-ink">
                {withCountUa(onlineHalls.length, ['зала', 'зали', 'зал'])}
              </dd>
            </div>
          </dl>

          {addressContact?.note && (
            <p className="mt-6 max-w-[62ch] text-[15px] leading-relaxed text-ink-soft">{addressContact.note}</p>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              href={`https://www.openstreetmap.org/search?query=${mapQuery}`}
              variant="outline"
              size="sm"
            >
              Відкрити на карті
            </Button>
            <Button to="/contacts" variant="quiet" size="sm">
              Форма запиту до оргкомітету →
            </Button>
          </div>
        </div>
      </div>
    </PlateFrame>
  )
}
