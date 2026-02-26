"use client"

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import clsx from "clsx"

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "center" | "right"
  }
}

type DataType = Record<string, any> & {
  rowspan?: number
  meta?: { isBold?: boolean }
}

interface DataTableProps<TData extends DataType, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData extends DataType, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-sm border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell, cellIndex) => {
                  if (cellIndex == 0 && row.original.rowspan === 0) {
                    return null
                  }

                  return (
                    <TableCell
                      key={cell.id}
                      rowSpan={cellIndex === 0 ? row.original.rowspan || 1 : 1}
                      className={clsx(
                        cell.column.columnDef.meta?.align
                          ? `text-${cell.column.columnDef.meta.align}`
                          : "",
                        row.original.meta?.isBold ? "font-bold" : ""
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
