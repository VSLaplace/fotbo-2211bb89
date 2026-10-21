import { useRef, useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import SubmitConfirmation from './SubmitConfirmation.jsx'
import { INQUIRY_TOPICS } from '../../data/inquiryTopics.js'
import { submitInquiry } from '../../services/api.js'
import { cn } from '../../lib/cn.js'

// Контрольована форма запиту до оргкомітету. Перевірка на клієнті (імена полів
// збігаються з серверними), надсилання через src/services/api.js, показ помилок
// на конкретних полях, екран підтвердження з номером запису з бази.

const EMPTY_VALUES = { name: '', email: '', organization: '', topic: '', message: '' }
const MESSAGE_MIN = 20
const MESSAGE_MAX = 2000
const ORGANIZATION_MAX = 140
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const MESSAGES = {
  name: 'Вкажіть ім’я та прізвище — щонайменше 2 символи',
  emailRequired: 'Вкажіть електронну адресу для відповіді',
  emailInvalid: 'Перевірте адресу, наприклад ivanenko@lnmu.edu.ua',
  topic: 'Оберіть тему запиту зі списку',
  messageRequired: 'Опишіть запит у кількох реченнях',
  organization: `Назва організації — до ${ORGANIZATION_MAX} символів`,
}

function validate(values) {
  const errors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const organization = values.organization.trim()
  const message = values.message.trim()

  if (name.length < 2) errors.name = MESSAGES.name
  if (!email) errors.email = MESSAGES.emailRequired
  else if (!EMAIL_RE.test(email)) errors.email = MESSAGES.emailInvalid
  if (organization.length > ORGANIZATION_MAX) errors.organization = MESSAGES.organization
  if (!values.topic) errors.topic = MESSAGES.topic
  if (!message) errors.message = MESSAGES.messageRequired
  else if (message.length < MESSAGE_MIN)
    errors.message = `Додайте деталі — щонайменше ${MESSAGE_MIN} символів (зараз ${message.length})`
  else if (message.length > MESSAGE_MAX)
    errors.message = `Скоротіть повідомлення до ${MESSAGE_MAX} символів (зараз ${message.length})`

  return errors
}

const fieldClass = (invalid) =>
  cn(
    'w-full rounded-[2px] border bg-plate px-3.5 py-3 font-sans text-base leading-relaxed text-ink transition-colors duration-200 placeholder:text-ink-soft/55',
    invalid ? 'border-carmine bg-carmine/5' : 'border-rule hover:border-ink-soft/50 focus:border-teal',
  )

function Field({ id, label, hint, error, required = true, optionalNote = 'необов’язково', children }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="legend flex items-baseline gap-2 text-ink-soft">
        <span>{label}</span>
        {required ? (
          <span className="text-carmine" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="font-sans text-[12px] normal-case tracking-normal text-ink-soft/80">{optionalNote}</span>
        )}
      </label>

      <div className="mt-2.5">{children}</div>

      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-carmine">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-[13px] leading-relaxed text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export default function InquiryForm() {
  const [values, setValues] = useState(EMPTY_VALUES)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | sent | error
  const [formError, setFormError] = useState('')
  const [record, setRecord] = useState(null)
  const formRef = useRef(null)

  const setField = (field) => (event) => {
    const { value } = event.target
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
    if (status === 'error') setStatus('idle')
  }

  const describedById = (id, error, hint) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined)

  async function handleSubmit(event) {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)

    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      setStatus('idle')
      setFormError('')
      const field = formRef.current?.elements?.namedItem(firstInvalid)
      field?.focus?.()
      return
    }

    setStatus('submitting')
    setFormError('')

    try {
      const created = await submitInquiry({
        name: values.name.trim(),
        email: values.email.trim(),
        organization: values.organization.trim(),
        topic: values.topic,
        message: values.message.trim(),
      })
      setRecord(created)
      setStatus('sent')
    } catch (error) {
      if (error.fields) {
        // Сервер повертає помилки по полях ({ email: '…' }) і, за потреби,
        // загальну під ключем _form — її показуємо окремим блоком.
        const { _form: formDetail, ...fieldErrors } = error.fields
        setErrors(fieldErrors)
        setFormError(formDetail || 'Сервер не прийняв частину даних — перевірте підсвічені поля.')
      } else {
        setFormError('Не вдалося надіслати запит: сервер не відповів. Спробуйте ще раз за хвилину.')
      }
      setStatus('error')
    }
  }

  function resetForm() {
    setValues(EMPTY_VALUES)
    setErrors({})
    setFormError('')
    setRecord(null)
    setStatus('idle')
  }

  if (status === 'sent' && record) {
    return <SubmitConfirmation record={record} onReset={resetForm} />
  }

  const messageLength = values.message.trim().length
  const counterTone = messageLength > MESSAGE_MAX ? 'text-carmine' : 'text-ink-soft'

  return (
    <PlateFrame figure="FIG. 07.4" label="Форма запиту" bodyClassName="px-5 sm:px-7">
      <form ref={formRef} onSubmit={handleSubmit} noValidate aria-describedby="inquiry-form-note">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-rule pb-5">
          <h3 className="font-serif text-3xl leading-tight text-ink md:text-4xl">Надіслати запит</h3>
          <PlateLabel className="block">Поля з * — обов’язкові</PlateLabel>
        </div>

        <p id="inquiry-form-note" className="mt-5 max-w-[60ch] text-[15px] leading-relaxed text-ink-soft">
          Заповніть форму, і запит потрапить до журналу оргкомітету з номером і датою. Відповідь надійде
          на вказану електронну адресу.
        </p>

        {status === 'error' && formError && (
          <div role="alert" className="mt-6 border-l-2 border-carmine bg-carmine/5 px-4 py-3">
            <p className="font-serif text-lg text-ink">Запит не надіслано</p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{formError}</p>
          </div>
        )}

        <div className="mt-8 grid gap-7 sm:grid-cols-2">
          <Field id="name" label="Ім’я та прізвище" error={errors.name}>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={setField('name')}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describedById('name', errors.name)}
              placeholder="Ірина Ковальчук"
              className={fieldClass(Boolean(errors.name))}
            />
          </Field>

          <Field id="email" label="Електронна адреса" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={setField('email')}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describedById('email', errors.email)}
              placeholder="ivanenko@lnmu.edu.ua"
              className={fieldClass(Boolean(errors.email))}
            />
          </Field>

          <Field
            id="organization"
            label="Організація"
            required={false}
            error={errors.organization}
            hint="Кафедра, університет або установа — щоб оргкомітет підготував відповідь точніше."
            optionalNote="необов’язково"
          >
            <input
              id="organization"
              name="organization"
              type="text"
              autoComplete="organization"
              value={values.organization}
              onChange={setField('organization')}
              aria-invalid={Boolean(errors.organization)}
              aria-describedby={describedById('organization', errors.organization, 'organization-hint')}
              placeholder="ЛНМУ імені Данила Галицького, кафедра гістології"
              className={fieldClass(Boolean(errors.organization))}
            />
          </Field>

          <Field id="topic" label="Тема запиту" error={errors.topic}>
            <select
              id="topic"
              name="topic"
              value={values.topic}
              onChange={setField('topic')}
              aria-invalid={Boolean(errors.topic)}
              aria-describedby={describedById('topic', errors.topic)}
              className={fieldClass(Boolean(errors.topic))}
            >
              <option value="">Оберіть тему зі списку…</option>
              {INQUIRY_TOPICS.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-7">
          <Field id="message" label="Текст запиту" error={errors.message}>
            <textarea
              id="message"
              name="message"
              rows={7}
              value={values.message}
              onChange={setField('message')}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={describedById('message', errors.message)}
              placeholder="Опишіть питання: тема, формат участі, потрібні документи."
              className={cn(fieldClass(Boolean(errors.message)), 'resize-y')}
            />
          </Field>
          <div className="mt-2 flex items-center justify-between gap-4">
            <span className="text-[13px] leading-relaxed text-ink-soft">
              Мінімум {MESSAGE_MIN} символів, максимум {MESSAGE_MAX}.
            </span>
            <span className={cn('tnum font-mono text-[11px] tracking-[0.14em]', counterTone)}>
              {`${messageLength} / ${MESSAGE_MAX}`}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-rule pt-6">
          <Button type="submit" variant="accent" size="lg" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Надсилаємо…' : 'Надіслати запит'}
          </Button>
          <Button type="button" variant="quiet" onClick={resetForm} disabled={status === 'submitting'}>
            Очистити форму
          </Button>
          <p className="ml-auto max-w-[34ch] font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink-soft">
            Запит зберігається в базі оргкомітету
          </p>
        </div>
      </form>
    </PlateFrame>
  )
}
