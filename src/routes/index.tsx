import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { createFileRoute } from '@tanstack/react-router'
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import React from 'react'
export const Route = createFileRoute('/')({
  component: Index,
})

// DATA

type Payment = {
  pending: number,
  processing: number,
  success: number,
  failed: number,
  month: string
}

const payments: Payment[] = [
  {
    pending: 100,
    processing: 200,
    success: 300,
    failed: 400,
    month: "january"
  },
  {
    pending: 500,
    processing: 20,
    success: 960,
    failed: 12,
    month: "february"
  }
]

// CHARTS

const chartConfig = {
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-1))"
  },
  processing: {
    label: "Processing",
    color: "hsl(var(--chart-2))"
  },
  success: {
    label: "Success",
    color: "hsl(var(--chart-3))"
  },
  failed: {
    label: "Failed",
    color: "hsl(var(--chart-4))"
  },

} satisfies ChartConfig

function MonthlyBarChart({ data }: { data: Payment[] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={true}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="success" fill="var(--color-success)" radius={4} />
        <Bar dataKey="failed" fill="var(--color-failed)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

function MonthlyLineChart({ data }: { data: Payment[] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line dataKey="pending" stroke="var(--color-pending)" type="monotone" strokeWidth={2} dot={true} />
        <Line dataKey="processing" stroke="var(--color-processing)" type="monotone" strokeWidth={2} dot={true} />
        <Line dataKey="success" stroke="var(--color-success)" type="monotone" strokeWidth={2} dot={true} />
        <Line dataKey="failed" stroke="var(--color-failed)" type="monotone" strokeWidth={2} dot={true} />
      </LineChart>
    </ChartContainer>
  )
}

// TABLE


const tableSchema: ColumnDef<Payment>[] = [
  {
    accessorKey: 'success',
    header: "Success"
  },
  {
    accessorKey: 'failed',
    header: "Failed"
  },
  {
    accessorKey: 'pending',
    header: "Pending"
  },
]

function DataTable({ data }: { data: Payment[] }) {
  const table = useReactTable({
    data: data,
    columns: tableSchema,
    getCoreRowModel: getCoreRowModel(),
  })


  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={tableSchema.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

//FORM

const formSchema = z.object({
  month: z.string().min(3).max(50),
  success: z.coerce.number(),
  failed: z.coerce.number(),
})

function CreateEntryForm({ onSubmit }: { onSubmit: (data: z.infer<typeof formSchema>) => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      failed: 0,
      success: 0,
      month: "march"
    }
  })


  return (
    <Form {...form}>
      <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Month</FormLabel>
              <FormControl>
                <Input type='month' placeholder="month" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="success"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Success</FormLabel>
              <FormControl>
                <Input type='number' placeholder='#success' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="failed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>failed</FormLabel>
              <FormControl>
                <Input type='number' placeholder='#failed' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>

      </form>
    </Form>
  )
}

function Index() {

  const [data, setData] = React.useState<Payment[]>(payments)
  function handleSubmit(newData: z.infer<typeof formSchema>) {
    const values = {
      ...newData,
      pending: 0,
      processing: 0
    }
    setData([...data, values])
  }


  return (
    <div className='p-2 flex flex-col'>
      <div className='grid grid-cols-2 gap-2'>
        <MonthlyBarChart data={data} />
        <MonthlyLineChart data={data}/>
      </div>
      <div className='flex-1'>
        <DataTable data={data} />
      </div>
      <div className='min-h-64'>
        <CreateEntryForm onSubmit={handleSubmit} />
      </div>

    </div>
  )
}