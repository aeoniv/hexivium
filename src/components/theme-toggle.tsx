
"use client"

import * as React from "react"
import { Palette } from "lucide-react"

import { useTheme } from "@/contexts/theme-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
          <Palette className="h-6 w-6" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("cyan")}>
          Cyan
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("magenta")}>
          Magenta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
