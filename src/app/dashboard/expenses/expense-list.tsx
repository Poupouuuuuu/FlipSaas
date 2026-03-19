'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Trash2, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteExpense } from './actions'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function ExpenseList({ expenses }: { expenses: any[] }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-dashed">
        <Receipt className="h-10 w-10 text-slate-400 mb-4" />
        <p className="text-slate-500 font-medium">Aucune dépense enregistrée.</p>
      </div>
    )
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val)

  async function handleDelete(id: string) {
    if (!confirm('Voulez-vous vraiment supprimer cette dépense ?')) return
    const formData = new FormData()
    formData.append('expense_id', id)
    try {
      await deleteExpense(formData)
      toast.success('Dépense supprimée')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div className="rounded-xl border shadow-sm overflow-hidden bg-card">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead className="text-right">Montant</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="text-slate-500">
                {format(new Date(expense.date), 'dd MMM yyyy', { locale: fr })}
              </TableCell>
              <TableCell className="font-medium">{expense.title}</TableCell>
              <TableCell className="text-right text-red-500 font-medium">
                -{formatCurrency(expense.amount)}
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                  onClick={() => handleDelete(expense.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
