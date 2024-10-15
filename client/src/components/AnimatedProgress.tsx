import { Collapse, CollapseProps, Progress } from "@mantine/core";

export const AnimatedProgress = (props: CollapseProps) => (
    <Collapse {...props}>
        <Progress value={100} animated radius={0} />
    </Collapse>
)