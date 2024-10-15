export type BaseModalHandle = {
    open: () => void
}

export type FormModalHandle<Data> = BaseModalHandle & {
    setInitialData?: (data: Data) => void
}

export type DeleteConfirmModalHandle<Data> = BaseModalHandle & {
    setDeleteProps: (props: Data) => void
}