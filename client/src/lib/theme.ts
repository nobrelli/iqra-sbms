import { Severity } from "@/types/ui"
import { createTheme, localStorageColorSchemeManager, MantineColor, MantineColorsTuple } from "@mantine/core"


const iqraColor: MantineColorsTuple = [
    '#effee7',
    '#e0f8d4',
    '#c2efab',
    '#a2e67e',
    '#87de57',
    '#75d940',
    '#6bd731',
    '#59be23',
    '#4da91b',
    '#3d920c'
]

export const severityColors: Record<Severity, MantineColor> = {
    info: 'blue',
    success: 'green',
    warning: 'orange',
    error: 'red'
}

export const theme = createTheme({
    fontFamily: 'DM Sans Variable, sans-serif',
    colors: {
        iqra: iqraColor
    },
    cursorType: 'pointer',
    primaryColor: 'iqra',
    autoContrast: true,
    luminanceThreshold: 0.4,
    components: {
        Paper: {
            defaultProps: {
                radius: 'md'
            }
        },
        ModalOverlay: {
            defaultProps: {
                backgroundOpacity: 0.5,
                blur: 4
            }
        }
    }
})

export const colorSchemeManager = localStorageColorSchemeManager({
    key: 'iqra-scheme',
})