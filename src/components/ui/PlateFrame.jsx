import { cn } from '../../lib/cn.js'
import PlateLabel from './PlateLabel.jsx'

/**
 * Фірмовий мотив №1 — «таблиця атласу»: секція у тонкій подвійній рамці,
 * у правому верхньому куті — моно-легенда на кшталт «FIG. 03 — КЛЮЧОВІ ДАТИ».
 *
 * tone="paper" — світла таблиця на папері; tone="ink" — інверсія для темних секцій.
 */
export default function PlateFrame({
  as: Tag = 'section',
  figure,
  label,
  tone = 'paper',
  id,
  className,
  bodyClassName,
  labelClassName,
  children,
}) {
  const dark = tone === 'ink'

  return (
    <Tag
      id={id}
      className={cn(
        dark ? 'plate-frame-ink bg-ink' : 'plate-frame bg-plate',
        'relative',
        className,
      )}
    >
      {(label || figure != null) && (
        <div className={cn('flex justify-end px-5 pt-4 sm:px-7 sm:pt-5', labelClassName)}>
          <PlateLabel figure={figure} tone={dark ? 'inverse' : 'muted'}>
            {label}
          </PlateLabel>
        </div>
      )}
      <div className={cn('px-5 pb-6 pt-4 sm:px-7 sm:pb-8 sm:pt-5', bodyClassName)}>{children}</div>
    </Tag>
  )
}
