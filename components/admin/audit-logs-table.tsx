'use client'

import { useMemo, useState } from 'react'
import { ScrollText } from 'lucide-react'
import {
  ADMIN_ACTION_LABELS,
  ADMIN_RESOURCE_LABELS,
  type AdminActionType,
  type AdminResourceType,
} from '@/lib/admin/audit-log-types'
import type { AdminActionLog } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

type AuditLogsTableProps = {
  logs: AdminActionLog[]
}

const ACTION_VARIANT: Record<
  AdminActionType,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  create: 'default',
  update: 'secondary',
  delete: 'destructive',
  login: 'outline',
  logout: 'outline',
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function getResourceLabel(log: AdminActionLog) {
  const resource = log.resource as AdminResourceType
  const base = ADMIN_RESOURCE_LABELS[resource] ?? log.resource
  if (log.resource_label) return `${base}: ${log.resource_label}`
  if (log.resource_id) return `${base} (${log.resource_id.slice(0, 8)}…)`
  return base
}

export function AuditLogsTable({ logs }: AuditLogsTableProps) {
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [emailQuery, setEmailQuery] = useState('')

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesAction = actionFilter === 'all' || log.action === actionFilter
      const matchesEmail =
        !emailQuery.trim() ||
        log.user_email.toLowerCase().includes(emailQuery.trim().toLowerCase())
      return matchesAction && matchesEmail
    })
  }, [logs, actionFilter, emailQuery])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-full cursor-pointer sm:w-[180px]">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              All actions
            </SelectItem>
            {(Object.keys(ADMIN_ACTION_LABELS) as AdminActionType[]).map((action) => (
              <SelectItem key={action} value={action} className="cursor-pointer">
                {ADMIN_ACTION_LABELS[action]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="search"
          placeholder="Filter by user email…"
          value={emailQuery}
          onChange={(e) => setEmailQuery(e.target.value)}
          className="sm:max-w-xs"
          aria-label="Filter by user email"
        />
        <p className="text-sm text-muted-foreground sm:ml-auto">
          {filteredLogs.length} of {logs.length} entries
        </p>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
          <ScrollText className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {logs.length === 0
              ? 'No actions recorded yet.'
              : 'No entries match your filters.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[160px]">Time</TableHead>
                <TableHead className="min-w-[180px]">User</TableHead>
                <TableHead className="min-w-[100px]">Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => {
                const action = log.action as AdminActionType
                return (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatTimestamp(log.created_at)}
                    </TableCell>
                    <TableCell className="text-sm font-medium">{log.user_email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={ACTION_VARIANT[action] ?? 'outline'}
                        className={cn('font-normal')}
                      >
                        {ADMIN_ACTION_LABELS[action] ?? log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {getResourceLabel(log)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
