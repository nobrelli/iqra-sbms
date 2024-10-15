import { LoadingOverlay as MTLoadingOverlay } from "@mantine/core"

export const LoadingOverlay = ({ visible, zIndex = 2 }: 
  { visible: boolean, zIndex?: number }) => {
  return (
    <MTLoadingOverlay
      visible={visible}
      zIndex={zIndex}
      overlayProps={{ radius: 'sm', blur: 2 }}
      loaderProps={{ type: 'dots', size: 'lg' }}
    />
  )
}