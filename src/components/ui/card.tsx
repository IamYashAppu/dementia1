"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
}

export function Card({ children, className, hover = true, gradient = false }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-2xl shadow-lg border border-gray-200 overflow-hidden',
        gradient && 'bg-gradient-to-br from-white to-blue-50',
        !gradient && 'bg-white',
        className
      )}
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('p-6 pb-4', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-xl font-semibold text-gray-900', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-gray-600 mt-2', className)}>
      {children}
    </p>
  )
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('p-6 pt-0 flex justify-end', className)}>
      {children}
    </div>
  )
}