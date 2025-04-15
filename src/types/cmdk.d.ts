import * as React from "react"

declare module "cmdk" {
  export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode
  }

  export interface CommandInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    children?: React.ReactNode
  }

  export interface CommandListProps
    extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode
  }

  export interface CommandEmptyProps
    extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode
  }

  export interface CommandGroupProps
    extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode
    heading?: React.ReactNode
  }

  export interface CommandItemProps
    extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode
    value?: string
    disabled?: boolean
    onSelect?: (value: string) => void
  }

  export interface CommandSeparatorProps
    extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode
  }

  export interface CommandComponent
    extends React.ForwardRefExoticComponent<
      CommandProps & React.RefAttributes<HTMLDivElement>
    > {
    Input: React.ForwardRefExoticComponent<
      CommandInputProps & React.RefAttributes<HTMLInputElement>
    >
    List: React.ForwardRefExoticComponent<
      CommandListProps & React.RefAttributes<HTMLDivElement>
    >
    Empty: React.ForwardRefExoticComponent<
      CommandEmptyProps & React.RefAttributes<HTMLDivElement>
    >
    Group: React.ForwardRefExoticComponent<
      CommandGroupProps & React.RefAttributes<HTMLDivElement>
    >
    Item: React.ForwardRefExoticComponent<
      CommandItemProps & React.RefAttributes<HTMLDivElement>
    >
    Separator: React.ForwardRefExoticComponent<
      CommandSeparatorProps & React.RefAttributes<HTMLDivElement>
    >
  }

  export const Command: CommandComponent
}
