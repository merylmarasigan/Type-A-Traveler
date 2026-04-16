import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function TypographyH1({
  className,
  children,
  ...props
}: ComponentProps<'h1'>) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance',
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

export function TypographyH2({
  className,
  children,
  ...props
}: ComponentProps<'h2'>) {
  return (
    <h2
      className={cn(
        'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

export function TypographyH3({
  className,
  children,
  ...props
}: ComponentProps<'h3'>) {
  return (
    <h3
      className={cn(
        'scroll-m-20 text-2xl font-semibold tracking-tight',
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

export function TypographyH4({
  className,
  children,
  ...props
}: ComponentProps<'h4'>) {
  return (
    <h4
      className={cn(
        'scroll-m-20 text-xl font-semibold tracking-tight',
        className,
      )}
      {...props}
    >
      {children}
    </h4>
  )
}

export function TypographyP({
  className,
  children,
  ...props
}: ComponentProps<'p'>) {
  return (
    <p className={cn('leading-7 not-first:mt-6', className)} {...props}>
      {children}
    </p>
  )
}

export function TypographyBlockquote({
  className,
  children,
  ...props
}: ComponentProps<'blockquote'>) {
  return (
    <blockquote className={cn('italic', className)} {...props}>
      {children}
    </blockquote>
  )
}

export function TypographyList({
  className,
  children,
  ...props
}: ComponentProps<'ul'>) {
  return (
    <ul className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)} {...props}>
      {children}
    </ul>
  )
}

export function TypographyInlineCode({
  className,
  children,
  ...props
}: ComponentProps<'code'>) {
  return (
    <code
      className={cn(
        'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className,
      )}
      {...props}
    >
      {children}
    </code>
  )
}

export function TypographyLead({
  className,
  children,
  ...props
}: ComponentProps<'p'>) {
  return (
    <p className={cn('text-muted-foreground text-xl', className)} {...props}>
      {children}
    </p>
  )
}

export function TypographyLarge({
  className,
  children,
  ...props
}: ComponentProps<'p'>) {
  return (
    <p className={cn('text-lg font-semibold', className)} {...props}>
      {children}
    </p>
  )
}

export function TypographySmall({
  className,
  children,
  ...props
}: ComponentProps<'small'>) {
  return (
    <small
      className={cn('text-sm leading-none font-medium', className)}
      {...props}
    >
      {children}
    </small>
  )
}

export function TypographyMuted({
  className,
  children,
  ...props
}: ComponentProps<'p'>) {
  return (
    <p className={cn('text-muted-foreground text-sm', className)} {...props}>
      {children}
    </p>
  )
}
