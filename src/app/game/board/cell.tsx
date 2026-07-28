'use client'

import { Property } from "./Property"

export default function Cell({ property, color }: { property: Property, color: string | undefined }) {
  return (
    <div
      style={{
        gridRow: property.row,
        gridColumn: property.col,
        backgroundColor: color ?? 'lightblue',
        border: '1px solid black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        textAlign: 'center',
        color: 'red',
        padding: '2px',
      }}
    >
      {property.name}
    </div>
  )
}