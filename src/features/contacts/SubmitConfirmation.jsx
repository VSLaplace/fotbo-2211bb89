import Button from '../../components/ui/Button.jsx'
import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import { INQUIRY_TOPICS } from '../../data/inquiryTopics.js'
import { formatUaDate } from '../../lib/format.js'

// Екран підтвердження після успішного надсилання. Показує номер і дату запису,
// які повернув сервер, і короткий підсумок того, що саме надіслано.

const topicLabel = (value) => INQUIRY_TOPICS.find((topic) => topic.id === value)?.label ?? value

export default function SubmitConfirmation({ record, onReset }) {
  const rows = [
    { label: 'Заявник', value: record.name },
    { label: 'Електронна адреса', value: record.email },
    record.organization ? { label: 'Організація', value: record.organization } : null,
    { label: 'Тема запиту', value: topicLabel(record.topic) },
  ].filter(Boolean)

  return (
    <PlateFrame figure="FIG. 07.5" label="Підтвердження" bodyClassName="px-5 sm:px-7">
      <div role="status" aria-live="polite">
        <PlateLabel tone="carmine" className="block">
          {`Запис № ${String(record.id).slice(0, 8).toUpperCase()} · ${formatUaDate(record.createdAt)}`}
        </PlateLabel>

        <h3 className="mt-5 font-serif text-3xl leading-tight text-ink md:text-4xl">Запит надіслано</h3>
        <p className="mt-5 max-w-[58ch] text-[17px] leading-relaxed text-ink-soft">
          Дякуємо! Запит зареєстровано в журналі оргкомітету. Відповідь надійде на адресу{' '}
          <span className="font-mono text-[15px] text-teal">{record.email}</span> — координаційний комітет
          скерує його відповідальній людині в порядку надходження.
        </p>

        <dl className="mt-8 grid gap-px border border-rule bg-rule sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label} className="bg-plate px-4 py-4">
              <dt className="legend text-ink-soft">{row.label}</dt>
              <dd className="mt-2.5 break-words font-serif text-lg leading-snug text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-rule pt-6">
          <Button type="button" variant="accent" onClick={onReset}>
            Надіслати ще один запит
          </Button>
          <Button to="/program" variant="quiet">
            Переглянути програму →
          </Button>
        </div>
      </div>
    </PlateFrame>
  )
}
